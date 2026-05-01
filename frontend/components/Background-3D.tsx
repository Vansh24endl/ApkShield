"use client";

import { useEffect, useRef } from "react";

const WARM_COLORS = [
  "#d65d45", "#e07d5a", "#c4a882",
  "#b8956a", "#e8b86d", "#7bc4b8", "#a8c5a0",
];

const DARK_COLORS = [
  "#00e676", "#00c853", "#1de9b6",
  "#69f0ae", "#b9f6ca", "#00bfa5", "#2e7d32",
];

type ShapeKind = "shield" | "hexagon" | "star" | "diamond" | "triangle" | "circle";

interface Shape {
  x: number; y: number; z: number;
  size: number; kind: ShapeKind;
  color: string; alpha: number;
  rotZ: number; rotX: number; rotY: number;
  rspZ: number; rspX: number; rspY: number;
  fo: number; fs: number;
}

function tracePath(
  ctx: CanvasRenderingContext2D,
  kind: ShapeKind,
  cx: number, cy: number, r: number,
) {
  ctx.beginPath();
  switch (kind) {
    case "shield":
      ctx.moveTo(cx, cy - r);
      ctx.bezierCurveTo(cx + r, cy - r * 0.8, cx + r, cy + r * 0.2, cx, cy + r);
      ctx.bezierCurveTo(cx - r, cy + r * 0.2, cx - r, cy - r * 0.8, cx, cy - r);
      break;
    case "hexagon":
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        i === 0
          ? ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a))
          : ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
      }
      break;
    case "star":
      for (let i = 0; i < 10; i++) {
        const a = (Math.PI / 5) * i - Math.PI / 2;
        const rd = i % 2 === 0 ? r : r * 0.45;
        i === 0
          ? ctx.moveTo(cx + rd * Math.cos(a), cy + rd * Math.sin(a))
          : ctx.lineTo(cx + rd * Math.cos(a), cy + rd * Math.sin(a));
      }
      break;
    case "diamond":
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx + r * 0.6, cy);
      ctx.lineTo(cx, cy + r);
      ctx.lineTo(cx - r * 0.6, cy);
      break;
    case "triangle":
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx + r * 0.866, cy + r * 0.5);
      ctx.lineTo(cx - r * 0.866, cy + r * 0.5);
      break;
    default:
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
  }
  ctx.closePath();
}

interface Props {
  /** "light" = warm cream + terracotta  |  "dark" = black + neon green */
  theme?: "light" | "dark";
}

export default function Background3D({ theme = "light" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse     = useRef({ x: 0.5, y: 0.5 });
  const shapes    = useRef<Shape[]>([]);
  const rafId     = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors = theme === "dark" ? DARK_COLORS : WARM_COLORS;
    const kinds: ShapeKind[] = ["shield","hexagon","star","diamond","triangle","circle"];
    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    function buildShapes(w: number, h: number) {
      const count = Math.max(20, Math.floor((w * h) / 20000));
      shapes.current = Array.from({ length: count }, () => ({
        x: rand(0, w), y: rand(0, h),
        z: rand(0.2, 1.0),
        size: rand(12, 32),
        kind: kinds[Math.floor(Math.random() * kinds.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: rand(0.12, 0.28),
        rotZ: rand(0, Math.PI * 2),
        rotX: rand(0, Math.PI * 2),
        rotY: rand(0, Math.PI * 2),
        rspZ: (Math.random() - 0.5) * 0.007,
        rspX: (Math.random() - 0.5) * 0.009,
        rspY: (Math.random() - 0.5) * 0.009,
        fo: rand(0, Math.PI * 2),
        fs: rand(0.003, 0.008),
      }));
    }

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      buildShapes(canvas.width, canvas.height);
    }

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);

    let tick = 0;
    function draw() {
      tick += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = (mouse.current.x - 0.5) * 2;
      const my = (mouse.current.y - 0.5) * 2;

      for (const s of shapes.current) {
        const fy = Math.sin(tick * s.fs + s.fo) * 7;
        const cx = s.x + mx * s.z * 25;
        const cy = s.y + my * s.z * 25 + fy;

        const skX = Math.sin(tick * s.rspX + s.rotX) * 0.25;
        const skY = Math.cos(tick * s.rspY + s.rotY) * 0.25;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(s.rotZ + tick * s.rspZ);
        ctx.transform(1, skY, skX, 1, 0, 0);
        ctx.globalAlpha = s.alpha;
        ctx.strokeStyle = s.color;
        ctx.fillStyle   = s.color + "1a";
        ctx.lineWidth   = 1.5;
        ctx.translate(-cx, -cy);

        tracePath(ctx, s.kind, cx, cy, s.size);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      rafId.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      "fixed",
        inset:         0,
        width:         "100%",
        height:        "100%",
        zIndex:        -10,
        pointerEvents: "none",
        display:       "block",
      }}
      aria-hidden="true"
    />
  );
}