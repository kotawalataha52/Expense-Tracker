import styles from "./ConfirmDialog.module.css";

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onCancel();
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdrop} role="dialog" aria-modal="true" aria-label="Confirm action">
      <div className={styles.dialog}>
        <div className={styles.icon}>
          <svg viewBox="0 0 20 20" fill="currentColor" width="24" height="24">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-1-8a1 1 0 0 0-1 1v3a1 1 0 0 0 2 0V6a1 1 0 0 0-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button id="confirm-cancel-btn" className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
          <button id="confirm-delete-btn" className={styles.deleteBtn} onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}
