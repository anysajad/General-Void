import { useRef, useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import IntroScene from "./components/IntroScene";
import MainMenu from "./components/MainMenu";
import CurtainTransition from "./components/CurtainTransition";
import type { CurtainHandles } from "./components/CurtainTransition";
import CustomCursor from "./components/CustomCursor";
import Overlays from "./components/Overlays";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { useVideoTimeline } from "./hooks/useVideoTimeline";
import { VIDEO_TIMELINE } from "./config/videoTimeline";
import styles from "./App.module.css";

type AppState = "loading" | "intro" | "transitioning" | "menu";

export default function App() {
  const [appState, setAppState] = useState<AppState>("loading");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<CurtainHandles>(null);
  const curtainWrapRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const crimsonRef = useRef<HTMLDivElement>(null);
  const quickToXRef = useRef<((value: number) => void) | null>(null);
  const quickToYRef = useRef<((value: number) => void) | null>(null);

  const reduced = useReducedMotion();

  const videoTimeline = useVideoTimeline(videoRef, {
    targetTime: VIDEO_TIMELINE.AIM_LOCK_T,
  });

  const [videoReady, setVideoReady] = useState(false);

  const handleVideoMetadata = useCallback(() => {
    setVideoReady(true);
  }, []);

  const effectiveState = videoReady && appState === "loading" ? "intro" : appState;

  // Parallax with quickTo — created once per mount
  useEffect(() => {
    if (!videoWrapRef.current) return;
    quickToXRef.current = gsap.quickTo(videoWrapRef.current, "x", {
      duration: 1.2,
      ease: "power2.out",
    });
    quickToYRef.current = gsap.quickTo(videoWrapRef.current, "y", {
      duration: 1.2,
      ease: "power2.out",
    });
  }, []);

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (appState !== "intro" || !quickToXRef.current || !quickToYRef.current) return;
      const mx = (e.clientX / window.innerWidth - 0.5) * 6;
      const my = (e.clientY / window.innerHeight - 0.5) * 4;
      quickToXRef.current(mx);
      quickToYRef.current(my);
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [appState]);

  const handleIntroComplete = useCallback(() => {
    setAppState("transitioning");

    if (reduced) {
      gsap.to(introRef.current, { opacity: 0, duration: 0.3 });
      gsap.to(videoWrapRef.current, {
        right: "0vw", left: "auto", x: 0, y: 0,
        height: "clamp(500px, 90vh, 900px)", bottom: "-4vh", scale: 1,
        duration: 0.01,
        onComplete: () => {
          videoTimeline.freezeAt(VIDEO_TIMELINE.AIM_LOCK_T);
          setAppState("menu");
        },
      });
      return;
    }

    const tl = gsap.timeline();

    // Video: complete to aim lock from current position (overwrite kills any active scrub)
    tl.call(() => {
      videoTimeline.completeTo(VIDEO_TIMELINE.AIM_LOCK_T, 0.8);
    }, [], 0);

    // Flash
    tl.to(flashRef.current, { opacity: 0.18, duration: 0.12, ease: "power2.out" }, 0);
    tl.to(flashRef.current, { opacity: 0, duration: 0.5 }, 0.12);

    // Crimson pulse
    tl.to(crimsonRef.current, { opacity: 0.12, duration: 0.25 }, 0.05);
    tl.to(crimsonRef.current, { opacity: 0, duration: 0.6 }, 0.3);

    // Intro scene slides away
    tl.to(introRef.current, {
      x: "-8%", rotateY: -2,
      filter: "blur(3px) brightness(0.6)",
      duration: 1.6, ease: "power3.inOut",
      transformPerspective: 1400, transformOrigin: "left center",
    }, 0.3);

    // Video repositions
    tl.to(videoWrapRef.current, {
      left: "auto", right: "0vw", x: 0, y: 0,
      height: "clamp(500px, 90vh, 900px)", bottom: "-4vh", scale: 1,
      duration: 1.6, ease: "power3.inOut",
    }, 0.3);

    // Curtain: opacity at 0.4s (FIX #1), sweep with layer parallax (FIX #8), then hide
    tl.set(curtainWrapRef.current, { opacity: 1 }, 0.4);
    tl.fromTo(curtainWrapRef.current,
      { x: "100%" },
      { x: "-100%", duration: 1.6, ease: "power3.inOut" },
      0.4
    );
    // FIX #8: Layer parallax offsets
    const c = curtainRef.current;
    if (c?.layer1) tl.fromTo(c.layer1, { x: "-4%" }, { x: "4%", duration: 1.6, ease: "power3.inOut" }, 0.4);
    if (c?.layer3) tl.fromTo(c.layer3, { x: "6%" }, { x: "-6%", duration: 1.6, ease: "power3.inOut" }, 0.4);
    tl.set(curtainWrapRef.current, { opacity: 0 }, 2.05);

    // Menu slides in
    tl.fromTo(menuRef.current,
      { x: "100%" },
      { x: "0%", duration: 1.6, ease: "power3.inOut" },
      0.45
    );

    tl.call(() => setAppState("menu"), [], 2.0);
  }, [reduced, videoTimeline]);

  const isIntro = effectiveState === "intro" || effectiveState === "loading" || effectiveState === "transitioning";
  const showMenu = effectiveState === "transitioning" || effectiveState === "menu";

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
              ref={videoRef}
              className={styles.video}
              src="/assets/general.mp4"
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={handleVideoMetadata}
            />
          </div>
          <div className={styles.atmosphericLight} />
          {effectiveState === "menu" && <div className={styles.menuGlow} />}
        </div>

        <div ref={introRef} className={styles.introLayer}>
          {isIntro && (
            <IntroScene
              videoTimeline={videoTimeline}
              onActivate={handleIntroComplete}
              videoReady={videoReady}
            />
          )}
        </div>

        {/* FIX #2: MainMenu renders during transitioning AND menu */}
        <div ref={menuRef} className={styles.menuLayer}>
          {showMenu && (
            <MainMenu
              videoRef={videoRef}
              videoTimeline={videoTimeline}
            />
          )}
        </div>

        <div ref={curtainWrapRef} className={styles.curtainWrap}>
          <CurtainTransition ref={curtainRef} />
        </div>

        <div ref={flashRef} className={styles.flash} />
        <div ref={crimsonRef} className={styles.crimsonPulse} />
      </main>
    </div>
  );
}
