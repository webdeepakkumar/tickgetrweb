import React from "react";
import { motion } from "framer-motion";

const Transition3 = ({ children, className, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut", delay: delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default Transition3;
