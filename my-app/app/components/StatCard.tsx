type StatCardProps = {
  label: string;
  value: string;
  trend: string;
  trendType: "up" | "warn" | "neutral";
};

export default function StatCard({ label, value, trend, trendType }: StatCardProps) {
  const trendColor =
    trendType === "up"
      ? "text-success-ink"
      : trendType === "warn"
      ? "text-pending-ink"
      : "text-dark-3";

  return (
    <div className="bg-white rounded-lg border border-dark-7 shadow-sm p-5">
      <p className="font-body text-xs text-dark-4 font-medium mb-2">{label}</p>
      <p className="font-display text-2xl font-bold text-dark mb-1">{value}</p>
      <p className={`text-xs font-medium ${trendColor}`}>{trend}</p>
    </div>
  );
}