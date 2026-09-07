import { useRef, useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import IntroScene from "./components/IntroScene";
import MainMenu from "./components/MainMenu";
import CurtainTransition from "./components/CurtainTransition";
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
  const curtainRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const crimsonRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  const reduced = useReducedMotion();

  const videoTimeline = useVideoTimeline(videoRef, {
    targetTime: VIDEO_TIMELINE.AIM_LOCK_T,
  });

  const [videoReady, setVideoReady] = useState(false);

  const handleVideoMetadata = useCallback(() => {
    setVideoReady(true);
  }, []);

  const effectiveState = videoReady && appState === "loading" ? "intro" : appState;

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
      if (videoWrapRef.current && appState === "intro") {
        const mx = (mouseRef.current.x - 0.5) * 6;
        const my = (mouseRef.current.y - 0.5) * 4;
        gsap.to(videoWrapRef.current, {
          x: mx,
          y: my,
          duration: 1.2,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [appState]);

  const handleIntroComplete = useCallback(() => {
    setAppState("transitioning");

    if (reduced) {
      gsap.to(introRef.current, { opacity: 0, duration: 0.3 });
      gsap.to(videoWrapRef.current, {
        right: "0vw",
        left: "auto",
        x: 0,
        y: 0,
        height: "clamp(500px, 90vh, 900px)",
        bottom: "-4vh",
        scale: 1,
        duration: 0.01,
        onComplete: () => {
          const video = videoRef.current;
          if (video) {
            video.currentTime = VIDEO_TIMELINE.AIM_LOCK_T;
            video.pause();
          }
          setAppState("menu");
        },
      });
      return;
    }

    const tl = gsap.timeline();

    const video = videoRef.current;
    if (video) {
      const targetTime = VIDEO_TIMELINE.AIM_LOCK_T;
      const proxy = { time: video.currentTime };
      tl.to(proxy, {
        time: targetTime,
        duration: 0.8,
        ease: "power2.inOut",
        onUpdate: () => {
          video.currentTime = proxy.time;
        },
        onComplete: () => {
          video.currentTime = targetTime;
          video.pause();
        },
      }, 0);
    }

    tl.to(flashRef.current, { opacity: 0.18, duration: 0.12, ease: "power2.out" }, 0);
    tl.to(flashRef.current, { opacity: 0, duration: 0.5 }, 0.12);

    tl.to(crimsonRef.current, { opacity: 0.12, duration: 0.25 }, 0.05);
    tl.to(crimsonRef.current, { opacity: 0, duration: 0.6 }, 0.3);

    tl.to(introRef.current, {
      x: "-8%",
      rotateY: -2,
      filter: "blur(3px) brightness(0.6)",
      duration: 1.6,
      ease: "power3.inOut",
      transformPerspective: 1400,
      transformOrigin: "left center",
    }, 0.3);

    tl.to(videoWrapRef.current, {
      left: "auto",
      right: "0vw",
      x: 0,
      y: 0,
      height: "clamp(500px, 90vh, 900px)",
      bottom: "-4vh",
      scale: 1,
      duration: 1.6,
      ease: "power3.inOut",
    }, 0.3);

    tl.set(curtainRef.current, { opacity: 1 });
    tl.fromTo(curtainRef.current,
      { x: "100%" },
      { x: "-100%", duration: 1.6, ease: "power3.inOut" },
      0.4
    );

    tl.fromTo(menuRef.current,
      { x: "100%" },
      { x: "0%", duration: 1.6, ease: "power3.inOut" },
      0.45
    );

    tl.call(() => setAppState("menu"), [], 2.0);
  }, [reduced]);

  const isIntro = effectiveState === "intro" || effectiveState === "loading" || effectiveState === "transitioning";

  return (
    <div className={styles.root}>
      <CustomCursor isHot={false} />
      <Overlays />

      <main className={styles.main}>
        <div
          ref={videoWrapRef}
          className={`${styles.videoWrap} ${effectiveState === "menu" ? styles.videoMenu : ""}`}
        >
          <video
            ref={videoRef}
            className={styles.video}
            src="/assets/general.mp4"
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={handleVideoMetadata}
          />
          <div className={styles.atmosphericLight} />
          {effectiveState === "menu" && <div className={styles.menuGlow} />}
        </div>

        <div ref={introRef} className={styles.introLayer}>
          {isIntro && (
            <IntroScene
              videoTimeline={videoTimeline}
              onActivate={handleIntroComplete}
              videoReady={videoReady}
              mouseRef={mouseRef}
            />
          )}
        </div>

        <div ref={menuRef} className={styles.menuLayer}>
          {effectiveState === "menu" && (
            <MainMenu
              videoRef={videoRef}
              mouseRef={mouseRef}
            />
          )}
        </div>

        <CurtainTransition ref={curtainRef} />

        <div ref={flashRef} className={styles.flash} />
        <div ref={crimsonRef} className={styles.crimsonPulse} />
      </main>
    </div>
  );
}
