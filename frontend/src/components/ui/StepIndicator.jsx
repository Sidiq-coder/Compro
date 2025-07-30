import React from 'react';
import { cn } from '../../utils';

const StepIndicator = ({ 
  steps, 
  currentStep, 
  onStepClick,
  className = "" 
}) => {
  return (
    <div className={cn("flex items-center justify-start mb-8 w-full", className)}>
      <div className="flex items-center justify-between w-full max-w-2xl">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;
          const isClickable = onStepClick && (isCompleted || stepNumber <= currentStep + 1);

          return (
            <div key={step.key} className="flex items-center flex-1">
              {/* Step Circle */}
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : isCompleted
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600",
                isClickable && "cursor-pointer hover:bg-blue-500 hover:text-white"
              )}
              onClick={() => isClickable && onStepClick(stepNumber)}
            >
              {isCompleted ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                stepNumber
              )}
            </div>

            {/* Step Label */}
            <div className="ml-3 flex-1">
              <div
                className={cn(
                  "text-sm font-medium",
                  isActive
                    ? "text-blue-600"
                    : isCompleted
                    ? "text-blue-600"
                    : "text-gray-500"
                )}
              >
                {step.title}
              </div>
              {step.subtitle && (
                <div className="text-xs text-gray-400 mt-0.5">
                  {step.subtitle}
                </div>
              )}
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-4",
                  isCompleted
                    ? "bg-blue-600"
                    : "bg-gray-200"
                )}
              />
            )}
          </div>
        );
      })}
      </div>
    </div>
  );
};

export { StepIndicator };
