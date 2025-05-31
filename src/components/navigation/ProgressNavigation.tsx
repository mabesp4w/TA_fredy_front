/** @format */

import React from "react";
import { Check } from "lucide-react";

interface ProgressStep {
  id: string;
  label: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  status: "pending" | "current" | "completed" | "error";
  optional?: boolean;
}

interface ProgressNavigationProps {
  steps: ProgressStep[];
  onStepClick?: (stepId: string) => void;
  allowStepNavigation?: boolean;
  variant?: "horizontal" | "vertical";
  showDescriptions?: boolean;
  className?: string;
}

export const ProgressNavigation: React.FC<ProgressNavigationProps> = ({
  steps,
  onStepClick,
  allowStepNavigation = false,
  variant = "horizontal",
  showDescriptions = true,
  className = "",
}) => {
  const getStepClasses = (step: ProgressStep) => {
    const baseClasses = "relative flex items-center";
    const clickableClasses =
      allowStepNavigation && step.status !== "pending"
        ? "cursor-pointer hover:bg-gray-50"
        : "";

    return `${baseClasses} ${clickableClasses}`;
  };

  const getStepIconClasses = (step: ProgressStep) => {
    const baseClasses =
      "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors";

    switch (step.status) {
      case "completed":
        return `${baseClasses} bg-success border-success text-white`;
      case "current":
        return `${baseClasses} bg-primary border-primary text-white`;
      case "error":
        return `${baseClasses} bg-error border-error text-white`;
      default:
        return `${baseClasses} bg-white border-gray-300 text-gray-500`;
    }
  };

  const getStepTextClasses = (step: ProgressStep) => {
    const baseClasses = "ml-3";

    switch (step.status) {
      case "completed":
        return `${baseClasses} text-success`;
      case "current":
        return `${baseClasses} text-primary font-medium`;
      case "error":
        return `${baseClasses} text-error`;
      default:
        return `${baseClasses} text-gray-500`;
    }
  };

  const renderStepIcon = (step: ProgressStep) => {
    const IconComponent = step.icon;

    if (step.status === "completed") {
      return <Check className="w-4 h-4" />;
    }

    if (IconComponent) {
      return <IconComponent className="w-4 h-4" />;
    }

    return (
      <span className="text-sm font-medium">
        {steps.findIndex((s) => s.id === step.id) + 1}
      </span>
    );
  };

  const renderConnector = (index: number) => {
    if (index === steps.length - 1) return null;

    const nextStep = steps[index + 1];
    const currentStep = steps[index];

    console.log({ nextStep, currentStep });

    const connectorClasses =
      variant === "horizontal"
        ? "absolute top-4 left-full w-full h-0.5 -translate-y-1/2"
        : "absolute top-8 left-4 w-0.5 h-full -translate-x-1/2";

    const colorClasses =
      currentStep.status === "completed" ? "bg-success" : "bg-gray-300";

    return <div className={`${connectorClasses} ${colorClasses}`} />;
  };

  const handleStepClick = (step: ProgressStep) => {
    if (allowStepNavigation && step.status !== "pending" && onStepClick) {
      onStepClick(step.id);
    }
  };

  if (variant === "vertical") {
    return (
      <div className={`space-y-4 ${className}`}>
        {steps.map((step, index) => (
          <div key={step.id} className="relative">
            <div
              className={getStepClasses(step)}
              onClick={() => handleStepClick(step)}
            >
              <div className={getStepIconClasses(step)}>
                {renderStepIcon(step)}
              </div>

              <div className={getStepTextClasses(step)}>
                <div className="flex items-center">
                  <span className="font-medium">{step.label}</span>
                  {step.optional && (
                    <span className="ml-2 text-xs text-gray-400">
                      (Optional)
                    </span>
                  )}
                </div>
                {showDescriptions && step.description && (
                  <div className="text-sm text-gray-500 mt-1">
                    {step.description}
                  </div>
                )}
              </div>
            </div>

            {renderConnector(index)}
          </div>
        ))}
      </div>
    );
  }

  // Horizontal variant
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {steps.map((step, index) => (
        <div key={step.id} className="relative flex-1">
          <div
            className={`${getStepClasses(step)} ${
              variant === "horizontal"
                ? "flex-col text-center p-2 rounded-lg"
                : ""
            }`}
            onClick={() => handleStepClick(step)}
          >
            <div className={getStepIconClasses(step)}>
              {renderStepIcon(step)}
            </div>

            <div
              className={`${getStepTextClasses(step)} ${
                variant === "horizontal" ? "ml-0 mt-2" : ""
              }`}
            >
              <div className="flex items-center justify-center">
                <span className="text-sm font-medium">{step.label}</span>
                {step.optional && (
                  <span className="ml-1 text-xs text-gray-400">(Optional)</span>
                )}
              </div>
              {showDescriptions && step.description && (
                <div className="text-xs text-gray-500 mt-1">
                  {step.description}
                </div>
              )}
            </div>
          </div>

          {renderConnector(index)}
        </div>
      ))}
    </div>
  );
};
