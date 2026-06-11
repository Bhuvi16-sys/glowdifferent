"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";

interface Product3DViewerProps {
  imageUrl: string;
  productName: string;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export default function Product3DViewer({ imageUrl, productName }: Product3DViewerProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [shine, setShine] = useState({ x: 50, y: 25 });

  const updateTilt = (clientX: number, clientY: number) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (clientY - rect.top - rect.height / 2) / (rect.height / 2);
    const rotateY = clamp(x * 20, -20, 20);
    const rotateX = clamp(-y * 20, -20, 20);
    setRotation({ x: rotateX, y: rotateY });
    setShine({ x: clamp(50 - rotateY, 20, 80), y: clamp(25 - rotateX, 20, 80) });
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    updateTilt(event.clientX, event.clientY);
  };

  const reset = () => {
    setRotation({ x: 0, y: 0 });
    setShine({ x: 50, y: 25 });
  };

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.gamma === null || event.beta === null) return;
      const rotateY = clamp((event.gamma / 45) * 20, -20, 20);
      const rotateX = clamp((event.beta / 45) * 20, -20, 20);
      setRotation({ x: rotateX, y: rotateY });
      setShine({ x: clamp(50 - rotateY, 20, 80), y: clamp(25 - rotateX, 20, 80) });
    };

    window.addEventListener("deviceorientation", handleOrientation, true);
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, []);

  return (
    <div className="rounded-[32px] p-1 bg-gradient-to-br from-pink-300/30 via-violet-400/20 to-pink-400/30 shadow-glow">
      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={reset}
        onPointerCancel={reset}
        className="relative overflow-hidden rounded-[28px] bg-white/10 shadow-2xl transition-transform duration-500"
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-500"
          style={{
            background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.35), transparent 45%)`,
          }}
        />
        <div className="relative h-0 pb-[100%]">
          <Image
            src={imageUrl}
            alt={productName}
            fill
            unoptimized={true}
            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&h=600&fit=crop'; }}
            className="object-cover"
          />
        </div>
      </div>
      <p className="mt-4 text-center text-sm text-foreground/70">✦ Move cursor over image to explore</p>
    </div>
  );
}
