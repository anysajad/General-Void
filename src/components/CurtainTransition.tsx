import { forwardRef } from "react";
import styles from "./CurtainTransition.module.css";

const CurtainTransition = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className={styles.curtain}>
      <div className={styles.layer1} />
      <div className={styles.layer2} />
      <div className={styles.layer3} />
      <div className={styles.shadowEdge} />
      <div className={styles.highlight} />
    </div>
  );
});

CurtainTransition.displayName = "CurtainTransition";
export default CurtainTransition;
