"use client";

import * as React from "react";
import { Star, Loader2, X, ImagePlus } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createReview } from "@/lib/api";
import { BookingDetail } from "@/lib/types";
import { toast } from "sonner";

interface RatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    booking: BookingDetail | null;
    onSuccess: () => void;
}

export function RatingModal({ isOpen, onClose, booking, onSuccess }: RatingModalProps) {
    const [rating, setRating] = React.useState(0);
    const [hoverRating, setHoverRating] = React.useState(0);
    const [comment, setComment] = React.useState("");
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // Reset form when modal opens/closes
    React.useEffect(() => {
        if (isOpen) {
            setRating(0);
            setHoverRating(0);
            setComment("");
            setError(null);
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!booking) return;

        // Validation
        if (rating === 0) {
            setError("Vui lòng chọn số sao đánh giá");
            return;
        }
        if (!comment.trim()) {
            setError("Vui lòng nhập nhận xét của bạn");
            return;
        }

        setError(null);
        setIsSubmitting(true);

        try {
            await createReview({
                booking: booking.id,
                rating,
                comment: comment.trim(),
            });

            toast.success("Đánh giá thành công!", {
                description: "Cảm ơn bạn đã đánh giá chuyến đi.",
            });

            onSuccess();
            onClose();
        } catch (err: any) {
            console.error("Failed to submit review:", err);
            const errorMessage = err.data?.booking?.[0] || err.message || "Không thể gửi đánh giá. Vui lòng thử lại.";
            setError(errorMessage);
            toast.error("Lỗi", { description: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    const displayRating = hoverRating || rating;

    const getRatingLabel = (stars: number) => {
        switch (stars) {
            case 1: return "Rất tệ";
            case 2: return "Tệ";
            case 3: return "Bình thường";
            case 4: return "Tốt";
            case 5: return "Tuyệt vời";
            default: return "Chọn đánh giá";
        }
    };

    if (!booking) return null;

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent side="bottom" className="h-auto max-h-[90vh] rounded-t-2xl">
                <SheetHeader className="text-center pb-2">
                    <SheetTitle className="text-xl text-slate-900">
                        Đánh giá chuyến đi
                    </SheetTitle>
                    <SheetDescription>
                        <span className="font-medium text-orange-600">
                            {booking.trip.route.origin} → {booking.trip.route.destination}
                        </span>
                        <br />
                        <span className="text-slate-500">
                            {booking.trip.bus.bus_type} • Ghế {booking.seat_number}
                        </span>
                    </SheetDescription>
                </SheetHeader>

                <div className="px-4 py-6 space-y-6">
                    {/* Star Rating */}
                    <div className="text-center">
                        <Label className="text-sm font-medium text-slate-700 mb-3 block">
                            Bạn đánh giá chuyến đi như thế nào?
                        </Label>
                        <div className="flex justify-center gap-2 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-full"
                                >
                                    <Star
                                        className={`w-10 h-10 transition-colors ${star <= displayRating
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "fill-slate-200 text-slate-200"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className={`text-sm font-medium transition-colors ${displayRating > 0 ? "text-orange-600" : "text-slate-400"
                            }`}>
                            {getRatingLabel(displayRating)}
                        </p>
                    </div>

                    {/* Comment */}
                    <div>
                        <Label htmlFor="comment" className="text-sm font-medium text-slate-700 mb-2 block">
                            Nhận xét của bạn
                        </Label>
                        <Textarea
                            id="comment"
                            placeholder="Chia sẻ trải nghiệm của bạn về chuyến đi..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="min-h-[120px] resize-none border-slate-200 focus:border-orange-500 focus:ring-orange-500"
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}
                </div>

                <SheetFooter className="flex-row gap-3 border-t pt-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="flex-1"
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || rating === 0}
                        className="flex-1 bg-orange-600 hover:bg-orange-700"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Đang gửi...
                            </>
                        ) : (
                            "Gửi đánh giá"
                        )}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
