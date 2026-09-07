import { useRef, useCallback, useEffect } from "react";
import gsap from "gsap";
import WarButton from "./WarButton";
import Reticle from "./Reticle";
import type { VideoTimelineControls } from "../hooks/useVideoTimeline";
import styles from "./IntroScene.module.css";

interface IntroSceneProps {
  videoTimeline: VideoTimelineControls;
  onActivate: () => void;
  videoReady: boolean;
  mouseRef: React.RefObject<{ x: number; y: number }>;
}

export default function IntroScene({
  videoTimeline,
  onActivate,
  videoReady,
}: IntroSceneProps) {
  const reticleRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const topbarRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const isHoveringRef = useRef(false);
  const isActiveRef = useRef(false);
  const scrubTweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!videoReady) return;
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.fromTo(titleRef.current,
      { opacity: 0, y: 20, filter: "blur(8px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, delay: 0.3 }
    );
    tl.fromTo(topbarRef.current,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.8 },
      0.5
    );
    tl.fromTo(buttonRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.8 },
      0.8
    );
    tl.fromTo(hintRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6 },
      1.2
    );
    return () => { tl.kill(); };
  }, [videoReady]);

  const handleMouseEnter = useCallback(() => {
    if (isActiveRef.current || !videoTimeline.isReady) return;
    isHoveringRef.current = true;

    gsap.to(buttonRef.current, {
      y: -4, duration: 0.35, ease: "power2.out",
    });

    gsap.to(reticleRef.current, {
      opacity: 1, scale: 1, duration: 0.4, ease: "power2.out",
    });

    gsap.to(glowRef.current, {
      opacity: 1, scale: 1, duration: 0.6, ease: "power2.out",
    });

    if (scrubTweenRef.current) scrubTweenRef.current.kill();
    const video = document.querySelector("video");
    if (video) {
      const target = videoTimeline.getTargetTime();
      const proxy = { time: video.currentTime };
      scrubTweenRef.current = gsap.to(proxy, {
        time: target,
        duration: 0.95,
        ease: "power2.out",
        onUpdate: () => {
          video.currentTime = proxy.time;
        },
      });
    }
  }, [videoTimeline]);

  const handleMouseMove = useCallback((e: React.PointerEvent) => {
    if (!isHoveringRef.current || !reticleRef.current) return;
    reticleRef.current.style.left = `${e.clientX}px`;
    reticleRef.current.style.top = `${e.clientY}px`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isActiveRef.current) return;
    isHoveringRef.current = false;

    gsap.to(buttonRef.current, {
      y: 0, duration: 0.45, ease: "power2.inOut",
    });

    gsap.to(reticleRef.current, {
      opacity: 0, scale: 0.5, duration: 0.4, ease: "power2.in",
    });

    gsap.to(glowRef.current, {
      opacity: 0, scale: 0.8, duration: 0.5, ease: "power2.in",
    });

    if (scrubTweenRef.current) scrubTweenRef.current.kill();
    const video = document.querySelector("video");
    if (video) {
      const proxy = { time: video.currentTime };
      scrubTweenRef.current = gsap.to(proxy, {
        time: 0,
        duration: 1.1,
        ease: "power2.inOut",
        onUpdate: () => {
          video.currentTime = proxy.time;
        },
      });
    }
  }, []);

  const handleClick = useCallback(async () => {
    if (isActiveRef.current || !videoTimeline.isReady) return;
    isActiveRef.current = true;

    if (scrubTweenRef.current) scrubTweenRef.current.kill();

    const tl = gsap.timeline();

    tl.to(buttonRef.current, { scale: 0.96, duration: 0.08, ease: "power2.in" });
    tl.to(buttonRef.current, { scale: 1, duration: 0.2, ease: "back.out(3)" });

    tl.to(reticleRef.current, {
      scale: 1.3, opacity: 0.8, duration: 0.15, ease: "power2.out",
    }, 0);
    tl.to(reticleRef.current, {
      scale: 0.3, opacity: 0, duration: 0.3, ease: "power2.in",
    }, 0.15);

    tl.to(glowRef.current, {
      opacity: 1, scale: 1.2, duration: 0.2, ease: "power2.out",
    }, 0);
    tl.to(glowRef.current, {
      opacity: 0, scale: 1.5, duration: 0.5, ease: "power2.in",
    }, 0.2);

    tl.to(titleRef.current, { opacity: 0, y: -15, duration: 0.5, ease: "power2.in" }, 0.2);
    tl.to(hintRef.current, { opacity: 0, duration: 0.3 }, 0.2);
    tl.to(topbarRef.current, { opacity: 0, duration: 0.4 }, 0.3);

    tl.call(() => onActivate(), [], 0.6);
  }, [videoTimeline, onActivate]);

  return (
    <div
      ref={sceneRef}
      className={styles.intro}
      onPointerMove={handleMouseMove}
    >
      <div ref={topbarRef} className={styles.topbar}>
        <div className={styles.brand}>WAR COMMAND</div>
        <div className={styles.status}>
          <span className={styles.dot} />
          CLASSIFIED // 001
        </div>
      </div>

      <div ref={titleRef} className={styles.title}>
        <div className={styles.kicker}>THE COMMANDER IS WAITING</div>
        <h1>WAR COMMAND</h1>
        <p>Interactive cinematic interface</p>
      </div>

      <Reticle ref={reticleRef} />

      <div ref={glowRef} className={styles.buttonGlow} />

      <div className={styles.buttonWrap}>
        <WarButton
          ref={buttonRef}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      </div>

      <div ref={hintRef} className={styles.hint}>
        Move toward the button &nbsp;&middot;&nbsp;{" "}
        <b>He will notice</b>
      </div>
    </div>
  );
}
