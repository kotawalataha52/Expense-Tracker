import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import styles from "./SpendingChart.module.css";

const COLORS = [
  "#2bde9e", "#63b3ed", "#f6ad55", "#f87171",
  "#b794f4", "#76e4f7", "#fbd38d", "#fc8181",
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipName}>{name}</span>
      <span className={styles.tooltipVal}>
        {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value)}
      </span>
    </div>
  );
};

export default function SpendingChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No spending data to display</p>
      </div>
    );
  }

  return (
    <div className={styles.chartWrap}>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            strokeWidth={0}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => <span className={styles.legendLabel}>{value}</span>}
            iconType="circle"
            iconSize={8}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
