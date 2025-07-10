import React from "react";
import { CustomTooltip } from "./tooltip";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const OverallRevenue = ({ revenueData }) => {


  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  
  // Sort the revenue data by date in ascending order
  const sortedData = [...revenueData].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Check if we need to group by month
  const groupByMonth = sortedData.length > 12;

  // Group data by month if needed
  const processedData = groupByMonth
    ? Object.values(
        sortedData.reduce((acc, current) => {
          const date = new Date(current.date);
          const monthYear = `${date.getFullYear()}-${date.getMonth()}`;
          if (!acc[monthYear]) {
            acc[monthYear] = {
              date: monthYear,
              revenue: 0,
            };
          }
          acc[monthYear].revenue += current.revenue;
          return acc;
        }, {})
      )
    : sortedData;

  const formatXAxis = (value) => {
    if (groupByMonth) {
      const [year, month] = value.split("-");
      return `${monthNames[month]} ${year}`;
    } else {
      const date = new Date(value);
      return `${monthNames[date.getMonth()]} ${date.getDate()}`;
    }
  };

  return (
    <ResponsiveContainer width="100%" height="95%">
      <AreaChart data={processedData} className="p-3">
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF7A00" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          tickFormatter={formatXAxis}
          tick={{ fontSize: 10 }}
          axisLine={false}
          tickMargin={12}
          tickLine={false}
          fillOpacity={0.7}
        />
        <YAxis
          tickFormatter={(value) => `€${value}`}
          tick={{ fontSize: 12 }}
          axisLine={false}
          tickMargin={30}
          tickLine={false}
          fillOpacity={0.7}
        />
        <CartesianGrid vertical={false} stroke="#eeeeee" />
        <Tooltip
          formatter={(value) => `€${value}`}
          content={CustomTooltip}
          cursor={{ stroke: "#ffd5b0" }}
        />
        <Area
          strokeWidth={1.5}
          type="monotone"
          dataKey="revenue"
          stroke="#FF7A00"
          fillOpacity={1}
          fill="url(#colorRevenue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default OverallRevenue;
