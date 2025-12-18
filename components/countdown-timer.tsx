"use client";

import * as React from "react";
import { Clock, AlertCircle } from "lucide-react";

interface CountdownTimerProps {
    expiresAt: string;
    onExpire?: () => void;
}

export function CountdownTimer({ expiresAt, onExpire }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = React.useState<number>(0);

    React.useEffect(() => {
        const calculateTimeLeft = () => {
            const expiry = new Date(expiresAt).getTime();
            const now = Date.now();
            return Math.max(0, Math.floor((expiry - now) / 1000));
        };

        setTimeLeft(calculateTimeLeft());

        const interval = setInterval(() => {
            const remaining = calculateTimeLeft();
            setTimeLeft(remaining);

            if (remaining <= 0) {
                clearInterval(interval);
                onExpire?.();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [expiresAt, onExpire]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    if (timeLeft <= 0) {
        return (
            <div className="flex items-center gap-1 text-red-600 text-sm font-medium">
                <AlertCircle className="w-4 h-4" />
                Hết hạn
            </div>
        );
    }

    const isUrgent = timeLeft <= 120; // Less than 2 minutes

    return (
        <div
            className={`flex items-center gap-1 text-sm font-medium ${isUrgent ? "text-red-600 animate-pulse" : "text-orange-600"
                }`}
        >
            <Clock className="w-4 h-4" />
            <span>
                Còn {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
        </div>
    );
}
