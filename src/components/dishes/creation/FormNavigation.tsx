
import React from "react";
import { Button } from "@/components/ui/button";

interface FormNavigationProps {
  currentStep: number;
  hasIngredients: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
}

export const FormNavigation: React.FC<FormNavigationProps> = ({
  currentStep,
  hasIngredients,
  onPrevStep,
  onNextStep
}) => {
  return (
    <div className="flex justify-between pt-4">
      {currentStep === 2 ? (
        <>
          <Button type="button" variant="outline" onClick={onPrevStep}>
            Volver
          </Button>
          <Button type="submit" disabled={!hasIngredients}>
            Crear Platillo
          </Button>
        </>
      ) : (
        <>
          <div></div>
          <Button type="button" onClick={onNextStep}>
            Siguiente
          </Button>
        </>
      )}
    </div>
  );
};
