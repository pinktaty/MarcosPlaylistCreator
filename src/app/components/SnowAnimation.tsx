import { useEffect, useRef } from "react";
import Script from "next/script";

const SnowAnimation: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const scriptLoaded = useRef(false);

    useEffect(() => {
        if (scriptLoaded.current && canvasRef.current && (window as any).Starback) {
            new (window as any).Starback(canvasRef.current, {
                type: "dot",
                backgroundColor: "transparent",
                starSize: [0, 0.7],
                randomOpacity: [0, 1],
                speed: [0, 0.5],
                quantity: 180,
                direction: 20,
            });
        }
    }, []);

    return (
        <div>
            <Script
                src="https://unpkg.com/starback@2.1.1/dist/starback.global.js"
                strategy="lazyOnload"
                onLoad={() => {
                    scriptLoaded.current = true;
                    if (canvasRef.current && (window as any).Starback) {
                        new (window as any).Starback(canvasRef.current, {
                            type: "dot",
                            backgroundColor: "transparent",
                            starSize: [0, 0.7],
                            randomOpacity: [0, 1],
                            speed: [0, 0.5],
                            quantity: 180,
                            direction: 20,
                        });
                    }
                }}
            />

            <canvas
                ref={canvasRef}
                id="canvas"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100vh",
                    zIndex: -1,
                }}
            />
        </div>
    );
};

export default SnowAnimation;