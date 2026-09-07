import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { VIDEO_TIMELINE } from "../config/videoTimeline";
import styles from "./MainMenu.module.css";

interface MainMenuProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  mouseRef: React.RefObject<{ x: number; y: number }>;
}

const menuItems = [
  { label: "Play", number: "01", accent: "#a21818", glow: "rgba(162,24,24,0.25)" },
  { label: "Multiplayer", number: "02", accent: "#a21818", glow: "rgba(162,24,24,0.18)" },
  { label: "Campaign", number: "03", accent: "#a21818", glow: "rgba(162,24,24,0.15)" },
  { label: "Settings", number: "04", accent: "#b69a63", glow: "rgba(182,154,99,0.15)" },
  { label: "Exit", number: "05", accent: "#884444", glow: "rgba(136,68,68,0.2)" },
];

export default function MainMenu({ videoRef, mouseRef }: MainMenuProps) {
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const markRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);
  const hoverTlRefs = useRef<(gsap.core.Timeline | null)[]>([]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const freeze = () => {
      video.currentTime = VIDEO_TIMELINE.AIM_LOCK_T;
      video.pause();
      video.style.filter = "brightness(0.82) contrast(1.08)";
    };

    if (video.readyState >= 1) {
      freeze();
    } else {
      video.addEventListener("loadedmetadata", freeze);
      return () => video.removeEventListener("loadedmetadata", freeze);
    }
  }, [videoRef]);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    tl.fromTo(gridRef.current,
      { opacity: 0 },
      { opacity: 0.35, duration: 1.0 },
      0
    );

    tl.fromTo(eyebrowRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.7 },
      0.3
    );

    tl.fromTo(headingRef.current,
      { opacity: 0, y: 20, filter: "blur(6px)", letterSpacing: "0.15em" },
      { opacity: 1, y: 0, filter: "blur(0px)", letterSpacing: "0.03em", duration: 1.0 },
      0.4
    );

    tl.fromTo(itemsRef.current,
      { opacity: 0, x: 25 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.1 },
      0.7
    );

    tl.fromTo(markRef.current,
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.6 },
      1.0
    );

    return () => { tl.kill(); };
  }, []);

  useEffect(() => {
    let raf: number;
    const animate = () => {
      if (menuContentRef.current && mouseRef.current) {
        const mx = (mouseRef.current.x - 0.5) * 2;
        const my = (mouseRef.current.y - 0.5) * 1.5;
        gsap.set(menuContentRef.current, { x: mx, y: my });
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [mouseRef]);

  const handleItemHover = useCallback((index: number) => {
    const video = videoRef.current;
    if (video) {
      const brightnesses = [0.9, 0.85, 0.82, 0.78, 0.82];
      video.style.filter = `brightness(${brightnesses[index]}) contrast(1.08)`;
    }

    itemsRef.current.forEach((el, i) => {
      if (!el || i === index) return;
      gsap.to(el, { opacity: 0.4, duration: 0.3, ease: "power2.out" });
    });

    if (hoverTlRefs.current[index]) {
      hoverTlRefs.current[index]!.kill();
    }

    const el = itemsRef.current[index];
    if (!el) return;

    const item = menuItems[index];
    const tl = gsap.timeline();
    hoverTlRefs.current[index] = tl;

    tl.to(el, {
      x: 8,
      duration: 0.35,
      ease: "power2.out",
    }, 0);

    const line = el.querySelector(`.${styles.itemLine}`);
    if (line) {
      tl.fromTo(line,
        { scaleY: 0 },
        { scaleY: 1, duration: 0.3, ease: "power2.out" },
        0
      );
    }

    const num = el.querySelector(`.${styles.itemNumber}`);
    if (num) {
      tl.to(num, {
        color: item.accent,
        duration: 0.3,
      }, 0);
    }
  }, [videoRef]);

  const handleItemLeave = useCallback((index: number) => {
    const video = videoRef.current;
    if (video) video.style.filter = "brightness(0.82) contrast(1.08)";

    itemsRef.current.forEach((el) => {
      if (!el) return;
      gsap.to(el, { opacity: 1, duration: 0.3, ease: "power2.out" });
    });

    if (hoverTlRefs.current[index]) {
      hoverTlRefs.current[index]!.kill();
      hoverTlRefs.current[index] = null;
    }

    const el = itemsRef.current[index];
    if (!el) return;

    gsap.to(el, {
      x: 0,
      duration: 0.35,
      ease: "power2.inOut",
    });

    const line = el.querySelector(`.${styles.itemLine}`);
    if (line) {
      gsap.to(line, { scaleY: 0, duration: 0.25, ease: "power2.in" });
    }

    const num = el.querySelector(`.${styles.itemNumber}`);
    if (num) {
      gsap.to(num, { color: "#444", duration: 0.3 });
    }
  }, [videoRef]);

  const handleItemClick = useCallback((index: number) => {
    const el = itemsRef.current[index];
    if (!el) return;

    const tl = gsap.timeline();
    tl.to(el, { scale: 0.97, duration: 0.08, ease: "power2.in" });
    tl.to(el, { scale: 1, duration: 0.15, ease: "back.out(3)" });

    const status = el.querySelector(`.${styles.itemStatus}`);
    if (status) {
      tl.fromTo(status,
        { opacity: 0, y: 5 },
        { opacity: 1, y: 0, duration: 0.3 },
        0.1
      );
      tl.to(status, { opacity: 0, duration: 0.5 }, 0.8);
    }
  }, []);

  return (
    <section className={styles.menu}>
      <div className={styles.menuBg} />
      <div ref={gridRef} className={styles.menuGrid} />

      <div ref={markRef} className={styles.menuMark}>
        COMMAND INTERFACE
        <strong>WAR-01</strong>
        NO HEAD. NO MERCY.
      </div>

      <div ref={menuContentRef} className={styles.menuContent}>
        <div ref={eyebrowRef} className={styles.eyebrow}>
          COMMAND // ONLINE
        </div>
        <h2 ref={headingRef}>MAIN MENU</h2>
        <nav className={styles.menuItems}>
          {menuItems.map((item, i) => (
            <button
              key={item.label}
              ref={(el) => { itemsRef.current[i] = el; }}
              className={styles.menuItem}
              onMouseEnter={() => handleItemHover(i)}
              onMouseLeave={() => handleItemLeave(i)}
              onClick={() => handleItemClick(i)}
            >
              <span
                className={styles.itemLine}
                style={{ background: item.accent } as React.CSSProperties}
              />
              <span className={styles.itemNumber}>{item.number}</span>
              <span className={styles.itemLabel}>{item.label}</span>
              <span className={styles.itemStatus}>
                {item.label === "Play" && "INITIALIZING..."}
                {item.label === "Multiplayer" && "CONNECTING..."}
                {item.label === "Campaign" && "LOADING..."}
                {item.label === "Settings" && "OPENING..."}
                {item.label === "Exit" && "CONFIRMING..."}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}
