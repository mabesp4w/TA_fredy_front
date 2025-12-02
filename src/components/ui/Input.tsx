/** @format */

import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?:
    | "bordered"
    | "ghost"
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "warning"
    | "error";
  inputSize?: "xs" | "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      variant = "bordered",
      inputSize = "md",
      fullWidth = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseClasses = "input";

    const variantClasses = {
      bordered: "input-bordered",
      ghost: "input-ghost",
      primary: "input-primary",
      secondary: "input-secondary",
      accent: "input-accent",
      success: "input-success",
      warning: "input-warning",
      error: "input-error",
    };

    const sizeClasses = {
      xs: "input-xs",
      sm: "input-sm",
      md: "",
      lg: "input-lg",
    };

    const inputClasses = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[inputSize],
      fullWidth ? "w-full" : "",
      error ? "input-error" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={`form-control ${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label className="label">
            <span className="label-text">{label}</span>
          </label>
        )}
        <input ref={ref} className={inputClasses} {...props} />
        {(error || helperText) && (
          <label className="label">
            <span
              className={`label-text-alt ${
                error ? "text-error" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {error || helperText}
            </span>
          </label>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
