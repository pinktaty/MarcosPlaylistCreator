"use client"; // Necesario para Next.js App Router
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const StarsAnimation: React.FC = () => {
    const starsRef = useRef<(HTMLDivElement | null)[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // This is so hydration error won't appear because of generated html in the server
        // is different from generated html in client side because on Math.random()
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;

        // Animate each star
        starsRef.current.forEach((star, index) => {
            if (!star) return;

            // Randomize animation properties
            const scale = 0.05 + Math.random() * 0.9;
            const duration = 1 + Math.random() * 2;
            const delay = Math.random() * 5;

            gsap.to(star, {
                scale,
                duration,
                repeat: -1, // Repeat indefinitely
                yoyo: true, // Return to the original size
                ease: "power2.inOut", // Smooth easing
                delay,
            });
        });
    }, [isClient]); // Executed after component is mounted on the client side

    if (!isClient) {
        return null; // Avoid renderizing on server
    }

    return (
        <div
            style={{
                position: "fixed", // Fixed position to cover the entire viewport
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: -1, // Ensure stars are in the background
                pointerEvents: "none", // Make stars non-interactive
                overflow: "hidden", // Prevent stars from overflowing
            }}
        >
            {Array.from({ length: 20 }).map((_, index) => (
                <div
                    key={index}
                    ref={(el) => {
                        starsRef.current[index] = el;
                    }}
                    style={{
                        position: "absolute",
                        top: `${Math.random() * 84}%`,
                        left: `${Math.random() * 89}%`,
                        width: `${10 + Math.random() * 9}px`,
                        height: `${10 + Math.random() * 9}px`,
                        backgroundImage: "url('/star.svg')",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        transform: `scale(1) rotate(${Math.random() * 360}deg)`,
                    }}
                />
            ))}
        </div>
    );
};

export default StarsAnimation;
