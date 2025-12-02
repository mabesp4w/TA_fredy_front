/** @format */

import React, { forwardRef } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Option[];
  placeholder?: string;
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder = "Select an option",
      fullWidth = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const selectClasses = [
      "select select-bordered",
      fullWidth ? "w-full" : "",
      error ? "select-error" : "",
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
        <select ref={ref} className={selectClasses} {...props}>
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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

Select.displayName = "Select";
