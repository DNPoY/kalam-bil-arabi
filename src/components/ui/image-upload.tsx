import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
  preview?: string | null;
  maxSize?: number; // بالميجابايت
  acceptedTypes?: string[];
}

export const ImageUpload = ({ 
  onImageSelect, 
  onImageRemove, 
  preview,
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp']
}: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    // فحص نوع الملف
    if (!acceptedTypes.includes(file.type)) {
      toast.error('نوع الملف غير مدعوم. استخدم JPG, PNG, أو WebP');
      return false;
    }

    // فحص حجم الملف
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`حجم الملف كبير جداً. الحد الأقصى ${maxSize}MB`);
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      onImageSelect(file);
      toast.success('تم اختيار الصورة بنجاح');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {preview ? (
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <img 
                src={preview} 
                alt="معاينة الصورة"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={onImageRemove}
                className="absolute top-2 right-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card
          className={`border-2 border-dashed transition-colors cursor-pointer ${
            isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">اختر صورة للوصفة</h3>
              <p className="text-sm text-muted-foreground mb-4">
                اسحب وأفلت الصورة هنا أو اضغط للاختيار
              </p>
              <Button variant="outline">
                <Upload className="w-4 h-4 ml-2" />
                اختر صورة
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                JPG, PNG, WebP - حتى {maxSize}MB
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
};