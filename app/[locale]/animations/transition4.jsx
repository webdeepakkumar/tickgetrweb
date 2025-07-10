import React from "react";
import { motion } from "framer-motion";

const Transition4 = ({ children, className, delay, x, y }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: x, y: y }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut", delay: delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default Transition4;
