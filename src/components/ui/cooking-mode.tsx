import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, X, Volume2 } from "lucide-react";
import { Timer } from "./timer";

interface CookingModeProps {
  recipeName: string;
  instructions: string[];
  onClose: () => void;
}

export const CookingMode = ({ recipeName, instructions, onClose }: CookingModeProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTimer, setShowTimer] = useState(false);

  const nextStep = () => {
    if (currentStep < instructions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const speakInstruction = () => {
    const utterance = new SpeechSynthesisUtterance(instructions[currentStep]);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="bg-card border-b p-4 flex items-center justify-between">
        <Button variant="ghost" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold text-center flex-1">{recipeName}</h1>
        <Button variant="ghost" onClick={() => setShowTimer(!showTimer)}>
          ⏰
        </Button>
      </div>

      {/* Progress */}
      <div className="bg-card border-b p-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>الخطوة {currentStep + 1} من {instructions.length}</span>
          <span>{Math.round(((currentStep + 1) / instructions.length) * 100)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / instructions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center p-6">
        {showTimer && (
          <div className="mb-6 flex justify-center">
            <Timer initialMinutes={5} title="مؤقت الخطوة" />
          </div>
        )}

        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold">
                {currentStep + 1}
              </div>
              <p className="text-xl leading-relaxed text-foreground">
                {instructions[currentStep]}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Audio Button */}
        <div className="flex justify-center mb-6">
          <Button onClick={speakInstruction} variant="outline" size="lg">
            <Volume2 className="w-5 h-5 ml-2" />
            اقرأ الخطوة
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-card border-t p-4">
        <div className="flex justify-between items-center">
          <Button 
            onClick={prevStep} 
            disabled={currentStep === 0}
            variant="outline"
            size="lg"
          >
            <ChevronRight className="w-5 h-5 ml-2" />
            السابق
          </Button>

          {currentStep === instructions.length - 1 ? (
            <Button onClick={onClose} size="lg" className="bg-green-600 hover:bg-green-700">
              ✅ انتهيت من الطبخ
            </Button>
          ) : (
            <Button onClick={nextStep} size="lg">
              التالي
              <ChevronLeft className="w-5 h-5 mr-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};