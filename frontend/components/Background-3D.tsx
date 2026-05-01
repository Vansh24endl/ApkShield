"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export default function Background3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  // High-end professional colors
  const isDark = resolvedTheme === "dark";
  const nodeColor = isDark ? "rgba(100, 140, 255, 0.4)" : "rgba(10, 40, 100, 0.2)";
  const lineColor = isDark ? "rgba(100, 140, 255, 0.15)" : "rgba(10, 40, 100, 0.08)";
  const bgColor = isDark ? "#06080e" : "#f8fafc";

  const nodes = useRef<Node[]>([]);
  const mouse = useRef({ x: -1000, y: -1000 });
  const rafId = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    function initNodes() {
      if (!canvas) return;
      const count = Math.max(50, Math.floor((canvas.width * canvas.height) / 18000));
      nodes.current = Array.from({ length: count }, () => ({
        x: rand(0, canvas.width),
        y: rand(0, canvas.height),
        vx: rand(-0.15, 0.15),
        vy: rand(-0.15, 0.15),
        radius: rand(1, 2.5), // Subtle, professional small dots
      }));
    }

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNodes();
    }

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseLeave = () => {
      mouse.current = { x: -1000, y: -1000 };
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    function draw() {
      if (!canvas || !ctx) return;

      // Clear background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update positions
      for (const n of nodes.current) {
        n.x += n.vx;
        n.y += n.vy;

        // Bounce off walls
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      }

      // Draw lines between close nodes
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.current.length; i++) {
        for (let j = i + 1; j < nodes.current.length; j++) {
          const n1 = nodes.current[i];
          const n2 = nodes.current[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const distSq = dx * dx + dy * dy;

          const maxDist = 20000; // Approx 140px
          if (distSq < maxDist) {
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);

            // Fade line out as distance increases
            const opacity = (1 - distSq / maxDist);
            ctx.strokeStyle = isDark
              ? `rgba(100, 150, 255, ${opacity * 0.25})`
              : `rgba(10, 40, 100, ${opacity * 0.15})`;
            ctx.stroke();
          }
        }
      }

      // Draw lines to mouse if close
      for (const n of nodes.current) {
        const dx = n.x - mouse.current.x;
        const dy = n.y - mouse.current.y;
        const distSq = dx * dx + dy * dy;

        const mouseMaxDist = 30000;
        if (distSq < mouseMaxDist) {
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.current.x, mouse.current.y);
          const opacity = (1 - distSq / mouseMaxDist);
          ctx.strokeStyle = isDark
            ? `rgba(120, 180, 255, ${opacity * 0.4})`
            : `rgba(20, 60, 140, ${opacity * 0.25})`;
          ctx.stroke();

          // Slight attraction to mouse
          n.x -= dx * 0.005;
          n.y -= dy * 0.005;
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();
      }

      rafId.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [resolvedTheme, isDark, nodeColor, bgColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: -10,
        pointerEvents: "none",
        display: "block",
      }}
      aria-hidden="true"
    />
  );
}