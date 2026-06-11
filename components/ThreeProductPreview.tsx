"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeProductPreviewProps {
  imageUrl: string;
  color?: string;
}

export default function ThreeProductPreview({
  imageUrl,
  color = "#FF2D8A",
}: ThreeProductPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfafafa);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const geometry = new THREE.CylinderGeometry(0.8, 0.8, 2, 32);
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = "anonymous";

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      metalness: 0.3,
      roughness: 0.4,
    });

    textureLoader.load(imageUrl, (texture) => {
      material.map = texture;
      material.needsUpdate = true;
    });

    const product = new THREE.Mesh(geometry, material);
    scene.add(product);

    const capGeometry = new THREE.CylinderGeometry(0.82, 0.82, 0.15, 32);
    const capMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.6,
      roughness: 0.2,
    });
    const cap = new THREE.Mesh(capGeometry, capMaterial);
    cap.position.y = 1.075;
    scene.add(cap);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xff2d8a, 0.5);
    pointLight.position.set(-3, 2, 2);
    scene.add(pointLight);

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (!pausedRef.current) {
        product.rotation.y += 0.008;
        cap.rotation.y += 0.008;
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    const onMouseEnter = () => {
      pausedRef.current = true;
    };
    const onMouseLeave = () => {
      pausedRef.current = false;
    };
    container.addEventListener("mouseenter", onMouseEnter);
    container.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mouseenter", onMouseEnter);
      container.removeEventListener("mouseleave", onMouseLeave);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      capGeometry.dispose();
      capMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [imageUrl, color]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full rounded-2xl bg-gradient-mesh"
      aria-label="3D product preview"
    />
  );
}
