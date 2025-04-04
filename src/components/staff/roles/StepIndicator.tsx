
import React from "react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center space-x-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <div 
                className={`w-10 h-1 ${
                  currentStep > index ? "bg-app-purple" : "bg-gray-200"
                }`}
              ></div>
            )}
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep > index
                  ? "bg-app-purple text-white"
                  : currentStep === index + 1
                    ? "bg-app-purple text-white"
                    : "bg-gray-200 text-gray-500"
              }`}
            >
              {index + 1}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
