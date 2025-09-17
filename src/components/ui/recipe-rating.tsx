import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, MessageCircle, ThumbsUp } from "lucide-react";
import { toast } from "sonner";

interface RecipeRatingProps {
  recipeId: string;
  recipeName: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  author: string;
  date: string;
  helpful: number;
}

export const RecipeRating = ({ recipeId, recipeName }: RecipeRatingProps) => {
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [hasUserRated, setHasUserRated] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [recipeId]);

  const loadReviews = () => {
    const storedReviews = localStorage.getItem(`reviews_${recipeId}`);
    if (storedReviews) {
      const reviewsData = JSON.parse(storedReviews);
      setReviews(reviewsData);
      
      // حساب المتوسط
      if (reviewsData.length > 0) {
        const avg = reviewsData.reduce((sum: number, review: Review) => sum + review.rating, 0) / reviewsData.length;
        setAverageRating(Math.round(avg * 10) / 10);
      }
    }

    // فحص إذا كان المستخدم قيم الوصفة من قبل
    const userReview = localStorage.getItem(`user_review_${recipeId}`);
    if (userReview) {
      const review = JSON.parse(userReview);
      setUserRating(review.rating);
      setUserComment(review.comment);
      setHasUserRated(true);
    }
  };

  const submitReview = () => {
    if (userRating === 0) {
      toast.error("برجاء اختيار تقييم أولاً");
      return;
    }

    const newReview: Review = {
      id: Date.now().toString(),
      rating: userRating,
      comment: userComment.trim(),
      author: "أنت",
      date: new Date().toLocaleDateString('ar-EG'),
      helpful: 0
    };

    const updatedReviews = hasUserRated 
      ? reviews.map(review => review.author === "أنت" ? newReview : review)
      : [...reviews, newReview];

    // حفظ المراجعات
    localStorage.setItem(`reviews_${recipeId}`, JSON.stringify(updatedReviews));
    localStorage.setItem(`user_review_${recipeId}`, JSON.stringify({
      rating: userRating,
      comment: userComment
    }));

    setReviews(updatedReviews);
    setHasUserRated(true);

    // حساب المتوسط الجديد
    const avg = updatedReviews.reduce((sum, review) => sum + review.rating, 0) / updatedReviews.length;
    setAverageRating(Math.round(avg * 10) / 10);

    toast.success(hasUserRated ? "تم تحديث تقييمك" : "تم إضافة تقييمك بنجاح");
  };

  const markHelpful = (reviewId: string) => {
    const updatedReviews = reviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    );
    
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${recipeId}`, JSON.stringify(updatedReviews));
    toast.success("شكراً لك!");
  };

  return (
    <div className="space-y-6">
      {/* Average Rating Display */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
            تقييم الوصفة
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {reviews.length > 0 ? (
            <>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-bold text-primary">{averageRating}</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 ${
                        star <= averageRating 
                          ? "text-yellow-500 fill-current" 
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                بناءً على {reviews.length} تقييم
              </p>
            </>
          ) : (
            <p className="text-muted-foreground">لا توجد تقييمات بعد</p>
          )}
        </CardContent>
      </Card>

      {/* User Rating Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {hasUserRated ? "تحديث تقييمك" : "قيم هذه الوصفة"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">
              كيف كانت تجربتك مع {recipeName}؟
            </p>
            <Rating
              value={userRating}
              onChange={setUserRating}
              size="lg"
              className="justify-center"
            />
          </div>

          <Textarea
            placeholder="شاركنا رأيك في الوصفة... (اختياري)"
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
            className="min-h-[100px]"
          />

          <Button 
            onClick={submitReview}
            className="w-full"
            disabled={userRating === 0}
          >
            {hasUserRated ? "تحديث التقييم" : "إضافة التقييم"}
          </Button>
        </CardContent>
      </Card>

      {/* Reviews List */}
      {reviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              آراء المستخدمين ({reviews.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviews.map((review, index) => (
              <div key={review.id}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        {review.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{review.author}</p>
                        <p className="text-xs text-muted-foreground">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating 
                              ? "text-yellow-500 fill-current" 
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {review.comment && (
                    <p className="text-sm text-foreground bg-muted/30 p-3 rounded-lg">
                      {review.comment}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markHelpful(review.id)}
                      className="text-xs text-muted-foreground hover:text-primary"
                      disabled={review.author === "أنت"}
                    >
                      <ThumbsUp className="w-3 h-3 ml-1" />
                      مفيد ({review.helpful})
                    </Button>
                  </div>
                </div>
                
                {index < reviews.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};