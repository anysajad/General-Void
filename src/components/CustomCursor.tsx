import { useEffect, useRef, useState } from "react";
import styles from "./CustomCursor.module.css";

interface CustomCursorProps {
  isHot: boolean;
}

export default function CustomCursor({ isHot }: CustomCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const posRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 800);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    let raf: number;
    const animate = () => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${posRef.current.x}px`;
        cursorRef.current.style.top = `${posRef.current.y}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${posRef.current.x}px`;
        ringRef.current.style.top = `${posRef.current.y}px`;
      }
      raf = requestAnimationFrame(animate);
    };

    const handleMove = (e: PointerEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };

    const handleLeave = () => setVisible(false);
    const handleEnter = () => setVisible(true);

    window.addEventListener("pointermove", handleMove);
    document.addEventListener("pointerleave", handleLeave);
    document.addEventListener("pointerenter", handleEnter);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerleave", handleLeave);
      document.removeEventListener("pointerenter", handleEnter);
      cancelAnimationFrame(raf);
    };
  }, [isMobile, visible]);

  if (isMobile) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className={`${styles.cursor} ${isHot ? styles.hot : ""} ${
          visible ? styles.visible : ""
        }`}
      />
      <div
        ref={ringRef}
        className={`${styles.ring} ${isHot ? styles.ringHot : ""} ${
          visible ? styles.visible : ""
        }`}
      />
    </>
  );
}
