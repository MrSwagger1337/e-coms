"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Target: 2026-02-28 17:00:00 Cairo time (UTC+2)
const TARGET_DATE = new Date("2026-02-28T17:00:00+02:00").getTime();

export function CountdownGuard({ children }: { children: React.ReactNode }) {
    const [now, setNow] = useState<number | null>(null);

    useEffect(() => {
        setNow(Date.now());
        const interval = setInterval(() => {
            setNow(Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (now === null) return null;

    const timeLeft = TARGET_DATE - now;

    if (timeLeft <= 0) {
        return <>{children}</>;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return (
        <div className="min-h-[100dvh] bg-stone-50 flex flex-col items-center justify-center p-4">
            <div className="text-center flex flex-col items-center space-y-8 max-w-2xl w-full">
                <div className="flex justify-center mb-8 relative w-48 h-48 md:w-64 md:h-64">
                    <Image
                        src="/Logo.png"
                        alt="Bulgarian Rose"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl md:text-5xl text-stone-800 tracking-wider font-light">
                        SOFT OPENING
                    </h1>
                    <p className="text-lg md:text-xl text-stone-500 font-light tracking-[0.2em] uppercase">
                        Coming Soon
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-3 md:gap-6 mt-12 w-full">
                    <div className="flex flex-col items-center flex-1 max-w-[100px]">
                        <div className="w-full aspect-square rounded-2xl bg-white shadow-sm flex items-center justify-center border border-stone-100">
                            <span className="text-3xl md:text-4xl font-light text-stone-800 tabular-nums">
                                {String(days).padStart(2, '0')}
                            </span>
                        </div>
                        <span className="text-[10px] md:text-xs text-stone-400 uppercase tracking-widest mt-3 font-medium">Days</span>
                    </div>

                    <div className="flex flex-col items-center flex-1 max-w-[100px]">
                        <div className="w-full aspect-square rounded-2xl bg-white shadow-sm flex items-center justify-center border border-stone-100">
                            <span className="text-3xl md:text-4xl font-light text-stone-800 tabular-nums">
                                {String(hours).padStart(2, '0')}
                            </span>
                        </div>
                        <span className="text-[10px] md:text-xs text-stone-400 uppercase tracking-widest mt-3 font-medium">Hours</span>
                    </div>

                    <div className="flex flex-col items-center flex-1 max-w-[100px]">
                        <div className="w-full aspect-square rounded-2xl bg-white shadow-sm flex items-center justify-center border border-stone-100">
                            <span className="text-3xl md:text-4xl font-light text-stone-800 tabular-nums">
                                {String(minutes).padStart(2, '0')}
                            </span>
                        </div>
                        <span className="text-[10px] md:text-xs text-stone-400 uppercase tracking-widest mt-3 font-medium">Minutes</span>
                    </div>

                    <div className="flex flex-col items-center flex-1 max-w-[100px]">
                        <div className="w-full aspect-square rounded-2xl bg-white shadow-sm flex items-center justify-center border border-stone-100">
                            <span className="text-3xl md:text-4xl font-light text-stone-800 tabular-nums">
                                {String(seconds).padStart(2, '0')}
                            </span>
                        </div>
                        <span className="text-[10px] md:text-xs text-stone-400 uppercase tracking-widest mt-3 font-medium">Seconds</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
