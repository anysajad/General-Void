import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import gsap from "gsap";

export interface VideoTimelineControls {
  isReady: boolean;
  duration: number;
  currentTime: number;
  scrubTo: (targetProgress: number, duration?: number) => void;
  playTo: (targetTime: number) => Promise<void>;
  pauseAtCurrent: () => void;
  setTime: (time: number) => void;
  getProgress: () => number;
  getTargetTime: () => number;
}

export function useVideoTimeline(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  options: { targetTime?: number } = {}
): VideoTimelineControls {
  const { targetTime = 3.25 } = options;

  const [isReady, setIsReady] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const scrubTweenRef = useRef<gsap.core.Tween | null>(null);
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

    const onTimeUpdate = () => {
      if (!scrubTweenRef.current || !scrubTweenRef.current.isActive()) {
        setCurrentTime(video.currentTime);
      }
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("timeupdate", onTimeUpdate);

    if (video.readyState >= 1) {
      onLoadedMetadata();
    }

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [videoRef]);

  const scrubTo = useCallback(
    (targetProgress: number, scrubDuration = 0.9) => {
      const video = videoRef.current;
      if (!video || !isReady) return;

      if (scrubTweenRef.current) {
        scrubTweenRef.current.kill();
      }

      const target = targetTimeRef.current * Math.max(0, Math.min(1, targetProgress));
      proxyRef.current.time = video.currentTime;

      scrubTweenRef.current = gsap.to(proxyRef.current, {
        time: target,
        duration: scrubDuration,
        ease: "power2.out",
        onUpdate: () => {
          video.currentTime = proxyRef.current.time;
          setCurrentTime(proxyRef.current.time);
        },
      });
    },
    [videoRef, isReady]
  );

  const playTo = useCallback(
    (destTime: number): Promise<void> => {
      const video = videoRef.current;
      if (!video || !isReady) return Promise.resolve();

      return new Promise((resolve) => {
        if (scrubTweenRef.current) {
          scrubTweenRef.current.kill();
        }

        proxyRef.current.time = video.currentTime;

        scrubTweenRef.current = gsap.to(proxyRef.current, {
          time: Math.min(destTime, duration),
          duration: Math.max(0.1, (destTime - video.currentTime) / 2),
          ease: "power2.inOut",
          onUpdate: () => {
            video.currentTime = proxyRef.current.time;
            setCurrentTime(proxyRef.current.time);
          },
          onComplete: () => {
            video.currentTime = Math.min(destTime, duration);
            video.pause();
            setCurrentTime(video.currentTime);
            resolve();
          },
        });
      });
    },
    [videoRef, isReady, duration]
  );

  const pauseAtCurrent = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (scrubTweenRef.current) {
      scrubTweenRef.current.kill();
    }
    video.pause();
    setCurrentTime(video.currentTime);
  }, [videoRef]);

  const setTime = useCallback(
    (time: number) => {
      const video = videoRef.current;
      if (!video) return;
      video.currentTime = Math.max(0, Math.min(time, duration || 4));
      setCurrentTime(video.currentTime);
    },
    [videoRef, duration]
  );

  const getProgress = useCallback(() => {
    const video = videoRef.current;
    if (!video || targetTimeRef.current === 0) return 0;
    return video.currentTime / targetTimeRef.current;
  }, [videoRef]);

  const getTargetTime = useCallback(() => targetTimeRef.current, []);

  useEffect(() => {
    return () => {
      if (scrubTweenRef.current) {
        scrubTweenRef.current.kill();
      }
    };
  }, []);

  return useMemo(
    () => ({
      isReady,
      duration,
      currentTime,
      scrubTo,
      playTo,
      pauseAtCurrent,
      setTime,
      getProgress,
      getTargetTime,
    }),
    [isReady, duration, currentTime, scrubTo, playTo, pauseAtCurrent, setTime, getProgress, getTargetTime]
  );
}
