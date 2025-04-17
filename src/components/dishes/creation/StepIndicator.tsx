
import React from "react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div 
          key={index}
          className={`h-3 w-3 rounded-full ${
            currentStep >= index + 1 ? "bg-app-purple" : "bg-gray-300"
          }`} 
        />
      ))}
    </div>
  );
};
