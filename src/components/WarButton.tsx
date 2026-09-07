import { forwardRef } from "react";
import styles from "./WarButton.module.css";

interface WarButtonProps {
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const WarButton = forwardRef<HTMLButtonElement, WarButtonProps>(
  ({ onClick, onMouseEnter, onMouseLeave }, ref) => {
    return (
      <button
        ref={ref}
        className={styles.warButton}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        aria-label="Start The War"
      >
        <span className={styles.borderGlow} />
        <span className={styles.innerBorder} />
        <span className={styles.energyTop} />
        <span className={styles.energyBottom} />
        <span className={styles.energyLeft} />
        <span className={styles.energyRight} />
        <span className={styles.label}>Start The War</span>
        <span className={styles.underline} />
      </button>
    );
  }
);

WarButton.displayName = "WarButton";
export default WarButton;
