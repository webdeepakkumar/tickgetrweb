import React from "react";
import LoadingButtonSpinner from "./loadingButtonSpinner";

const ButtonWithLoading = ({
  isLoading,
  isLoadingText,
  isDisabled,
  onClick,
  buttonText,
  className,
}) => (
  <button
    type="submit"
    className={className}
    disabled={isDisabled}
    onClick={onClick}
  >
    {isLoading ? <LoadingButtonSpinner text={isLoadingText} /> : buttonText}
  </button>
);

export default ButtonWithLoading;
