import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Clock } from "lucide-react";
import { toast } from "sonner";

interface TimerProps {
  initialMinutes?: number;
  title?: string;
  onComplete?: () => void;
}

export const Timer = ({ initialMinutes = 10, title = "مؤقت الطبخ", onComplete }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime] = useState(initialMinutes * 60);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            toast.success("انتهى الوقت! 🔔");
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      toast.info("بدأ المؤقت");
    } else {
      toast.info("تم إيقاف المؤقت");
    }
  };

  const resetTimer = () => {
    setTimeLeft(initialTime);
    setIsRunning(false);
    toast.info("تم إعادة تعيين المؤقت");
  };

  const progress = ((initialTime - timeLeft) / initialTime) * 100;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Clock className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Ring */}
        <div className="relative w-32 h-32 mx-auto">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className={`transition-all duration-1000 ${
                timeLeft <= 60 ? 'text-red-500' : 'text-primary'
              }`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-2xl font-bold ${
              timeLeft <= 60 ? 'text-red-500' : 'text-foreground'
            }`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2">
          <Button
            onClick={toggleTimer}
            variant={isRunning ? "destructive" : "default"}
            size="sm"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button onClick={resetTimer} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Status */}
        <div className="text-center text-sm text-muted-foreground">
          {timeLeft === 0 && "انتهى الوقت! 🎉"}
          {timeLeft > 0 && isRunning && "المؤقت يعمل..."}
          {timeLeft > 0 && !isRunning && "المؤقت متوقف"}
        </div>
      </CardContent>
    </Card>
  );
};