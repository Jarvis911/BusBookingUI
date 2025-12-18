"use client";

import * as React from "react";
import Link from "next/link";
import {
    Bus,
    MapPin,
    Clock,
    Calendar,
    Ticket,
    ChevronRight,
    Loader2,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Star,
} from "lucide-react";

// --- Shadcn UI ---
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- Custom Components ---
import { CountdownTimer } from "@/components/countdown-timer";

// --- API & Types ---
import { fetchMyBookings, isLoggedIn } from "@/lib/api";
import { BookingDetail } from "@/lib/types";

export default function MyBookingsPage() {
    const [bookings, setBookings] = React.useState<BookingDetail[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        async function loadBookings() {
            if (!isLoggedIn()) {
                setError("Vui lòng đăng nhập để xem vé của bạn.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await fetchMyBookings();
                setBookings(data);
            } catch (err) {
                console.error("Failed to fetch bookings:", err);
                setError("Không thể tải danh sách vé. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        }
        loadBookings();
    }, []);

    // Filter bookings by status
    const pendingBookings = bookings.filter((b) => b.status === "PENDING");
    const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED");
    const cancelledBookings = bookings.filter((b) => b.status === "CANCELLED" || b.status === "EXPIRED");

    // Format date/time helpers
    const formatDate = (iso: string) => {
        return new Date(iso).toLocaleDateString("vi-VN", {
            weekday: "short",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const formatTime = (iso: string) => {
        return new Date(iso).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Status badge component
    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case "PENDING":
                return (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        <Clock className="w-3 h-3 mr-1" /> Chờ thanh toán
                    </Badge>
                );
            case "CONFIRMED":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Đã xác nhận
                    </Badge>
                );
            case "CANCELLED":
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        <XCircle className="w-3 h-3 mr-1" /> Đã hủy
                    </Badge>
                );
            case "EXPIRED":
                return (
                    <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200">
                        <Clock className="w-3 h-3 mr-1" /> Hết hạn
                    </Badge>
                );
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    // Booking card component
    const BookingCard = ({ booking }: { booking: BookingDetail }) => {
        const { trip, pickup_point, dropoff_point } = booking;

        return (
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                        {/* Bus Image */}
                        <div className="relative w-full md:w-40 h-32 md:h-auto shrink-0">
                            <img
                                src={trip.bus.main_image || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=300"}
                                alt={trip.bus.bus_type}
                                className="h-full w-full object-cover"
                            />
                            <Badge className="absolute top-2 left-2 bg-orange-500">
                                Ghế {booking.seat_number}
                            </Badge>
                        </div>

                        {/* Booking Info */}
                        <div className="flex-1 p-4">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">
                                        {trip.route.origin} → {trip.route.destination}
                                    </h3>
                                    <p className="text-sm text-slate-500">{trip.bus.bus_type}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <StatusBadge status={booking.status} />
                                    {booking.status === "PENDING" && booking.expires_at && (
                                        <CountdownTimer
                                            expiresAt={booking.expires_at}
                                            onExpire={() => window.location.reload()}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Trip Details */}
                            <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Calendar className="w-4 h-4 text-orange-500" />
                                    <span>{formatDate(trip.departure_time)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Clock className="w-4 h-4 text-orange-500" />
                                    <span>{formatTime(trip.departure_time)} - {formatTime(trip.arrival_time)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <MapPin className="w-4 h-4 text-green-500" />
                                    <span className="truncate" title={pickup_point.name}>Đón: {pickup_point.name}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <MapPin className="w-4 h-4 text-red-500" />
                                    <span className="truncate" title={dropoff_point.name}>Trả: {dropoff_point.name}</span>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-3 border-t border-dashed">
                                <div>
                                    <span className="text-sm text-slate-500">Giá vé: </span>
                                    <span className="text-lg font-bold text-orange-600">
                                        {booking.price_paid.toLocaleString()}đ
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    {booking.status === "PENDING" && (
                                        <Link href={`/payment?booking_id=${booking.id}`}>
                                            <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                                                Thanh toán
                                            </Button>
                                        </Link>
                                    )}
                                    {booking.status === "CONFIRMED" && !booking.has_review && (
                                        <Button size="sm" variant="outline" className="text-orange-600 border-orange-200">
                                            <Star className="w-4 h-4 mr-1" /> Đánh giá
                                        </Button>
                                    )}
                                    <Button size="sm" variant="ghost" className="text-slate-500">
                                        Chi tiết <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    // Empty state component
    const EmptyState = ({ message }: { message: string }) => (
        <div className="text-center py-12 bg-slate-50 rounded-xl">
            <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">{message}</p>
            <Link href="/home">
                <Button variant="link" className="text-orange-600 mt-2">
                    Đặt vé ngay
                </Button>
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-8 font-sans">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <Ticket className="w-8 h-8 text-orange-600" />
                            Vé của tôi
                        </h1>
                        <p className="text-slate-500 mt-2">Quản lý các vé xe đã đặt</p>
                    </div>

                    {/* Batch Payment Button */}
                    {pendingBookings.length > 1 && (
                        <Link href={`/payment?booking_ids=${pendingBookings.map(b => b.id).join(',')}`}>
                            <Button className="bg-orange-600 hover:bg-orange-700">
                                Thanh toán tất cả ({pendingBookings.length} vé)
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                        <span className="ml-3 text-slate-600">Đang tải vé của bạn...</span>
                    </div>
                )}

                {/* Error */}
                {error && !loading && (
                    <Card className="border-red-200 bg-red-50">
                        <CardContent className="p-6 text-center">
                            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                            <p className="text-red-600 font-medium">{error}</p>
                            {!isLoggedIn() && (
                                <Link href="/home">
                                    <Button className="mt-4 bg-orange-600 hover:bg-orange-700">
                                        Đăng nhập
                                    </Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Bookings Content */}
                {!loading && !error && (
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="grid w-full grid-cols-4 mb-6">
                            <TabsTrigger value="all">
                                Tất cả ({bookings.length})
                            </TabsTrigger>
                            <TabsTrigger value="pending">
                                Chờ TT ({pendingBookings.length})
                            </TabsTrigger>
                            <TabsTrigger value="confirmed">
                                Đã xác nhận ({confirmedBookings.length})
                            </TabsTrigger>
                            <TabsTrigger value="cancelled">
                                Đã hủy ({cancelledBookings.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="space-y-4">
                            {bookings.length === 0 ? (
                                <EmptyState message="Bạn chưa có vé nào." />
                            ) : (
                                bookings.map((booking) => (
                                    <BookingCard key={booking.id} booking={booking} />
                                ))
                            )}
                        </TabsContent>

                        <TabsContent value="pending" className="space-y-4">
                            {pendingBookings.length === 0 ? (
                                <EmptyState message="Không có vé nào đang chờ thanh toán." />
                            ) : (
                                pendingBookings.map((booking) => (
                                    <BookingCard key={booking.id} booking={booking} />
                                ))
                            )}
                        </TabsContent>

                        <TabsContent value="confirmed" className="space-y-4">
                            {confirmedBookings.length === 0 ? (
                                <EmptyState message="Không có vé nào đã xác nhận." />
                            ) : (
                                confirmedBookings.map((booking) => (
                                    <BookingCard key={booking.id} booking={booking} />
                                ))
                            )}
                        </TabsContent>

                        <TabsContent value="cancelled" className="space-y-4">
                            {cancelledBookings.length === 0 ? (
                                <EmptyState message="Không có vé nào đã hủy." />
                            ) : (
                                cancelledBookings.map((booking) => (
                                    <BookingCard key={booking.id} booking={booking} />
                                ))
                            )}
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </div>
    );
}
