"use client";
import React from "react";
import { motion } from "framer-motion";

const ProgressBar = ({ name, percent, barColor="bg-tg-orange", barBgColor="bg-zinc-200" }) => {
  const validPercent = isNaN(percent) ? 0 : percent;

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex justify-between text-xs text-zinc-400">
        <div className="tracking-wide">{name}</div>
        <div>{validPercent}%</div>
      </div>
      <div className={`w-full h-1.5 ${barBgColor} rounded-full overflow-hidden`}>
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: `${validPercent}%` }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className={`h-full ${barColor} rounded-full`}
        ></motion.div>
      </div>
    </div>
  );
};

export default ProgressBar;
