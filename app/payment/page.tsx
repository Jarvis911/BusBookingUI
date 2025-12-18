"use client"

import * as React from "react"
import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CreditCard, QrCode, Smartphone, CheckCircle2, XCircle, ArrowLeft } from "lucide-react"
import { createMoMoPayment, getBookingPayment } from "@/lib/api"
import { Payment } from "@/lib/types"
import Link from "next/link"

function PaymentPageContent() {
    const searchParams = useSearchParams()
    const router = useRouter()

    // Support both single booking_id and multiple booking_ids
    const bookingIdsParam = searchParams.get("booking_ids") || searchParams.get("booking_id")
    const bookingIds = bookingIdsParam ? bookingIdsParam.split(',').map(id => parseInt(id.trim())) : []

    const [loading, setLoading] = React.useState(true)
    const [payment, setPayment] = React.useState<Payment | null>(null)
    const [totalAmount, setTotalAmount] = React.useState(0)
    const [error, setError] = React.useState<string | null>(null)
    const [creatingPayment, setCreatingPayment] = React.useState(false)

    // Check for existing payment or create new one
    React.useEffect(() => {
        async function initPayment() {
            if (bookingIds.length === 0) {
                setError("Không tìm thấy thông tin booking")
                setLoading(false)
                return
            }

            try {
                // Check for existing payment on first booking
                const existingPayment = await getBookingPayment(bookingIds[0])
                setPayment(existingPayment)
                setTotalAmount(existingPayment.amount)
            } catch (err: any) {
                // No existing payment, we'll create one when user clicks pay
                console.log("No existing payment found, will create on demand")
            } finally {
                setLoading(false)
            }
        }

        initPayment()
    }, [bookingIdsParam])

    const handleCreatePayment = async () => {
        if (bookingIds.length === 0) return

        setCreatingPayment(true)
        setError(null)

        try {
            // Create payment for all bookings - backend calculates total amount
            const newPayment = await createMoMoPayment(bookingIds)
            setPayment(newPayment)
            setTotalAmount(newPayment.amount)

            // Redirect to MoMo payment URL
            if (newPayment.pay_url) {
                window.location.href = newPayment.pay_url
            }
        } catch (err: any) {
            console.error("Failed to create payment:", err)
            setError(err.message || "Không thể tạo thanh toán. Vui lòng thử lại.")
        } finally {
            setCreatingPayment(false)
        }
    }

    const handleOpenPayUrl = () => {
        if (payment?.pay_url) {
            window.location.href = payment.pay_url
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
                    <span className="text-slate-600">Đang tải thông tin thanh toán...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="mx-auto max-w-lg px-4">
                <Link href="/search" className="inline-flex items-center text-sm text-slate-500 hover:text-orange-600 mb-6">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Quay lại tìm chuyến
                </Link>

                <Card className="shadow-lg">
                    <CardHeader className="text-center pb-4">
                        <div className="mx-auto w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                                alt="MoMo"
                                className="w-10 h-10 object-contain"
                            />
                        </div>
                        <CardTitle className="text-2xl">Thanh toán MoMo</CardTitle>
                        <CardDescription>
                            Thanh toán an toàn qua ví điện tử MoMo
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                                <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-red-800">Có lỗi xảy ra</p>
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            </div>
                        )}

                        {payment ? (
                            <>
                                {/* Payment Status */}
                                <div className={`p-4 rounded-lg flex items-center gap-3 ${payment.status === 'SUCCESS'
                                    ? 'bg-green-50 border border-green-200'
                                    : payment.status === 'FAILED'
                                        ? 'bg-red-50 border border-red-200'
                                        : 'bg-yellow-50 border border-yellow-200'
                                    }`}>
                                    {payment.status === 'SUCCESS' ? (
                                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                                    ) : payment.status === 'FAILED' ? (
                                        <XCircle className="h-6 w-6 text-red-600" />
                                    ) : (
                                        <Loader2 className="h-6 w-6 text-yellow-600 animate-spin" />
                                    )}
                                    <div>
                                        <p className="font-medium">
                                            {payment.status === 'SUCCESS' && 'Thanh toán thành công!'}
                                            {payment.status === 'FAILED' && 'Thanh toán thất bại'}
                                            {payment.status === 'PENDING' && 'Đang chờ thanh toán'}
                                            {payment.status === 'CANCELLED' && 'Đã hủy'}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            Mã đơn hàng: {payment.order_id}
                                        </p>
                                    </div>
                                </div>

                                {/* Payment Details */}
                                <div className="border rounded-lg p-4 space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Số tiền</span>
                                        <span className="font-bold text-lg text-orange-600">
                                            {payment.amount.toLocaleString()}đ
                                        </span>
                                    </div>
                                    {payment.trans_id && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Mã giao dịch</span>
                                            <span className="font-mono text-sm">{payment.trans_id}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                {payment.status === 'PENDING' && payment.pay_url && (
                                    <div className="space-y-3">
                                        <Button
                                            className="w-full h-12 bg-pink-500 hover:bg-pink-600 text-white"
                                            onClick={handleOpenPayUrl}
                                        >
                                            <Smartphone className="mr-2 h-5 w-5" />
                                            Mở ứng dụng MoMo
                                        </Button>

                                        {payment.qr_code_url && (
                                            <div className="text-center">
                                                <p className="text-sm text-slate-500 mb-3">Hoặc quét mã QR</p>
                                                <div className="inline-block p-4 bg-white border rounded-lg">
                                                    <QrCode className="h-32 w-32 text-slate-300" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {payment.status === 'SUCCESS' && (
                                    <Button className="w-full" asChild>
                                        <Link href="/search">
                                            Tiếp tục đặt vé
                                        </Link>
                                    </Button>
                                )}

                                {payment.status === 'FAILED' && (
                                    <Button
                                        className="w-full bg-orange-600 hover:bg-orange-700"
                                        onClick={handleCreatePayment}
                                        disabled={creatingPayment}
                                    >
                                        {creatingPayment ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Đang tạo...
                                            </>
                                        ) : (
                                            "Thử lại thanh toán"
                                        )}
                                    </Button>
                                )}
                            </>
                        ) : (
                            <>
                                {/* No payment yet - create one */}
                                <div className="text-center py-8">
                                    <CreditCard className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-600 mb-6">
                                        Nhấn nút bên dưới để tiến hành thanh toán qua MoMo
                                    </p>
                                    <Button
                                        className="w-full h-12 bg-pink-500 hover:bg-pink-600 text-white"
                                        onClick={handleCreatePayment}
                                        disabled={creatingPayment || bookingIds.length === 0}
                                    >
                                        {creatingPayment ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Đang tạo thanh toán...
                                            </>
                                        ) : (
                                            <>
                                                <img
                                                    src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                                                    alt="MoMo"
                                                    className="w-5 h-5 mr-2 object-contain"
                                                />
                                                Thanh toán với MoMo
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </>
                        )}

                        <p className="text-xs text-center text-slate-400">
                            Giao dịch được bảo mật bởi MoMo. Chúng tôi không lưu trữ thông tin thanh toán của bạn.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default function PaymentPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
                    <span className="text-slate-600">Đang tải...</span>
                </div>
            </div>
        }>
            <PaymentPageContent />
        </Suspense>
    )
}
