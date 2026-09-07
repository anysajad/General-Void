import { useRef, useState, useCallback, useEffect } from "react";
import gsap from "gsap";

export interface VideoTimelineControls {
  isReady: boolean;
  duration: number;
  scrubToTime: (target: number, duration: number, ease?: string) => gsap.core.Tween;
  reverseToStart: (duration: number) => gsap.core.Tween;
  completeTo: (target: number, duration: number) => Promise<void>;
  freezeAt: (time: number) => void;
  getTargetTime: () => number;
  readTime: () => number;
}

export function useVideoTimeline(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  options: { targetTime: number }
): VideoTimelineControls {
  const { targetTime } = options;

  const [isReady, setIsReady] = useState(false);
  const [duration, setDuration] = useState(0);

  const activeTweenRef = useRef<gsap.core.Tween | null>(null);
  const proxyRef = useRef({ time: 0 });
  const targetTimeRef = useRef(targetTime);

  useEffect(() => {
    targetTimeRef.current = targetTime;
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoadedMetadata = () => {
      setDuration(video.duration);
      proxyRef.current.time = 0;
      video.currentTime = 0;
      video.pause();
      setIsReady(true);
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    if (video.readyState >= 1) onLoadedMetadata();

    return () => video.removeEventListener("loadedmetadata", onLoadedMetadata);
  }, [videoRef]);

  const killActive = useCallback(() => {
    if (activeTweenRef.current) {
      activeTweenRef.current.kill();
      activeTweenRef.current = null;
    }
  }, []);

  const scrubToTime = useCallback(
    (target: number, dur: number, ease = "power1.inOut") => {
      const video = videoRef.current;
      if (!video) return gsap.getById?.("noop") as gsap.core.Tween ?? gsap.set({}, {});

      killActive();
      proxyRef.current.time = video.currentTime;

      activeTweenRef.current = gsap.to(proxyRef.current, {
        time: target,
        duration: dur,
        ease,
        overwrite: true,
        onUpdate: () => {
          video.currentTime = proxyRef.current.time;
        },
      });
      return activeTweenRef.current;
    },
    [videoRef, killActive]
  );

  const reverseToStart = useCallback(
    (dur: number) => {
      return scrubToTime(0, dur, "power2.inOut");
    },
    [scrubToTime]
  );

  const completeTo = useCallback(
    (target: number, dur: number): Promise<void> => {
      const video = videoRef.current;
      if (!video) return Promise.resolve();

      return new Promise((resolve) => {
        killActive();
        proxyRef.current.time = video.currentTime;

        activeTweenRef.current = gsap.to(proxyRef.current, {
          time: target,
          duration: dur,
          ease: "power2.inOut",
          overwrite: true,
          onUpdate: () => {
            video.currentTime = proxyRef.current.time;
          },
          onComplete: () => {
            video.currentTime = target;
            video.pause();
            resolve();
          },
        });
      });
    },
    [videoRef, killActive]
  );

  const freezeAt = useCallback(
    (time: number) => {
      const video = videoRef.current;
      if (!video) return;
      killActive();
      video.currentTime = time;
      video.pause();
    },
    [videoRef, killActive]
  );

  const getTargetTime = useCallback(() => targetTimeRef.current, []);

  const readTime = useCallback(() => {
    return videoRef.current?.currentTime ?? 0;
  }, [videoRef]);

  useEffect(() => {
    return () => { killActive(); };
  }, [killActive]);

  return {
    isReady,
    duration,
    scrubToTime,
    reverseToStart,
    completeTo,
    freezeAt,
    getTargetTime,
    readTime,
  };
}
