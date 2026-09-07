import { useRef, useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import IntroScene from "./components/IntroScene";
import MainMenu from "./components/MainMenu";
import CurtainTransition from "./components/CurtainTransition";
import type { CurtainHandles } from "./components/CurtainTransition";
import CustomCursor from "./components/CustomCursor";
import Overlays from "./components/Overlays";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { useCharacterPlayer } from "./hooks/useCharacterPlayer";
import type { CharacterState } from "./hooks/useCharacterPlayer";
import styles from "./App.module.css";

type AppState = "loading" | "intro" | "transitioning" | "menu";

export default function App() {
  const [appState, setAppState] = useState<AppState>("loading");
  const [loadProgress, setLoadProgress] = useState(0);
  const videoRiseRef = useRef<HTMLVideoElement | null>(null);
  const videoSitRef = useRef<HTMLVideoElement | null>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<CurtainHandles>(null);
  const curtainWrapRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const crimsonRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);


  const reduced = useReducedMotion();

  const player = useCharacterPlayer(videoRiseRef, videoSitRef, setLoadProgress);

  const effectiveState = player.isReady && appState === "loading" ? "intro" : appState;

  const showIntro =
    effectiveState === "intro" || effectiveState === "loading";

  const showMenu =
    effectiveState === "transitioning" || effectiveState === "menu";
  useEffect(() => {
    if (appState !== "loading") return;
    if (!player.isReady) return;

    if (reduced) {
      gsap.to(loadingRef.current, {
        opacity: 0,
        duration: 0.01,
        onComplete: () => setAppState("intro"),
      });
      return;
    }
    gsap.to(loadingRef.current, {
      opacity: 0,
      duration: 0.6,
      delay: 0.2,
      ease: "power2.out",
      onComplete: () => setAppState("intro"),
    });
  }, [player.isReady, appState, reduced]);

  useEffect(() => {
    if (!videoWrapRef.current) return;
    const x = gsap.quickTo(videoWrapRef.current, "x", {
      duration: 1.2,
      ease: "power2.out",
    });
    const y = gsap.quickTo(videoWrapRef.current, "y", {
      duration: 1.2,
      ease: "power2.out",
    });

    const handleMove = (e: PointerEvent) => {
      if (appState !== "intro") return;
      const mx = (e.clientX / window.innerWidth - 0.5) * 6;
      const my = (e.clientY / window.innerHeight - 0.5) * 4;
      x(mx);
      y(my);
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [appState]);

  const handleIntroComplete = useCallback(() => {
    if (appState === "transitioning") return;
    setAppState("transitioning");

    const waitForAiming = new Promise<void>((resolve) => {
      const unsub = player.onStateChange((s: CharacterState) => {
        if (s === "aiming") {
          unsub();
          setTimeout(resolve, 0);
        }
      });
    });

    waitForAiming.then(() => {
      player.holdAiming();

      if (reduced) {
        gsap.to(introRef.current, { opacity: 0, duration: 0.3 });
        gsap.to(videoWrapRef.current, {
          right: "0vw", left: "auto", x: 0, y: 0,
          height: "clamp(500px, 90vh, 900px)", bottom: "-4vh", scale: 1,
          duration: 0.01,
          onComplete: () => setAppState("menu"),
        });
        return;
      }

      const tl = gsap.timeline();

      tl.to(flashRef.current, {
        opacity: 0.18, duration: 0.12, ease: "power2.out",
      }, 0);
      tl.to(flashRef.current, { opacity: 0, duration: 0.5 }, 0.12);

      tl.to(crimsonRef.current, { opacity: 0.12, duration: 0.25 }, 0.05);
      tl.to(crimsonRef.current, { opacity: 0, duration: 0.6 }, 0.3);

      tl.to(introRef.current, {
        x: "-8%", rotateY: -2,
        filter: "blur(3px) brightness(0.6)",
        duration: 1.6, ease: "power3.inOut",
        transformPerspective: 1400, transformOrigin: "left center",
      }, 0.3);

      tl.to(videoWrapRef.current, {
        left: "auto", right: "0vw", x: 0, y: 0,
        height: "clamp(500px, 90vh, 900px)", bottom: "-4vh", scale: 1,
        duration: 1.6, ease: "power3.inOut",
      }, 0.3);

      tl.set(curtainWrapRef.current, { opacity: 1 }, 0.4);
      tl.fromTo(curtainWrapRef.current,
        { x: "100%" },
        { x: "-100%", duration: 1.6, ease: "power3.inOut" },
        0.4
      );
      const c = curtainRef.current;
      if (c?.layer1)
        tl.fromTo(
          c.layer1, { x: "-4%" }, { x: "4%", duration: 1.6, ease: "power3.inOut" },
          0.4
        );
      if (c?.layer3)
        tl.fromTo(
          c.layer3, { x: "6%" }, { x: "-6%", duration: 1.6, ease: "power3.inOut" },
          0.4
        );
      tl.set(curtainWrapRef.current, { opacity: 0 }, 2.05);

      tl.fromTo(menuRef.current,
        { x: "100%" },
        { x: "0%", duration: 1.6, ease: "power3.inOut" },
        0.45
      );

      tl.call(() => setAppState("menu"), [], 2.0);
    });
  }, [reduced, appState, player]);

  return (
    <div className={styles.root}>
      <CustomCursor isHot={false} />
      <Overlays />

      <main className={styles.main}>
        <div
          ref={videoWrapRef}
          className={`${styles.videoWrap} ${effectiveState === "menu" ? styles.videoMenu : ""}`}
        >
          <div className={styles.videoIdleWrap}>
            <video
              ref={videoRiseRef}
              className={styles.video}
              src="/assets/general-rise.mp4"
              muted
              playsInline
              preload="auto"
            />
            <div className={styles.videoOverlay}>
              <video
                ref={videoSitRef}
                className={styles.video}
                src="/assets/general-sit.mp4"
                muted
                playsInline
                preload="auto"
                style={{ opacity: 0 }}
              />
            </div>
          </div>
          <div className={styles.atmosphericLight} />
          <div className={styles.lightSweep} />
          {effectiveState === "menu" && <div className={styles.menuGlow} />}
        </div>

        <div ref={introRef} className={styles.introLayer}>
          {showIntro && (
            <IntroScene
              player={player}
              onActivate={handleIntroComplete}
              videoReady={player.isReady}
            />
          )}
        </div>

        <div ref={menuRef} className={styles.menuLayer}>
          {showMenu && <MainMenu player={player} />}
        </div>

        <div ref={curtainWrapRef} className={styles.curtainWrap}>
          <CurtainTransition ref={curtainRef} />
        </div>

        <div ref={flashRef} className={styles.flash} />
        <div ref={crimsonRef} className={styles.crimsonPulse} />

        {appState === "loading" && (
          <div ref={loadingRef} className={styles.loading}>
            <div className={styles.loadingLabel}>LOADING COMMAND</div>
            <div className={styles.loadingBar}>
              <div
                className={styles.loadingFill}
                style={{ width: `${loadProgress * 100}%` }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
