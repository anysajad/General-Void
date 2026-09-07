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
  const aimLockedRef = useRef(false);
  const aimLockTlRef = useRef<gsap.core.Timeline | null>(null);

  // Entrance animation
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

  // FIX #6: Aim lock moment
  const fireAimLock = useCallback(() => {
    if (aimLockedRef.current) return;
    aimLockedRef.current = true;

    const tl = gsap.timeline();
    aimLockTlRef.current = tl;

    // Reticle contracts: 1 → 0.85 → 1
    tl.to(reticleRef.current, {
      scale: 0.85, duration: 0.12, ease: "power2.in",
    }, 0);
    tl.to(reticleRef.current, {
      scale: 1, duration: 0.13, ease: "back.out(3)",
    }, 0.12);

    // Button pulse — box-shadow glow
    tl.to(buttonRef.current, {
      boxShadow: "0 0 30px rgba(165,26,26,0.4), 0 20px 70px rgba(0,0,0,0.6)",
      duration: 0.2,
      ease: "power2.out",
    }, 0);
    tl.to(buttonRef.current, {
      boxShadow: "0 20px 70px rgba(0,0,0,0.6)",
      duration: 0.3,
      ease: "power2.in",
    }, 0.2);

    // Scene push-in
    tl.to(sceneRef.current, {
      scale: 1.01, duration: 0.6, ease: "power2.out",
      transformOrigin: "50% 60%",
    }, 0);
  }, []);

  const reverseAimLock = useCallback(() => {
    if (!aimLockedRef.current) return;
    aimLockedRef.current = false;
    if (aimLockTlRef.current) {
      aimLockTlRef.current.kill();
      aimLockTlRef.current = null;
    }
    gsap.to(sceneRef.current, {
      scale: 1, duration: 0.4, ease: "power2.inOut",
    });
  }, []);

  // FIX #5: Forward scrub — 1.6s, custom ease, onComplete fires aim lock
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

    // Scrub: slow first 20% (notices), fast through standing, settles into aim
    videoTimeline.scrubToTime(
      videoTimeline.getTargetTime(),
      1.6,
      "power1.inOut"
    ).eventCallback("onComplete", fireAimLock);
  }, [videoTimeline, fireAimLock]);

  const handleMouseMove = useCallback((e: React.PointerEvent) => {
    if (!isHoveringRef.current || !reticleRef.current) return;
    // Snap reticle to button center on aim lock, otherwise follow cursor
    if (aimLockedRef.current && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      reticleRef.current.style.left = `${rect.left + rect.width / 2}px`;
      reticleRef.current.style.top = `${rect.top + rect.height / 2}px`;
    } else {
      reticleRef.current.style.left = `${e.clientX}px`;
      reticleRef.current.style.top = `${e.clientY}px`;
    }
  }, []);

  // FIX #5: Reverse — 1.2s
  const handleMouseLeave = useCallback(() => {
    if (isActiveRef.current) return;
    isHoveringRef.current = false;
    reverseAimLock();

    gsap.to(buttonRef.current, {
      y: 0, duration: 0.45, ease: "power2.inOut",
    });

    gsap.to(reticleRef.current, {
      opacity: 0, scale: 0.5, duration: 0.4, ease: "power2.in",
    });

    gsap.to(glowRef.current, {
      opacity: 0, scale: 0.8, duration: 0.5, ease: "power2.in",
    });

    videoTimeline.reverseToStart(1.2);
  }, [videoTimeline, reverseAimLock]);

  // FIX #3: Click — call onActivate immediately (t=0), no scrub kill
  const handleClick = useCallback(() => {
    if (isActiveRef.current || !videoTimeline.isReady) return;
    isActiveRef.current = true;
    reverseAimLock();

    // UI fade timeline — runs in parallel with App's completion tween
    const tl = gsap.timeline();

    tl.to(buttonRef.current, { scale: 0.96, duration: 0.08, ease: "power2.in" }, 0);
    tl.to(buttonRef.current, { scale: 1, duration: 0.2, ease: "back.out(3)" }, 0.08);

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

    // FIX #3: Call onActivate at t=0 — App's timeline takes over video via overwrite
    onActivate();
  }, [videoTimeline, onActivate, reverseAimLock]);

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
