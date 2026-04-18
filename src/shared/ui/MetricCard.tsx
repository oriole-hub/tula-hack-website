import { Card } from "./Card";

export const MetricCard = ({
  label,
  value,
  caption,
  tone = "light",
}: {
  label: string;
  value: string | number;
  caption?: string;
  tone?: "light" | "dark" | "magenta";
}) => (
  <Card className={`metric-card metric-card--${tone}`}>
    <p>{label}</p>
    <strong>{value}</strong>
    {caption ? <span>{caption}</span> : null}
  </Card>
);
