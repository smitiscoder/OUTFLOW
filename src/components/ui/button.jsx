import React from "react";
import clsx from "clsx";

const variants = {
  default: "bg-orange-500 text-white hover:bg-orange-600",
  ghost: "bg-transparent hover:bg-white/10",
};

const sizes = {
  default: "rounded-full text-sm",
  icon: "p-2 w-10 h-10 flex items-center justify-center rounded-full", 
};

export const Button = ({
  children,
  className,
  variant = "default",
  size = "default",
  ...props
}) => {
  return (
    <button
      className={clsx(
        " font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
