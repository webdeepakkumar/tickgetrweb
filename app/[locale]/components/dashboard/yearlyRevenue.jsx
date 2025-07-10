"use client"
import React from "react";
import { CustomTooltip,CustomTooltipAdmin } from "./tooltip";
import { usePathname } from "next/navigation";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const YearlyRevenue = ({
  revenueData,
  strokeColor,
  fillColorStart,
  fillColorEnd,
  gridColor,
  cursorColor,
  fill,
}) => {
  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth(); // 0-11 where 0 is January and 11 is December

  // Generate the last 12 months in the format "Month"
  const monthsOfYear = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date(currentDate);
    date.setMonth(currentMonthIndex - i);
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    monthsOfYear.unshift(month);
  }

  const data = monthsOfYear.map((monthYear) => ({
    monthYear,
    month: monthYear.split('-')[0],
    year: monthYear.split('-')[1],
    revenue: 0,
    ticket:0,
  }));

  revenueData.forEach((item) => {
    const [month, year] = item.month.split("-");
    // Use 'year' variable as needed
    const monthIndex = monthsOfYear.indexOf(month);
    if (monthIndex !== -1) {
      data[monthIndex].revenue = item.revenue;
      data[monthIndex].year = year;
      data[monthIndex].ticket = item.ticket;
    }
  });
  

  const pathname = usePathname()

  return (
    <ResponsiveContainer width="100%" height="95%">
      <AreaChart data={data} className="p-3">
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={fillColorStart} stopOpacity={0.5} />
            <stop offset="95%" stopColor={fillColorEnd} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: fill }}
          axisLine={false}
          tickMargin={15}
          tickLine={false}
          fillOpacity={0.7}
        />
        <YAxis
          tickFormatter={(value) => `€${value}`}
          tick={{ fontSize: 12, fill: fill }}
          axisLine={false}
          tickMargin={30}
          tickLine={false}
          fillOpacity={0.7}
        />
        <CartesianGrid vertical={false} stroke={gridColor} />
        <Tooltip
          formatter={(value) => `€${value}`}
          content={pathname === "/admin/dashboard" ? <CustomTooltipAdmin /> : <CustomTooltip />}
          cursor={{ stroke: cursorColor }}
        />
        <Area
          strokeWidth={1.5}
          type="monotone"
          dataKey="revenue"
          stroke={strokeColor}
          fillOpacity={1}
          fill="url(#colorRevenue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default YearlyRevenue;
