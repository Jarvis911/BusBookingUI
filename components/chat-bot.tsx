"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import {
    MessageCircle,
    X,
    Send,
    Bot,
    User,
    MapPin,
    Calendar,
    CreditCard,
    HelpCircle,
    Loader2
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
    id: string
    type: "bot" | "user"
    content: string
    timestamp: Date
    quickReplies?: string[]
}

// Predefined responses for booking assistance
const botResponses: Record<string, { response: string; quickReplies?: string[] }> = {
    greeting: {
        response: "Xin chào! 👋 Tôi là trợ lý đặt vé xe. Tôi có thể giúp bạn:\n\n• Tìm chuyến xe\n• Hướng dẫn đặt vé\n• Tra cứu thông tin vé\n• Giải đáp thắc mắc\n\nBạn cần hỗ trợ gì?",
        quickReplies: ["Tìm chuyến xe", "Cách đặt vé", "Tra cứu vé", "Thanh toán"]
    },
    search: {
        response: "Để tìm chuyến xe, bạn hãy:\n\n1️⃣ Vào trang chủ hoặc nhấn 'Tìm chuyến'\n2️⃣ Nhập điểm đi và điểm đến\n3️⃣ Chọn ngày khởi hành\n4️⃣ Nhấn 'Tìm chuyến xe'\n\nBạn muốn tìm tuyến nào?",
        quickReplies: ["Hà Nội - Sài Gòn", "Đà Nẵng - Huế", "Trang chủ"]
    },
    booking: {
        response: "Hướng dẫn đặt vé:\n\n1️⃣ Tìm và chọn chuyến xe phù hợp\n2️⃣ Chọn ghế ngồi yêu thích\n3️⃣ Chọn điểm đón và điểm trả\n4️⃣ Điền thông tin hành khách\n5️⃣ Thanh toán qua MoMo\n\nBạn cần hỗ trợ bước nào?",
        quickReplies: ["Chọn ghế", "Điểm đón/trả", "Thanh toán"]
    },
    lookup: {
        response: "Để tra cứu vé đã đặt:\n\n1️⃣ Đăng nhập vào tài khoản\n2️⃣ Vào mục 'Vé của tôi' trên menu\n3️⃣ Xem chi tiết từng vé\n\nHoặc bạn có thể vào trang 'Tra cứu vé' và nhập mã vé.",
        quickReplies: ["Đăng nhập", "Vé của tôi", "Khác"]
    },
    payment: {
        response: "Về thanh toán:\n\n💳 Chúng tôi hỗ trợ thanh toán qua **MoMo**\n\n• Quét mã QR trên ứng dụng MoMo\n• Hoặc nhấn vào link thanh toán\n• Thanh toán an toàn, bảo mật\n\nSau khi thanh toán thành công, vé sẽ được xác nhận ngay!",
        quickReplies: ["Đặt vé ngay", "Câu hỏi khác"]
    },
    seat: {
        response: "Hướng dẫn chọn ghế:\n\n🪑 Ghế màu xanh: Còn trống\n🪑 Ghế màu đỏ: Đã đặt\n\nNhấn vào ghế bạn muốn để chọn. Bạn có thể chọn nhiều ghế cùng lúc nếu đi nhóm.",
        quickReplies: ["Tiếp theo", "Quay lại"]
    },
    pickup: {
        response: "Về điểm đón/trả:\n\n📍 Chọn điểm đón gần bạn nhất từ danh sách\n📍 Chọn điểm trả tại nơi bạn muốn đến\n\nXe sẽ đón bạn đúng giờ tại điểm đã chọn. Hãy có mặt trước 15 phút!",
        quickReplies: ["Đặt vé ngay", "Câu hỏi khác"]
    },
    default: {
        response: "Tôi chưa hiểu rõ câu hỏi của bạn. Bạn có thể hỏi về:\n\n• Tìm chuyến xe\n• Cách đặt vé\n• Tra cứu vé\n• Thanh toán\n\nHoặc chọn một trong các tùy chọn bên dưới:",
        quickReplies: ["Tìm chuyến xe", "Cách đặt vé", "Hỗ trợ"]
    }
}

function getBotResponse(userMessage: string): { response: string; quickReplies?: string[] } {
    const msg = userMessage.toLowerCase()

    if (msg.includes("xin chào") || msg.includes("hello") || msg.includes("hi") || msg.includes("chào")) {
        return botResponses.greeting
    }
    if (msg.includes("tìm") || msg.includes("chuyến") || msg.includes("search") || msg.includes("tuyến")) {
        return botResponses.search
    }
    if (msg.includes("đặt vé") || msg.includes("cách đặt") || msg.includes("booking") || msg.includes("hướng dẫn")) {
        return botResponses.booking
    }
    if (msg.includes("tra cứu") || msg.includes("vé của tôi") || msg.includes("lookup") || msg.includes("kiểm tra")) {
        return botResponses.lookup
    }
    if (msg.includes("thanh toán") || msg.includes("payment") || msg.includes("momo") || msg.includes("trả tiền")) {
        return botResponses.payment
    }
    if (msg.includes("ghế") || msg.includes("seat") || msg.includes("chỗ ngồi")) {
        return botResponses.seat
    }
    if (msg.includes("đón") || msg.includes("trả") || msg.includes("pickup") || msg.includes("điểm")) {
        return botResponses.pickup
    }

    return botResponses.default
}

