import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axiosInstance";
import TransactionModal from "../components/TransactionModal";
import ConfirmDialog from "../components/ConfirmDialog";
import SpendingChart from "../components/SpendingChart";
import styles from "./dashboard.module.css";

const MONTHS = [
  { value: "", label: "All time" },
  { value: "2025-01", label: "Jan 2025" }, { value: "2025-02", label: "Feb 2025" },
  { value: "2025-03", label: "Mar 2025" }, { value: "2025-04", label: "Apr 2025" },
  { value: "2025-05", label: "May 2025" }, { value: "2025-06", label: "Jun 2025" },
  { value: "2025-07", label: "Jul 2025" }, { value: "2025-08", label: "Aug 2025" },
  { value: "2025-09", label: "Sep 2025" }, { value: "2025-10", label: "Oct 2025" },
  { value: "2025-11", label: "Nov 2025" }, { value: "2025-12", label: "Dec 2025" },
  { value: "2026-01", label: "Jan 2026" }, { value: "2026-02", label: "Feb 2026" },
  { value: "2026-03", label: "Mar 2026" }, { value: "2026-04", label: "Apr 2026" },
  { value: "2026-05", label: "May 2026" }, { value: "2026-06", label: "Jun 2026" },
];

function fmt(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(amount);
}

function fmtDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export default function Dashboard() {
  const { user, logout } = useAuth();

  const [summary, setSummary]       = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [transactions, setTx]       = useState([]);
  const [categories, setCats]       = useState([]);
  const [categoryChart, setCatChart]= useState([]);
  const [filters, setFilters]       = useState({ month: "", category: "" });
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");

  // Modal state
  const [showModal, setShowModal]   = useState(false);
  const [editData, setEditData]     = useState(null);

  // Confirm delete state
  const [deleteTarget, setDeleteTarget] = useState(null); // { _id, note }

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (filters.month)    params.month    = filters.month;
      if (filters.category) params.category = filters.category;

      const [summaryRes, txRes, catRes, chartRes] = await Promise.all([
        API.get("/summary",      { params: filters.month ? { month: filters.month } : {} }),
        API.get("/transactions", { params }),
        API.get("/categories"),
        API.get("/summary/categories", { params: filters.month ? { month: filters.month } : {} }),
      ]);

      setSummary(summaryRes.data.data);
      setTx(txRes.data.data);

      // categories response: { data: { data: [...] } }
      const rawCats = catRes.data.data;
      setCats(Array.isArray(rawCats) ? rawCats : rawCats?.data ?? []);

      // category chart: { data: { categories: [...] } }
      setCatChart(chartRes.data.data?.categories ?? []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openAdd  = () => { setEditData(null); setShowModal(true); };
  const openEdit = (tx) => { setEditData(tx); setShowModal(true); };

  const confirmDelete = (tx) => setDeleteTarget(tx);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await API.delete(`/transactions/${deleteTarget._id}`);
      setDeleteTarget(null);
      fetchData();
    } catch {
      setDeleteTarget(null);
    }
  };

  return (
    <div className={styles.page}>
      {/* Modals */}
      {showModal && (
        <TransactionModal
          onClose={() => setShowModal(false)}
          onSaved={fetchData}
          editData={editData}
        />
      )}
      {deleteTarget && (
        <ConfirmDialog
          message={`Delete "${deleteTarget.note || "this transaction"}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>₹</div>
          <div>
            <p className={styles.greeting}>Hello, {user?.name?.split(" ")[0]} 👋</p>
            <p className={styles.subGreeting}>Here's your financial overview</p>
          </div>
        </div>
        <button id="logout-btn" className={styles.logoutBtn} onClick={logout}>Sign out</button>
      </header>

      <main className={styles.main}>
        {/* Stat Cards */}
        <section className={styles.statsRow} aria-label="Financial summary">
          <StatCard label="Total Income"    value={fmt(summary.totalIncome)}  type="income" />
          <StatCard label="Total Expenses"  value={fmt(summary.totalExpense)} type="expense" />
          <StatCard label="Net Balance"     value={fmt(summary.balance)}
            type={summary.balance >= 0 ? "balance-pos" : "balance-neg"} />
        </section>

        {/* Chart + Filter row */}
        <div className={styles.midRow}>
          {/* Spending by category chart */}
          <section className={styles.chartCard}>
            <h2 className={styles.sectionTitle}>Spending by Category</h2>
            <SpendingChart data={categoryChart} />
          </section>

          {/* Filter bar */}
          <section className={styles.filterCard}>
            <h2 className={styles.sectionTitle}>Filters</h2>
            <div className={styles.filterStack}>
              <div className={styles.filterGroup}>
                <label htmlFor="filter-month" className={styles.filterLabel}>Month</label>
                <select id="filter-month" name="month" value={filters.month}
                  onChange={handleFilterChange} className={styles.select}>
                  {MONTHS.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label htmlFor="filter-category" className={styles.filterLabel}>Category</label>
                <select id="filter-category" name="category" value={filters.category}
                  onChange={handleFilterChange} className={styles.select}>
                  <option value="">All categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {(filters.month || filters.category) && (
                <button className={styles.clearBtn}
                  onClick={() => setFilters({ month: "", category: "" })}>
                  Clear filters
                </button>
              )}
            </div>
          </section>
        </div>

        {/* Transaction Table */}
        <section className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <div className={styles.tableTitleRow}>
              <h2 className={styles.tableTitle}>Transactions</h2>
              <span className={styles.txCount}>{transactions.length} record{transactions.length !== 1 ? "s" : ""}</span>
            </div>
            <button id="add-transaction-btn" className={styles.addBtn} onClick={openAdd}>
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path fillRule="evenodd" d="M10 3a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H4a1 1 0 1 1 0-2h5V4a1 1 0 0 1 1-1z" clipRule="evenodd" />
              </svg>
              Add
            </button>
          </div>

          {error && <p className={styles.errorText}>{error}</p>}

          {loading ? (
            <div className={styles.loadingWrap}>
              <span className={styles.spinner} />
              <span>Loading…</span>
            </div>
          ) : transactions.length === 0 ? (
            <div className={styles.emptyState}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="36" height="36" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
              </svg>
              <p>No transactions found</p>
              <span>Try adjusting your filters or add a new one</span>
            </div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Note</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th className={styles.amountCol}>Amount</th>
                    <th className={styles.actionsCol}></th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx._id} className={styles.tableRow}>
                      <td>
                        <span className={styles.categoryBadge}>{tx.category?.name || "—"}</span>
                      </td>
                      <td className={styles.noteCell}>{tx.note || <span className={styles.noNote}>—</span>}</td>
                      <td className={styles.dateCell}>{fmtDate(tx.date || tx.createdAt)}</td>
                      <td>
                        <span className={`${styles.typeBadge} ${tx.type === "income" ? styles.incomeTag : styles.expenseTag}`}>
                          {tx.type === "income" ? "↑ Income" : "↓ Expense"}
                        </span>
                      </td>
                      <td className={`${styles.amountCol} ${tx.type === "income" ? styles.incomeAmt : styles.expenseAmt}`}>
                        {tx.type === "income" ? "+" : "−"}{fmt(tx.amount)}
                      </td>
                      <td className={styles.actionsCol}>
                        <div className={styles.rowActions}>
                          <button className={styles.editBtn} onClick={() => openEdit(tx)} aria-label="Edit transaction" title="Edit">
                            <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
                              <path d="M13.586 3.586a2 2 0 1 1 2.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793 3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button className={styles.deleteBtn} onClick={() => confirmDelete(tx)} aria-label="Delete transaction" title="Delete">
                            <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
                              <path fillRule="evenodd" d="M9 2a1 1 0 0 0-.894.553L7.382 4H4a1 1 0 0 0 0 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6a1 1 0 0 0 0-2h-3.382l-.724-1.447A1 1 0 0 0 11 2H9zM7 8a1 1 0 0 1 2 0v6a1 1 0 1 1-2 0V8zm4 0a1 1 0 0 1 2 0v6a1 1 0 1 1-2 0V8z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function StatCard({ label, value, type }) {
  const icons = {
    income: <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.707-8.707-3-3a1 1 0 0 0-1.414 1.414L10.586 9H7a1 1 0 1 0 0 2h3.586l-1.293 1.293a1 1 0 1 0 1.414 1.414l3-3a1 1 0 0 0 0-1.414z" clipRule="evenodd" /></svg>,
    expense: <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-3.707-9.293 3 3a1 1 0 0 0 1.414 0l3-3a1 1 0 0 0-1.414-1.414L11 10.586V7a1 1 0 1 0-2 0v3.586L7.707 9.293a1 1 0 0 0-1.414 1.414z" clipRule="evenodd" /></svg>,
    "balance-pos": <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 0 1-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 0 1-.567.267z" /><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-13a1 1 0 1 0-2 0v.092a4.535 4.535 0 0 0-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 1 0-1.51 1.31c.562.649 1.413 1.028 2.353 1.148V17a1 1 0 1 0 2 0v-.092a4.535 4.535 0 0 0 1.676-.662C13.398 15.766 14 14.991 14 14c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0 0 11 11.092V9.151c.391.127.68.317.843.504a1 1 0 1 0 1.51-1.31c-.562-.649-1.413-1.028-2.353-1.148V5z" clipRule="evenodd" /></svg>,
  };
  icons["balance-neg"] = icons["balance-pos"];

  return (
    <div className={`${styles.statCard} ${styles[`card-${type}`]}`}>
      <div className={styles.statIcon}>{icons[type]}</div>
      <div className={styles.statInfo}>
        <p className={styles.statLabel}>{label}</p>
        <p className={styles.statValue}>{value}</p>
      </div>
    </div>
  );
}
