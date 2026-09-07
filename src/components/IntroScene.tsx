import { useRef, useCallback, useEffect, useState } from "react";
import gsap from "gsap";
import WarButton from "./WarButton";
import Reticle from "./Reticle";
import type { CharacterPlayer, CharacterState } from "../hooks/useCharacterPlayer";
import styles from "./IntroScene.module.css";

interface IntroSceneProps {
  player: CharacterPlayer;
  onActivate: () => void;
  videoReady: boolean;
}

const HEADING = "WAR COMMAND";

function tweenTo(
  target: gsap.TweenTarget,
  vars: gsap.TweenVars,
  position?: number | string
): gsap.core.Tween {
  return (gsap.to as Function)(target, vars, position);
}

export default function IntroScene({
  player,
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
  const headingRef = useRef<HTMLHeadingElement>(null);

  const isHoveringRef = useRef(false);
  const isActiveRef = useRef(false);
  const aimLockedRef = useRef(false);
  const aimLockTlRef = useRef<gsap.core.Timeline | null>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!videoReady || !headingRef.current) return;

    const chars = headingRef.current.querySelectorAll(`.${styles.splitChar}`);
    if (chars.length === 0) return;

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.fromTo(
      chars,
      { y: 30, opacity: 0, filter: "blur(6px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8, stagger: 0.04 },
      0
    );

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.2 },
      0
    );

    tl.fromTo(
      topbarRef.current,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.8 },
      0.5
    );
    tl.fromTo(
      buttonRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.8 },
      0.8
    );
    tl.fromTo(
      hintRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6 },
      1.2
    );

    return () => { tl.kill(); };
  }, [videoReady]);

  const fireAimLock = useCallback(() => {
    if (aimLockedRef.current) return;
    aimLockedRef.current = true;

    const tl = gsap.timeline();
    aimLockTlRef.current = tl;

    tl.to(reticleRef.current, {
      scale: 0.85, duration: 0.12, ease: "power2.in",
    }, 0);
    tl.to(reticleRef.current, {
      scale: 1, duration: 0.13, ease: "back.out(3)",
    }, 0.12);

    tl.to(buttonRef.current, {
      boxShadow:
        "0 0 30px rgba(165,26,26,0.4), 0 20px 70px rgba(0,0,0,0.6)",
      duration: 0.2,
      ease: "power2.out",
    }, 0);
    tl.to(buttonRef.current, {
      boxShadow: "0 20px 70px rgba(0,0,0,0.6)",
      duration: 0.3,
      ease: "power2.in",
    }, 0.2);

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

  useEffect(() => {
    const unsub = player.onStateChange((s: CharacterState) => {
      if (s === "aiming" && isHoveringRef.current && !isActiveRef.current) {
        fireAimLock();
      }
    });
    return unsub;
  }, [player, fireAimLock]);

  const handleMouseEnter = useCallback(() => {
    if (isActiveRef.current) return;
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

    player.rise();
  }, [player]);

  const handleMouseMove = useCallback((e: React.PointerEvent) => {
    if (!isHoveringRef.current || !reticleRef.current) return;
    if (aimLockedRef.current && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      reticleRef.current.style.left = `${rect.left + rect.width / 2}px`;
      reticleRef.current.style.top = `${rect.top + rect.height / 2}px`;
    } else {
      reticleRef.current.style.left = `${e.clientX}px`;
      reticleRef.current.style.top = `${e.clientY}px`;
    }
  }, []);

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

    player.sit();
  }, [player, reverseAimLock]);

  const handleClick = useCallback(() => {
    if (isActiveRef.current) return;
    isActiveRef.current = true;
    setArmed(true);
    reverseAimLock();

    tweenTo(buttonRef.current, { scale: 0.96, duration: 0.08, ease: "power2.in" }, 0);
    tweenTo(buttonRef.current, { scale: 1, duration: 0.2, ease: "back.out(3)" }, 0.08);

    tweenTo(reticleRef.current, {
      scale: 1.3, opacity: 0.8, duration: 0.15, ease: "power2.out",
    }, 0);
    tweenTo(reticleRef.current, {
      scale: 0.3, opacity: 0, duration: 0.3, ease: "power2.in",
    }, 0.15);

    tweenTo(glowRef.current, {
      opacity: 1, scale: 1.2, duration: 0.2, ease: "power2.out",
    }, 0);
    tweenTo(glowRef.current, {
      opacity: 0, scale: 1.5, duration: 0.5, ease: "power2.in",
    }, 0.2);

    tweenTo(titleRef.current, { opacity: 0, y: -15, duration: 0.5, ease: "power2.in" }, 0.2);
    tweenTo(hintRef.current, { opacity: 0, duration: 0.3 }, 0.2);
    tweenTo(topbarRef.current, { opacity: 0, duration: 0.4 }, 0.3);

    onActivate();
  }, [onActivate, reverseAimLock]);

  const headingChars = HEADING.split("");
  const headingLabel = HEADING;

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
        <h1 ref={headingRef} className={styles.splitHeading} aria-label={headingLabel}>
          {headingChars.map((ch, i) => (
            <span key={i} className={styles.splitChar} aria-hidden="true">
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </h1>
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
          disabled={armed}
        />
      </div>

      <div ref={hintRef} className={styles.hint}>
        Move toward the button &nbsp;&middot;&nbsp;{" "}
        <b>He will notice</b>
      </div>
    </div>
  );
}
