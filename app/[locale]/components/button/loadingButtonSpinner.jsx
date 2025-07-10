import React from "react";

const LoadingButtonSpinner = ({ text }) => (
  <span className="flex items-center">
    <svg
      className="animate-spin h-5 w-5 mr-3"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V2.83A10 10 0 002 12h2zm10 8a8 8 0 01-8-8H2a10 10 0 0010 10v-2zm8-8a8 8 0 01-8 8v2a10 10 0 0010-10h-2z"
      ></path>
    </svg>
    {text}
  </span>
);

export default LoadingButtonSpinner;
