export const StatusChip = ({
  label,
  tone = "default",
}: {
  label: string;
  tone?: "default" | "accent" | "danger";
}) => <span className={`status-chip status-chip--${tone}`}>{label}</span>;
