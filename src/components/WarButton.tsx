import { forwardRef, useRef, useCallback, useEffect } from "react";
import gsap from "gsap";
import styles from "./WarButton.module.css";

interface WarButtonProps {
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  disabled?: boolean;
}

const WarButton = forwardRef<HTMLButtonElement, WarButtonProps>(
  ({ onClick, onMouseEnter, onMouseLeave, disabled }, ref) => {
    const wrapRef = useRef<HTMLDivElement>(null);
    const quickToXRef = useRef<((v: number) => void) | null>(null);
    const quickToYRef = useRef<((v: number) => void) | null>(null);

    useEffect(() => {
      if (!wrapRef.current) return;
      quickToXRef.current = gsap.quickTo(wrapRef.current, "x", {
        duration: 0.4,
        ease: "power3.out",
      });
      quickToYRef.current = gsap.quickTo(wrapRef.current, "y", {
        duration: 0.4,
        ease: "power3.out",
      });
    }, []);

    const handleMouseMove = useCallback(
      (e: React.PointerEvent) => {
        if (!quickToXRef.current || !quickToYRef.current) return;
        const rect = wrapRef.current?.getBoundingClientRect();
        if (!rect) return;
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const maxDist = 8;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const scale = dist > maxDist ? maxDist / dist : 1;
        quickToXRef.current(dx * scale);
        quickToYRef.current(dy * scale);
      },
      []
    );

    const handleMouseLeave = useCallback(() => {
      if (quickToXRef.current) quickToXRef.current(0);
      if (quickToYRef.current) quickToYRef.current(0);
      onMouseLeave?.();
    }, [onMouseLeave]);

    return (
      <div ref={wrapRef} className={styles.magneticWrap}>
        <button
          ref={ref}
          className={`${styles.warButton} ${disabled ? styles.armed : ""}`}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={handleMouseLeave}
          onPointerMove={handleMouseMove}
          aria-label="Start The War"
          disabled={disabled}
        >
          <span className={styles.borderGlow} />
          <span className={styles.innerBorder} />
          <span className={styles.energyTop} />
          <span className={styles.energyBottom} />
          <span className={styles.energyLeft} />
          <span className={styles.energyRight} />
          <span className={styles.label}>
            {disabled ? "ENGAGING" : "Start The War"}
          </span>
          <span className={styles.underline} />
        </button>
      </div>
    );
  }
);

WarButton.displayName = "WarButton";
export default WarButton;
