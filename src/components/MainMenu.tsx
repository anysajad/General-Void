import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import type { CharacterPlayer } from "../hooks/useCharacterPlayer";
import styles from "./MainMenu.module.css";

interface MainMenuProps {
  player: CharacterPlayer;
}

const menuItems = [
  { label: "Play", number: "01", accent: "#a21818" },
  { label: "Multiplayer", number: "02", accent: "#a21818" },
  { label: "Campaign", number: "03", accent: "#a21818" },
  { label: "Settings", number: "04", accent: "#b69a63" },
  { label: "Exit", number: "05", accent: "#884444" },
];

export default function MainMenu({ player }: MainMenuProps) {
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const markRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);
  const hoverTlRefs = useRef<(gsap.core.Timeline | null)[]>([]);
  const frozenRef = useRef(false);

  useEffect(() => {
    if (frozenRef.current) return;
    frozenRef.current = true;
    player.holdAiming();
  }, [player]);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    tl.fromTo(
      gridRef.current,
      { opacity: 0 },
      { opacity: 0.35, duration: 1.0 },
      0
    );

    tl.fromTo(
      eyebrowRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.7 },
      0.3
    );

    tl.fromTo(
      headingRef.current,
      { opacity: 0, y: 20, filter: "blur(6px)", letterSpacing: "0.15em" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        letterSpacing: "0.03em",
        duration: 1.0,
      },
      0.4
    );

    tl.fromTo(
      itemsRef.current,
      { opacity: 0, x: 25 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.1 },
      0.7
    );

    tl.fromTo(
      markRef.current,
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.6 },
      1.0
    );

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!menuContentRef.current) return;
      const mx = (e.clientX / window.innerWidth - 0.5) * 2;
      const my = (e.clientY / window.innerHeight - 0.5) * 1.5;
      gsap.set(menuContentRef.current, { x: mx, y: my });
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  const handleItemHover = useCallback(
    (index: number) => {
      itemsRef.current.forEach((el, i) => {
        if (!el || i === index) return;
        gsap.to(el, { opacity: 0.4, duration: 0.3, ease: "power2.out" });
      });

      if (hoverTlRefs.current[index])
        hoverTlRefs.current[index]!.kill();

      const el = itemsRef.current[index];
      if (!el) return;

      const item = menuItems[index];
      const tl = gsap.timeline();
      hoverTlRefs.current[index] = tl;

      tl.to(el, { x: 8, duration: 0.35, ease: "power2.out" }, 0);

      const line = el.querySelector(`.${styles.itemLine}`);
      if (line) {
        tl.fromTo(
          line,
          { scaleY: 0 },
          { scaleY: 1, duration: 0.3, ease: "power2.out" },
          0
        );
      }

      const num = el.querySelector(`.${styles.itemNumber}`);
      if (num) {
        tl.to(num, { color: item.accent, duration: 0.3 }, 0);
      }

      const label = el.querySelector(`.${styles.itemLabel}`);

      switch (item.label) {
        case "Play": {
          if (label) {
            tl.to(
              label,
              { letterSpacing: "0.08em", duration: 0.4, ease: "power2.out" },
              0
            );
          }
          const glow = document.createElement("div");
          glow.style.cssText =
            "position:absolute;inset:0;background:radial-gradient(ellipse at 30% 50%,rgba(162,24,24,0.12),transparent 70%);pointer-events:none;";
          el.appendChild(glow);
          tl.fromTo(glow, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0);
          break;
        }
        case "Multiplayer": {
          for (let j = 0; j < 2; j++) {
            const ping = document.createElement("div");
            ping.style.cssText = `position:absolute;left:0;top:0;width:3px;height:100%;background:${item.accent};opacity:0;transform-origin:center;`;
            el.appendChild(ping);
            tl.fromTo(
              ping,
              { scaleY: 0, opacity: 0.7 },
              {
                scaleY: 1,
                opacity: 0,
                duration: 0.6,
                delay: j * 0.12,
                ease: "power2.out",
              },
              0
            );
            tl.call(() => ping.remove(), [], 0.8);
          }
          break;
        }
        case "Campaign": {
          const grid = document.createElement("div");
          grid.style.cssText =
            "position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px);background-size:8px 8px;pointer-events:none;opacity:0;";
          el.appendChild(grid);
          tl.to(grid, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0);
          break;
        }
        case "Settings": {
          if (num) {
            tl.to(
              num,
              { rotation: 90, duration: 0.35, ease: "back.out(2)" },
              0
            );
          }
          break;
        }
        case "Exit": {
          if (label) {
            tl.to(label, { color: "#cc4444", duration: 0.3 }, 0);
          }
          itemsRef.current.forEach((el2, i2) => {
            if (!el2 || i2 === index) return;
            gsap.to(el2, { opacity: 0.3, duration: 0.3 });
          });
          if (line) {
            tl.to(line, { opacity: 0.3, duration: 0.08 }, 0.15);
            tl.to(line, { opacity: 1, duration: 0.08 }, 0.23);
            tl.to(line, { opacity: 0.4, duration: 0.08 }, 0.31);
            tl.to(line, { opacity: 1, duration: 0.15 }, 0.39);
          }
          break;
        }
      }
    },
    []
  );

  const handleItemLeave = useCallback((index: number) => {
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

    gsap.to(el, { x: 0, duration: 0.35, ease: "power2.inOut" });

    const line = el.querySelector(`.${styles.itemLine}`);
    if (line)
      gsap.to(line, { scaleY: 0, duration: 0.25, ease: "power2.in" });

    const num = el.querySelector(`.${styles.itemNumber}`);
    if (num)
      gsap.to(num, { color: "#444", rotation: 0, duration: 0.3 });

    const label = el.querySelector(`.${styles.itemLabel}`);
    if (label)
      gsap.to(label, {
        letterSpacing: "0.28em",
        color: "",
        duration: 0.3,
      });

    el.querySelectorAll("div").forEach((d) => {
      if (d.dataset.temp) d.remove();
    });
    const children = Array.from(el.children);
    children.forEach((c) => {
      if (
        c.classList.contains(styles.itemLine) ||
        c.classList.contains(styles.itemNumber) ||
        c.classList.contains(styles.itemLabel) ||
        c.classList.contains(styles.itemStatus)
      )
        return;
      c.remove();
    });
  }, []);

  const handleItemClick = useCallback((index: number) => {
    const el = itemsRef.current[index];
    if (!el) return;

    const tl = gsap.timeline();
    tl.to(el, { scale: 0.97, duration: 0.08, ease: "power2.in" });
    tl.to(el, { scale: 1, duration: 0.15, ease: "back.out(3)" });

    const status = el.querySelector(`.${styles.itemStatus}`);
    if (status) {
      tl.fromTo(
        status,
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
              ref={(el) => {
                itemsRef.current[i] = el;
              }}
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
