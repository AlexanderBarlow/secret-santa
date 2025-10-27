"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/**
 * SnowfallLayer - renders a canvas-based snow layer
 * Props:
 * - count: number of snowflakes
 * - speed: how fast flakes fall
 * - size: base flake size
 * - opacity: flake transparency
 * - zIndex: layer depth
 */
export default function SnowfallLayer({
    count = 50,
    speed = 0.5,
    size = 2,
    opacity = 0.5,
    zIndex = 1,
}) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const flakes = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * size + 1,
            d: Math.random() + speed,
        }));

        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.beginPath();

            for (const f of flakes) {
                ctx.moveTo(f.x, f.y);
                ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
            }

            ctx.fill();
            update();
        };

        const update = () => {
            for (const f of flakes) {
                f.y += f.d;
                if (f.y > height) {
                    f.y = -10;
                    f.x = Math.random() * width;
                }
            }
        };

        const loop = () => {
            draw();
            requestAnimationFrame(loop);
        };

        loop();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [count, speed, size, opacity]);

    return (
        <motion.canvas
            ref={canvasRef}
            className="fixed top-0 left-0 pointer-events-none"
            style={{ zIndex }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
        />
    );
}
