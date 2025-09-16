import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ShoppingListProps {
  ingredients: string[];
  recipeName?: string;
}

export const ShoppingList = ({ ingredients, recipeName }: ShoppingListProps) => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (ingredient: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(ingredient)) {
      newChecked.delete(ingredient);
    } else {
      newChecked.add(ingredient);
    }
    setCheckedItems(newChecked);
  };

  const clearCompleted = () => {
    setCheckedItems(new Set());
    toast.info("تم مسح العناصر المكتملة");
  };

  const shareList = async () => {
    const listText = `قائمة التسوق${recipeName ? ` - ${recipeName}` : ''}:\n\n${
      ingredients.map((item, index) => `${index + 1}. ${item}`).join('\n')
    }`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'قائمة التسوق',
          text: listText,
        });
        toast.success("تم مشاركة القائمة");
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(listText);
        toast.success("تم نسخ القائمة للحافظة");
      }
    } else {
      navigator.clipboard.writeText(listText);
      toast.success("تم نسخ القائمة للحافظة");
    }
  };

  const completedCount = checkedItems.size;
  const totalCount = ingredients.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            قائمة التسوق
            {recipeName && (
              <Badge variant="outline" className="text-xs">
                {recipeName}
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={shareList}>
              <Share2 className="w-4 h-4" />
            </Button>
            {completedCount > 0 && (
              <Button variant="outline" size="sm" onClick={clearCompleted}>
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        {totalCount > 0 && (
          <div className="text-sm text-muted-foreground">
            {completedCount} من {totalCount} مكتمل
          </div>
        )}
      </CardHeader>
      <CardContent>
        {ingredients.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>لا توجد مكونات في القائمة</p>
          </div>
        ) : (
          <div className="space-y-3">
            {ingredients.map((ingredient, index) => {
              const isChecked = checkedItems.has(ingredient);
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    isChecked 
                      ? 'bg-green-50 border-green-200 opacity-75' 
                      : 'bg-background border-border hover:border-primary/20'
                  }`}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => toggleItem(ingredient)}
                  />
                  <span className={`flex-1 ${
                    isChecked ? 'line-through text-muted-foreground' : 'text-foreground'
                  }`}>
                    {ingredient}
                  </span>
                  {isChecked && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      ✓
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        {/* Progress Bar */}
        {totalCount > 0 && (
          <div className="mt-4">
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};