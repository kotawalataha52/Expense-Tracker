import { useState, useEffect } from "react";
import API from "../api/axiosInstance";
import styles from "./TransactionModal.module.css";

export default function TransactionModal({ onClose, onSaved, editData }) {
  const isEdit = !!editData;

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    amount: editData?.amount ?? "",
    type: editData?.type ?? "expense",
    category: editData?.category?._id ?? editData?.category ?? "",
    note: editData?.note ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch categories on mount
  useEffect(() => {
    API.get("/categories")
      .then((res) => {
        // getCategories wraps result in { data: [...] }
        const raw = res.data.data;
        setCategories(Array.isArray(raw) ? raw : raw?.data ?? []);
      })
      .catch(() => setCategories([]));
  }, []);

  // Filter categories to match selected type
  const filteredCats = categories.filter((c) => c.type === form.type);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      // Reset category when type changes
      if (name === "type") next.category = "";
      return next;
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.category) {
      setError("Amount and category are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (isEdit) {
        await API.put(`/transactions/${editData._id}`, {
          amount: Number(form.amount),
          type: form.type,
          category: form.category,
          note: form.note,
        });
      } else {
        await API.post("/transactions", {
          amount: Number(form.amount),
          type: form.type,
          category: form.category,
          note: form.note,
        });
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdrop} role="dialog" aria-modal="true" aria-label={isEdit ? "Edit transaction" : "Add transaction"}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{isEdit ? "Edit transaction" : "Add transaction"}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {error && <p className={styles.error}>{error}</p>}

          {/* Type toggle */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Type</label>
            <div className={styles.typeToggle}>
              <button
                type="button"
                id="type-income"
                className={`${styles.typeBtn} ${form.type === "income" ? styles.incomeActive : ""}`}
                onClick={() => handleChange({ target: { name: "type", value: "income" } })}
              >
                ↑ Income
              </button>
              <button
                type="button"
                id="type-expense"
                className={`${styles.typeBtn} ${form.type === "expense" ? styles.expenseActive : ""}`}
                onClick={() => handleChange({ target: { name: "type", value: "expense" } })}
              >
                ↓ Expense
              </button>
            </div>
          </div>

          {/* Amount */}
          <div className={styles.fieldGroup}>
            <label htmlFor="tx-amount" className={styles.label}>Amount (₹)</label>
            <input
              id="tx-amount"
              type="number"
              name="amount"
              min="1"
              step="any"
              placeholder="0"
              value={form.amount}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          {/* Category */}
          <div className={styles.fieldGroup}>
            <label htmlFor="tx-category" className={styles.label}>Category</label>
            <select
              id="tx-category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className={styles.select}
              required
            >
              <option value="">Select category</option>
              {filteredCats.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            {filteredCats.length === 0 && (
              <p className={styles.hint}>No {form.type} categories found. Add one first.</p>
            )}
          </div>

          {/* Note */}
          <div className={styles.fieldGroup}>
            <label htmlFor="tx-note" className={styles.label}>Note <span className={styles.optional}>(optional)</span></label>
            <input
              id="tx-note"
              type="text"
              name="note"
              placeholder="e.g. Grocery run"
              value={form.note}
              onChange={handleChange}
              className={styles.input}
              maxLength={100}
            />
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button id="tx-submit-btn" type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? <span className={styles.spinner} /> : null}
              {loading ? "Saving…" : isEdit ? "Save changes" : "Add transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
