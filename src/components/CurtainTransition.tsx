import { forwardRef, useRef, useEffect, useCallback } from "react";
import styles from "./CurtainTransition.module.css";

export interface CurtainHandles {
  layer1: HTMLDivElement | null;
  layer2: HTMLDivElement | null;
  layer3: HTMLDivElement | null;
}

const CurtainTransition = forwardRef<CurtainHandles>((_, ref) => {
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);

  const setRefs = useCallback(() => {
    if (typeof ref === "function") {
      ref({ layer1: layer1Ref.current, layer2: layer2Ref.current, layer3: layer3Ref.current });
    } else if (ref) {
      (ref as React.MutableRefObject<CurtainHandles>).current = {
        layer1: layer1Ref.current,
        layer2: layer2Ref.current,
        layer3: layer3Ref.current,
      };
    }
  }, [ref]);

  useEffect(() => { setRefs(); });

  return (
    <div className={styles.curtain}>
      <div ref={layer1Ref} className={styles.layer1} />
      <div ref={layer2Ref} className={styles.layer2} />
      <div ref={layer3Ref} className={styles.layer3} />
      <div className={styles.shadowEdge} />
      <div className={styles.highlight} />
    </div>
  );
});

CurtainTransition.displayName = "CurtainTransition";
export default CurtainTransition;
