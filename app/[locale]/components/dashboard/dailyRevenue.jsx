"use client"
import React from "react";
import { CustomTooltipDaily, CustomTooltipAdminDaily } from "./tooltip";
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

const DailyRevenue = ({
  revenueData,
  strokeColor,
  fillColorStart,
  fillColorEnd,
  gridColor,
  cursorColor,
  fill,
}) => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const data = daysOfWeek.map((day) => ({
    day,
    revenue: 0,
    ticket:0,
  }));
 console.log(revenueData)
  revenueData.forEach((item) => {
    const index = daysOfWeek.indexOf(item.day);
    if (index !== -1) {
      data[index].revenue = item.revenue;
      data[index].ticket = item.ticket;
    }
  });

  const todayIndex = new Date().getDay(); // Returns 0 for Sunday, 1 for Monday, etc.
  const rearrangedData = [
    ...data.slice(todayIndex + 1), // Entries from the day after today onwards
    ...data.slice(0, todayIndex + 1), // Entries from the beginning of the week up to today
  ];
  const pathname = usePathname()
  return (
    <ResponsiveContainer width="100%" height="95%">
      <AreaChart data={rearrangedData} className="p-3">
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={fillColorStart} stopOpacity={0.5} />
            <stop offset="95%" stopColor={fillColorEnd} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="day"
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
          content= {pathname === "/admin/dashboard" ? <CustomTooltipAdminDaily/> : <CustomTooltipDaily/>}
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

export default DailyRevenue;
