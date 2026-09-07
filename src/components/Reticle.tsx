import { forwardRef } from "react";
import styles from "./Reticle.module.css";

const Reticle = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className={styles.reticle}>
      <span className={styles.innerRing} />
    </div>
  );
});

Reticle.displayName = "Reticle";
export default Reticle;
