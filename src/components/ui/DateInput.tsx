/** @format */

import React, { forwardRef } from "react";
import { Calendar } from "lucide-react";

interface DateInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  (
    { label, error, helperText, fullWidth = false, className = "", ...props },
    ref
  ) => {
    const inputClasses = [
      "input input-bordered",
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
        <div className="relative">
          <input ref={ref} type="date" className={inputClasses} {...props} />
          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
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

DateInput.displayName = "DateInput";
