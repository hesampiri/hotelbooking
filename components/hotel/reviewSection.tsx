"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { Star, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getReviews, postReview } from "@/features/hotel/queries/hotelApi";

function RatingBar({
  star,
  count,
  total,
}: {
  star: number;
  count: number;
  total: number;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-3 text-right text-muted-foreground">{star}</span>
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-amber-400"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-right text-muted-foreground text-xs">
        {count}
      </span>
    </div>
  );
}

function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}
          className="focus:outline-none"
        >
          <Star
            className={`h-6 w-6 transition-colors ${
              s <= (hover || value)
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewSection() {
  const { id: hotelId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();

  const [formRating, setFormRating] = useState(0);
  const [formComment, setFormComment] = useState("");
  const [formError, setFormError] = useState("");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["reviews", hotelId],
      queryFn: ({ pageParam }) => getReviews({ pageParam, hotelId }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.page + 1 : undefined,
      enabled: !!hotelId,
    });

  const reviews = data?.pages.flatMap((page) => page.reviews) ?? [];
  

  const mutation = useMutation({
    mutationFn: () =>
      postReview(hotelId, { rating: formRating, comment: formComment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", hotelId] });
      setFormRating(0);
      setFormComment("");
      setFormError("");
    },
    onError: (err: Error) => setFormError(err.message),
  });

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (formRating === 0 || !formComment.trim()) {
      setFormError("Please select a rating and write a comment.");
      return;
    }
    mutation.mutate();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-foreground" />
        <h2 className="text-lg font-semibold text-foreground">Guest Reviews</h2>
        <Badge variant="secondary" className="text-xs">
          {data?.pages[0]?.total ?? 0}
        </Badge>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {reviews.length > 0 && (
            <Card className="border">
              <CardContent className="flex flex-col sm:flex-row gap-6 p-4">
                <div className="flex flex-col items-center justify-center gap-1 sm:min-w-25">
                  <span className="text-3xl font-bold text-foreground">
                    {avgRating.toFixed(1)}
                  </span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(avgRating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {data?.pages[0]?.total ?? 0} review
                    {data?.pages[0]?.total !== 1 && "s"}
                  </span>
                </div>

                <Separator
                  orientation="vertical"
                  className="hidden sm:block h-auto"
                />

                <div className="flex-1 space-y-1.5">
                  {distribution.map(({ star, count }) => (
                    <RatingBar
                      key={star}
                      star={star}
                      count={count}
                      total={reviews.length}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            {reviews.map((review) => (
              <Card key={review._id} className="border">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-foreground">
                        {review.user?.name?.charAt(0)?.toUpperCase() ?? "?"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {review.user?.name ?? "Anonymous"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {review.comment}
                  </p>
                </CardContent>
              </Card>
            ))}

            {reviews.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">
                No reviews yet. Be the first to review this hotel!
              </p>
            )}
          </div>

          {hasNextPage && (
            <Button
              className="w-full"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Loading..." : "Show more reviews"}
            </Button>
          )}

          <Separator />

          {session ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-base font-semibold text-foreground">
                Write a Review
              </h3>
              <div className="space-y-1">
                <label className="text-sm text-foreground">Your rating</label>
                <StarRatingInput value={formRating} onChange={setFormRating} />
              </div>
              <div className="space-y-1">
                <label
                  className="text-sm text-foreground"
                  htmlFor="review-comment"
                >
                  Your review
                </label>
                <textarea
                  id="review-comment"
                  rows={4}
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  placeholder="Tell us about your stay..."
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              {formError && (
                <p className="text-sm text-destructive">{formError}</p>
              )}
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Sign in to write a review.
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default ReviewSection;
