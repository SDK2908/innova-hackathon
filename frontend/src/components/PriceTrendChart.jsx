import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function PriceTrendChart({ leak }) {
  const current = Number(leak.amount);

  const previous =
    leak.previousAmount
      ? Number(leak.previousAmount)
      : current * 0.75;

  const data = [
    {
      month: "Jan",
      price: previous,
    },
    {
      month: "Feb",
      price: previous,
    },
    {
      month: "Mar",
      price: previous,
    },
    {
      month: "Apr",
      price: current,
    },
    {
      month: "May",
      price: current,
    },
    {
      month: "Jun",
      price: current,
    },
  ];

  return (
    <div className="trend-card">

      <h2>📈 Subscription Price Trend</h2>

      <ResponsiveContainer
        width="100%"
        height={320}
      >
        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="price"
            stroke="#2563eb"
            strokeWidth={4}
            dot={{ r: 6 }}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}

export default PriceTrendChart;