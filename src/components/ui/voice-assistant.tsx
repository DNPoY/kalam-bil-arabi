import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";

interface VoiceAssistantProps {
  onCommand?: (command: string) => void;
  isListening?: boolean;
}

export const VoiceAssistant = ({ onCommand, isListening = false }: VoiceAssistantProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // تحقق من دعم المتصفح للتعرف على الصوت
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'ar-SA';
      
      recognitionInstance.onstart = () => {
        setIsRecording(true);
        toast.info("استمع... قل أمرك");
      };
      
      recognitionInstance.onresult = (event: any) => {
        const command = event.results[0][0].transcript;
        handleVoiceCommand(command);
        onCommand?.(command);
      };
      
      recognitionInstance.onerror = (event: any) => {
        setIsRecording(false);
        toast.error("حدث خطأ في التعرف على الصوت");
      };
      
      recognitionInstance.onend = () => {
        setIsRecording(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      recognition.start();
    } else {
      toast.error("المتصفح لا يدعم التعرف على الصوت");
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsRecording(false);
  };

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // أوامر صوتية مختلفة
    if (lowerCommand.includes('ابحث عن') || lowerCommand.includes('أريد')) {
      const searchTerm = command.replace(/ابحث عن|أريد/gi, '').trim();
      speak(`جاري البحث عن ${searchTerm}`);
    } else if (lowerCommand.includes('مفضلة') || lowerCommand.includes('المفضلة')) {
      speak("فتح المفضلة");
    } else if (lowerCommand.includes('وصفة عشوائية')) {
      speak("اختيار وصفة عشوائية");
    } else {
      speak("لم أفهم الأمر، حاول مرة أخرى");
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.8;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-xl">🎤</span>
          المساعد الصوتي
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={isRecording ? stopListening : startListening}
            className={`${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-primary hover:bg-primary/90'
            } text-white`}
            size="lg"
          >
            {isRecording ? (
              <>
                <MicOff className="w-5 h-5 ml-2" />
                إيقاف الاستماع
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 ml-2" />
                ابدأ الأمر الصوتي
              </>
            )}
          </Button>

          <Button
            onClick={isSpeaking ? stopSpeaking : () => speak("مرحباً، كيف يمكنني مساعدتك؟")}
            variant="outline"
            size="lg"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-5 h-5 ml-2" />
                إيقاف
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5 ml-2" />
                تجربة الصوت
              </>
            )}
          </Button>
        </div>

        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <h4 className="font-medium text-sm mb-2">أوامر صوتية مفيدة:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• "ابحث عن كشري"</li>
            <li>• "أريد وصفة سهلة"</li>
            <li>• "افتح المفضلة"</li>
            <li>• "وصفة عشوائية"</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};