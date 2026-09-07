import { useMemo } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import styles from "./Overlays.module.css";

const PARTICLE_COUNT = 18;

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) % 233280;
  return (x < 0 ? x + 233280 : x) / 233280;
}

export default function Overlays() {
  const reduced = useReducedMotion();

  const particles = useMemo(() =>
    Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
      left: `${seededRandom(i * 7 + 1) * 100}%`,
      top: `${seededRandom(i * 7 + 2) * 100}%`,
      delay: `${seededRandom(i * 7 + 3) * 8}s`,
      duration: `${6 + seededRandom(i * 7 + 4) * 6}s`,
      size: `${1 + seededRandom(i * 7 + 5) * 2}px`,
      opacity: 0.15 + seededRandom(i * 7 + 6) * 0.2,
    })),
  []);

  return (
    <>
      <div className={`${styles.noise} ${reduced ? styles.noiseStatic : ""}`} />
      <div className={styles.scan} />
      <div className={styles.vignette} />
      <div className={styles.fogLayer}>
        <div className={styles.fog1} />
        <div className={styles.fog2} />
      </div>
      {!reduced && (
        <div className={styles.particles}>
          {particles.map((p, i) => (
            <div
              key={i}
              className={styles.particle}
              style={{
                left: p.left,
                top: p.top,
                animationDelay: p.delay,
                animationDuration: p.duration,
                width: p.size,
                height: p.size,
                opacity: p.opacity,
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
