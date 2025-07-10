import React, { useEffect, useState } from "react";

const Counter = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = isNaN(value) ? 0 : parseFloat(value);
    const duration = 1500; // Adjust animation duration as needed
    const range = end - start;
    let startTime;

    const animationFrame = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const newValue = start + progress * range;
      setCount(newValue.toFixed(2)); // Adjust decimal places here

      if (elapsedTime < duration) {
        requestAnimationFrame(animationFrame);
      }
    };

    requestAnimationFrame(animationFrame);

    return () => {
      setCount(0);
    };
  }, [value]);

  return <span>{count}</span>;
};

export default Counter;
