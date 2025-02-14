"use client";
import { useState } from "react";

export default function Home() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <div className="flex flex-col gap-4 p-6 w-full h-full items-center">
            {[...Array(4)].map((_, i) => (
                <div
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`box border-2 border-hisPurple p-14 rounded-lg shadow-md flex justify-center items-center transition-all w-full cursor-pointer ${
                        activeIndex === i ? "opacity-50" : "opacity-100"
                    }`}>
                    Caja {i}
                </div>
            ))}
        </div>
    );
}