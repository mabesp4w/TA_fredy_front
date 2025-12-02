/** @format */

import React, { forwardRef } from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
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
  textareaSize?: "xs" | "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      variant = "bordered",
      textareaSize = "md",
      fullWidth = false,
      className = "",
      rows = 4,
      ...props
    },
    ref
  ) => {
    const baseClasses = "textarea";

    const variantClasses = {
      bordered: "textarea-bordered",
      ghost: "textarea-ghost",
      primary: "textarea-primary",
      secondary: "textarea-secondary",
      accent: "textarea-accent",
      success: "textarea-success",
      warning: "textarea-warning",
      error: "textarea-error",
    };

    const sizeClasses = {
      xs: "textarea-xs",
      sm: "textarea-sm",
      md: "",
      lg: "textarea-lg",
    };

    const textareaClasses = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[textareaSize],
      fullWidth ? "w-full" : "",
      error ? "textarea-error" : "",
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
        <textarea
          ref={ref}
          className={textareaClasses}
          rows={rows}
          {...props}
        />
        {(error || helperText) && (
          <label className="label">
            <span
              className={`label-text-alt ${
                error ? "text-error" : "text-gray-500"
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

Textarea.displayName = "Textarea";
