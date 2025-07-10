"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TgLogo from "./logo";

export const Splash = () => {
  const [show, setShow] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setShow(false);
    }, 3000);
  }, []);
  if (!show) return null;

  return (
    <motion.div
      className="w-screen h-screen flex justify-center items-center bg-gradient-to-br from-tg-orange to-tg-orange2 fixed z-50"
      initial={{ y: 0 }}
      animate={{
        y: "-100%",
        transition: { duration: 0.3, delay: 1.5, ease: "easeInOut" },
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: {
            duration: 0.5,
            ease: "easeInOut",
          },
        }}
      >
        <TgLogo className="w-40 md:w-60" logoText="white" logoEmblem="white" />
      </motion.div>
    </motion.div>
  );
};
