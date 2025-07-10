import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Transition2 = ({ children, className }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "anticipate" }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default Transition2;