export function ChatBot() {
    const router = useRouter()
    const [isOpen, setIsOpen] = React.useState(false)
    const [messages, setMessages] = React.useState<Message[]>([])
    const [inputValue, setInputValue] = React.useState("")
    const [isTyping, setIsTyping] = React.useState(false)
    const scrollRef = React.useRef<HTMLDivElement>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)

    // Initialize with greeting when opened
    React.useEffect(() => {
        if (isOpen && messages.length === 0) {
            const greeting = botResponses.greeting
            setMessages([
                {
                    id: "1",
                    type: "bot",
                    content: greeting.response,
                    timestamp: new Date(),
                    quickReplies: greeting.quickReplies
                }
            ])
        }
    }, [isOpen, messages.length])

    // Auto scroll to bottom
    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    // Focus input when opened
    React.useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    const sendMessage = (content: string) => {
        if (!content.trim()) return

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            type: "user",
            content: content.trim(),
            timestamp: new Date()
        }
        setMessages(prev => [...prev, userMessage])
        setInputValue("")
        setIsTyping(true)

        // Simulate bot typing delay
        setTimeout(() => {
            const botResponse = getBotResponse(content)
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: "bot",
                content: botResponse.response,
                timestamp: new Date(),
                quickReplies: botResponse.quickReplies
            }
            setMessages(prev => [...prev, botMessage])
            setIsTyping(false)
        }, 800)
    }

    const handleQuickReply = (reply: string) => {
        // Handle navigation quick replies
        if (reply === "Trang chủ") {
            router.push("/home")
            return
        }
        if (reply === "Vé của tôi" || reply === "Đăng nhập") {
            router.push("/my-bookings")
            return
        }
        if (reply === "Đặt vé ngay") {
            router.push("/home")
            return
        }
        if (reply.includes(" - ")) {
            // Route search like "Hà Nội - Sài Gòn"
            const [origin, destination] = reply.split(" - ")
            router.push(`/search?origin=${origin}&destination=${destination}`)
            return
        }

        sendMessage(reply)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        sendMessage(inputValue)
    }

    return (
        <>
            {/* Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110",
                    isOpen
                        ? "bg-slate-700 hover:bg-slate-800"
                        : "bg-orange-600 hover:bg-orange-700"
                )}
                aria-label={isOpen ? "Đóng chat" : "Mở chat hỗ trợ"}
            >
                {isOpen ? (
                    <X className="h-6 w-6 text-white" />
                ) : (
                    <MessageCircle className="h-6 w-6 text-white" />
                )}
            </button>

            {/* Chat Window */}
            <div
                className={cn(
                    "fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300",
                    isOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 translate-y-4 pointer-events-none"
                )}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                            <Bot className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Trợ lý đặt vé</h3>
                            <p className="text-xs text-white/80">Luôn sẵn sàng hỗ trợ bạn</p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <ScrollArea className="h-[350px] p-4" ref={scrollRef}>
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div key={message.id}>
                                <div
                                    className={cn(
                                        "flex gap-2",
                                        message.type === "user" ? "justify-end" : "justify-start"
                                    )}
                                >
                                    {message.type === "bot" && (
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100">
                                            <Bot className="h-4 w-4 text-orange-600" />
                                        </div>
                                    )}
                                    <div
                                        className={cn(
                                            "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                                            message.type === "user"
                                                ? "bg-orange-600 text-white rounded-br-md"
                                                : "bg-slate-100 text-slate-800 rounded-bl-md"
                                        )}
                                    >
                                        <p className="whitespace-pre-line">{message.content}</p>
                                    </div>
                                    {message.type === "user" && (
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200">
                                            <User className="h-4 w-4 text-slate-600" />
                                        </div>
                                    )}
                                </div>

                                {/* Quick Replies */}
                                {message.type === "bot" && message.quickReplies && (
                                    <div className="mt-3 flex flex-wrap gap-2 pl-10">
                                        {message.quickReplies.map((reply, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleQuickReply(reply)}
                                                className="rounded-full border border-orange-200 bg-white px-3 py-1.5 text-xs font-medium text-orange-600 transition-colors hover:bg-orange-50 hover:border-orange-300"
                                            >
                                                {reply}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex gap-2">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100">
                                    <Bot className="h-4 w-4 text-orange-600" />
                                </div>
                                <div className="flex items-center gap-1 rounded-2xl bg-slate-100 px-4 py-3 rounded-bl-md">
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "0ms" }} />
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "150ms" }} />
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "300ms" }} />
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Input */}
                <form onSubmit={handleSubmit} className="border-t bg-white p-4">
                    <div className="flex gap-2">
                        <Input
                            ref={inputRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Nhập tin nhắn..."
                            className="flex-1 rounded-full border-slate-200 focus-visible:ring-orange-500"
                        />
                        <Button
                            type="submit"
                            size="icon"
                            className="h-10 w-10 shrink-0 rounded-full bg-orange-600 hover:bg-orange-700"
                            disabled={!inputValue.trim()}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </form>
            </div>
        </>
    )
}
