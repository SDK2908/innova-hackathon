import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";

function LeakScoreGauge({ score = 80 }) {
  const data = [
    {
      name: "Leak Score",
      value: score,
      fill:
        score >= 75
          ? "#dc2626"
          : score >= 50
          ? "#f59e0b"
          : "#16a34a",
    },
  ];

  return (
    <div className="gauge-card">

      <h2>Leak Score</h2>

      <ResponsiveContainer
        width="100%"
        height={260}
      >
        <RadialBarChart
          innerRadius="70%"
          outerRadius="100%"
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <RadialBar
            background
            dataKey="value"
          />
        </RadialBarChart>
      </ResponsiveContainer>

      <div className="score-number">
        {score}/100
      </div>

    </div>
  );
}

export default LeakScoreGauge;