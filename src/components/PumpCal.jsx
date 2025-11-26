import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  Tooltip,
  Title,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Scatter } from "react-chartjs-2";

ChartJS.register(Tooltip, Title, Legend, CategoryScale, LinearScale, PointElement);

export default function DiaphragmPumpFlowDynamic() {
  const [capacity, setCapacity] = useState(10); // m³/hr
  const [actualFlow, setActualFlow] = useState(5); // m³/hr
  const [stroke, setStroke] = useState(50); // %
  const [speed, setSpeed] = useState(50); // %
  const [status, setStatus] = useState("");

  const marginPct = 10; // ±10%
  const [chartData, setChartData] = useState({ datasets: [] });
  const [currentFlow, setCurrentFlow] = useState(0);

  useEffect(() => {
    const flow = (capacity * stroke * speed) / 10000;
    setCurrentFlow(flow.toFixed(2));

    const safeLower = actualFlow * (1 - marginPct / 100);
    const safeUpper = actualFlow * (1 + marginPct / 100);

    const points = [];

    for (let s = 0; s <= 100; s += 5) {
      for (let sp = 0; sp <= 100; sp += 5) {
        const f = (capacity * s * sp) / 10000;
        let color = "";

        if (f >= safeLower && f <= safeUpper) color = "green"; // Safe
        else if (f < safeLower) color = "yellow"; // Underflow
        else color = "red"; // Overflow

        // Highlight current selected point
        const borderColor = s === stroke && sp === speed ? "black" : "transparent";

        points.push({ x: s, y: sp, r: 5, backgroundColor: color, flow: f, borderColor });
      }
    }

    setChartData({
      datasets: [
        {
          label: "Stroke vs Speed",
          data: points,
          pointBackgroundColor: points.map((p) => p.backgroundColor),
          pointBorderColor: points.map((p) => p.borderColor),
          pointBorderWidth: 2,
        },
      ],
    });

    // Status message
    if (flow > safeUpper) setStatus("⚠️ Overflow detected! Flow exceeds +10% margin.");
    else if (flow < safeLower) setStatus("⚠️ Underflow detected! Flow below -10% margin.");
    else setStatus("✅ Flow within safe ±10% margin.");
  }, [capacity, actualFlow, stroke, speed]);

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Dynamic Diaphragm Pump Calculator</h1>

      <div className="w-full max-w-md bg-white p-4 rounded shadow mb-6 flex flex-col gap-4">
        <div>
          <label className="block font-semibold mb-1">Pump Capacity (m³/hr)</label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Actual Flow (m³/hr)</label>
          <input
            type="number"
            value={actualFlow}
            onChange={(e) => setActualFlow(Number(e.target.value))}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Stroke (%)</label>
          <input
            type="range"
            min="0"
            max="100"
            value={stroke}
            onChange={(e) => setStroke(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-sm">Stroke: {stroke}%</span>
        </div>

        <div>
          <label className="block font-semibold mb-1">Speed (%)</label>
          <input
            type="range"
            min="0"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-sm">Speed: {speed}%</span>
        </div>

        <p className="mt-2 text-sm font-medium text-gray-700">{status}</p>
        <p className="mt-1 font-bold">Current Flow: {currentFlow} m³/hr</p>
      </div>

      <div className="w-full max-w-2xl bg-white p-4 rounded shadow">
        <Scatter
          data={chartData}
          options={{
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const flow = context.raw.flow.toFixed(2);
                    const color = context.raw.backgroundColor === "green" ? "Safe" : context.raw.backgroundColor === "yellow" ? "Underflow" : "Overflow";
                    return `Stroke: ${context.raw.x}% | Speed: ${context.raw.y}% | Flow: ${flow} m³/hr | ${color}`;
                  },
                },
              },
            },
            scales: {
              x: { title: { display: true, text: "Stroke (%)" }, min: 0, max: 100 },
              y: { title: { display: true, text: "Speed (%)" }, min: 0, max: 100 },
            },
          }}
        />
      </div>
      
    </div>
  );
}
