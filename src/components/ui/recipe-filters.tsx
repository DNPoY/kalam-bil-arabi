import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Filter, X } from "lucide-react";

interface RecipeFiltersProps {
  onFiltersChange: (filters: RecipeFilters) => void;
  initialFilters?: RecipeFilters;
}

export interface RecipeFilters {
  categories: string[];
  difficulties: string[];
  maxCookTime: number;
  maxCost: number;
  minServings: number;
  maxServings: number;
  hasAlternatives: boolean;
  quickOnly: boolean;
}

const defaultFilters: RecipeFilters = {
  categories: [],
  difficulties: [],
  maxCookTime: 120,
  maxCost: 200,
  minServings: 1,
  maxServings: 10,
  hasAlternatives: false,
  quickOnly: false
};

export const RecipeFilters = ({ onFiltersChange, initialFilters = defaultFilters }: RecipeFiltersProps) => {
  const [filters, setFilters] = useState<RecipeFilters>(initialFilters);
  const [isExpanded, setIsExpanded] = useState(false);

  const categories = ['محشي', 'شوربة', 'طواجن', 'سهل وسريع', 'تحضير طويل'];
  const difficulties = ['سهل', 'متوسط', 'صعب'];

  const updateFilters = (newFilters: Partial<RecipeFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFiltersChange(updated);
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    updateFilters({ categories: newCategories });
  };

  const toggleDifficulty = (difficulty: string) => {
    const newDifficulties = filters.difficulties.includes(difficulty)
      ? filters.difficulties.filter(d => d !== difficulty)
      : [...filters.difficulties, difficulty];
    updateFilters({ difficulties: newDifficulties });
  };

  const clearAllFilters = () => {
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.difficulties.length > 0) count++;
    if (filters.maxCookTime < 120) count++;
    if (filters.maxCost < 200) count++;
    if (filters.minServings > 1 || filters.maxServings < 10) count++;
    if (filters.hasAlternatives) count++;
    if (filters.quickOnly) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            فلترة متقدمة
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'إخفاء' : 'إظهار'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Categories */}
          <div>
            <Label className="text-sm font-medium mb-3 block">نوع الطبق</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={filters.categories.includes(category) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleCategory(category)}
                  className="text-xs"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Difficulties */}
          <div>
            <Label className="text-sm font-medium mb-3 block">مستوى الصعوبة</Label>
            <div className="flex gap-2">
              {difficulties.map(difficulty => (
                <Button
                  key={difficulty}
                  variant={filters.difficulties.includes(difficulty) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleDifficulty(difficulty)}
                  className="text-xs"
                >
                  {difficulty}
                </Button>
              ))}
            </div>
          </div>

          {/* Cook Time */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              أقصى وقت طبخ: {filters.maxCookTime} دقيقة
            </Label>
            <Slider
              value={[filters.maxCookTime]}
              onValueChange={([value]) => updateFilters({ maxCookTime: value })}
              max={120}
              min={10}
              step={5}
              className="w-full"
            />
          </div>

          {/* Cost */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              أقصى تكلفة: {filters.maxCost} جنيه
            </Label>
            <Slider
              value={[filters.maxCost]}
              onValueChange={([value]) => updateFilters({ maxCost: value })}
              max={200}
              min={10}
              step={10}
              className="w-full"
            />
          </div>

          {/* Servings */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              عدد الأشخاص: {filters.minServings} - {filters.maxServings}
            </Label>
            <Slider
              value={[filters.minServings, filters.maxServings]}
              onValueChange={([min, max]) => updateFilters({ minServings: min, maxServings: max })}
              max={12}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          {/* Special Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="alternatives" className="text-sm font-medium">
                وصفات بها بدائل للمكونات
              </Label>
              <Switch
                id="alternatives"
                checked={filters.hasAlternatives}
                onCheckedChange={(checked) => updateFilters({ hasAlternatives: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="quick" className="text-sm font-medium">
                وصفات سريعة فقط (أقل من 30 دقيقة)
              </Label>
              <Switch
                id="quick"
                checked={filters.quickOnly}
                onCheckedChange={(checked) => updateFilters({ quickOnly: checked })}
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};