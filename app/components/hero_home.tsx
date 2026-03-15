"use client";

import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type TermCls = "dim" | "ok" | "hi" | "warn" | null;

interface TermStep {
  delay: number;
  type: "input" | "output" | "done";
  text?: string;
  cls?: TermCls;
}

interface TermLine {
  id: number;
  prompt: boolean;
  text: string;
  cls: TermCls;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  b: number; // brightness 0-255
  a: number; // base alpha
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SEQUENCE: TermStep[] = [
  {
    delay: 300,
    type: "input",
    text: "git clone https://northernware.ph/new-project.git",
  },
  {
    delay: 900,
    type: "output",
    text: "Cloning into 'new-project'...",
    cls: "dim",
  },
  {
    delay: 1300,
    type: "output",
    text: "remote: Enumerating objects: 2,847, done.",
    cls: "dim",
  },
  {
    delay: 1600,
    type: "output",
    text: "remote: Resolving deltas: 100% (2847/2847), done.",
    cls: "dim",
  },
  { delay: 2100, type: "input", text: "cd new-project && npm install" },
  {
    delay: 2700,
    type: "output",
    text: "⠿ Installing 312 packages...",
    cls: "dim",
  },
  {
    delay: 3100,
    type: "output",
    text: "✓ added 312 packages in 2.4s",
    cls: "ok",
  },
  { delay: 3500, type: "input", text: "npm run deploy:production" },
  {
    delay: 3900,
    type: "output",
    text: "▸ Building optimised bundle...",
    cls: "warn",
  },
  {
    delay: 4200,
    type: "output",
    text: "▸ Bundle size: 84kb gzipped",
    cls: "dim",
  },
  {
    delay: 4500,
    type: "output",
    text: "✓ Deployed → https://yourapp.northernware.ph",
    cls: "hi",
  },
  { delay: 4800, type: "done" },
];

const CLS_COLOR: Record<NonNullable<TermCls>, string> = {
  dim: "#606068",
  ok: "#28c840",
  hi: "#4af0c4",
  warn: "#ffbd2e",
};

// ─── Logo ─────────────────────────────────────────────────────────────────────

function LogoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 981.42 981.42"
      style={{ width: 28, height: 28, opacity: 0.85, flexShrink: 0 }}
    >
      <defs>
        <style>{`.ls1{stroke:#b8b8c0;fill:#b8b8c0;stroke-miterlimit:10}.ls2{stroke:#b8b8c0;fill:none;stroke-miterlimit:10}`}</style>
      </defs>
      <g>
        <g>
          <path
            className="ls1"
            d="M704.63,49.52H276.79a489.85,489.85,0,0,1,427.84,0Z"
          />
          <path
            className="ls1"
            d="M840.78,147.56H140.64q12.45-12.72,25.83-24.51l3-2.62q6.57-5.7,13.34-11.17t13.76-10.72h0q7-5.28,14.21-10.3,10.59-7.38,21.58-14.2h516.7q18.47,11.46,35.81,24.51Q800.41,110.2,815,123.05,828.32,134.83,840.78,147.56Z"
          />
          <path
            className="ls1"
            d="M915.33,245.6H66.09q7.22-12.49,15.15-24.51,8.27-12.54,17.28-24.51Q108,184,118.18,172.07H863.24Q873.47,184,882.9,196.58q9,12,17.28,24.51Q908.1,233.11,915.33,245.6Z"
          />
          <polygon
            className="ls2"
            points="196.58 98.54 196.55 98.54 196.56 98.53 196.57 98.53 196.58 98.54"
          />
          <path
            className="ls1"
            d="M951.77,323.78,931.9,343.65H539.74l-49-49-36.77,36.77-12.25,12.26H22.94q3.9-12.4,8.42-24.51,4.65-12.43,9.93-24.52,5.43-12.44,11.54-24.51H928.59q6.1,12.06,11.54,24.51,5.28,12.09,9.93,24.52Z"
          />
          <path
            className="ls1"
            d="M417.17,368.16l-24.51,24.51-49,49H2.92Q4.15,429.35,6,417.18q1.86-12.36,4.33-24.51,2.51-12.37,5.63-24.51Z"
          />
          <path
            className="ls1"
            d="M319.13,466.2l-24.51,24.51-24.51,24.51L245.6,539.73H2.92q-1.2-12.16-1.81-24.51Q.49,503,.5,490.71t.61-24.51Z"
          />
          <path
            className="ls1"
            d="M221.09,564.24l-73.53,73.53H22.94q-3.81-12.12-7-24.51-3.12-12.13-5.63-24.51Q7.84,576.6,6,564.24Z"
          />
          <path
            className="ls1"
            d="M123.05,662.28,98.53,686.8,60.12,725.21q-3.75-6.88-7.29-13.9-6.11-12.06-11.54-24.51Q36,674.71,31.36,662.28Z"
          />
          <polygon
            className="ls1"
            points="711.31 564.24 699.05 576.5 686.8 588.75 686.79 588.75 637.77 539.73 613.26 515.22 588.75 490.71 564.24 466.2 490.71 392.67 466.2 368.16 478.45 355.9 490.71 343.65 515.22 368.16 539.73 392.67 564.24 417.18 588.75 441.69 662.28 515.22 686.79 539.73 711.3 564.24 711.31 564.24"
          />
          <polygon
            className="ls1"
            points="907.39 368.16 882.88 392.67 858.37 417.18 833.86 441.69 637.78 441.69 588.76 392.67 564.25 368.16 907.39 368.16"
          />
          <polygon
            className="ls1"
            points="809.35 466.2 743.16 532.39 735.82 539.73 711.31 515.22 686.8 490.71 662.29 466.2 809.35 466.2"
          />
          <path
            className="ls1"
            d="M980.92,490.71q0,12.33-.61,24.51t-1.81,24.51q-1.23,12.35-3.06,24.51-1.86,12.36-4.33,24.51-2.5,12.38-5.63,24.51-3.19,12.39-7,24.51-3.9,12.4-8.42,24.51-4.65,12.44-9.93,24.52-5.43,12.44-11.54,24.51-3.52,7-7.29,13.9-2.91,5.34-6,10.61-1.44,2.5-2.93,5Q907.86,748.48,903,756c-.93,1.47-1.88,2.92-2.84,4.37q-3.43,5.2-7,10.3-5,7.2-10.29,14.21h0q-5.25,7-10.74,13.78-4.38,5.43-8.92,10.72c-.74.88-1.5,1.75-2.25,2.62q-9.76,11.25-20.21,21.89Q828.33,846.58,815,858.37q-14.54,12.84-30.08,24.51-17.32,13-35.81,24.51A491.56,491.56,0,0,1,361,963.57q-9.54-2.6-18.92-5.59c-1.62-.51-3.25-1-4.86-1.57q-6.77-2.22-13.44-4.64a489.18,489.18,0,0,1-91.42-44.38q-18.47-11.46-35.81-24.51Q181,871.23,166.47,858.37q-13.36-11.77-25.83-24.51Q129,822,118.18,809.35,108,797.43,98.52,784.84q-9-12-17.28-24.51c-1-1.45-1.91-2.9-2.84-4.37l20.13-20.14L123,711.31l24.52-24.51,24.52-24.52,73.53-73.53,24.51-24.51,24.51-24.51,24.51-24.51,73.53-73.53,24.51-24.51,24.51-24.51L686.8,637.78h0l12.25-12.25,12.26-12.26,24.51-24.51,7.34-7.34,4.91-4.91,36.77-36.77,24.51-24.51,24.51-24.51,24.51-24.51,73.53-73.53,24.51-24.51,7.16-7.16c.66,2.38,1.29,4.76,1.91,7.16q3.12,12.13,5.63,24.51,2.48,12.15,4.33,24.51,1.83,12.17,3.06,24.51,1.2,12.17,1.81,24.51Q980.93,478.38,980.92,490.71Z"
          />
        </g>
      </g>
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HeroHome() {
  const curRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: -9999, y: -9999 });

  const [lines, setLines] = useState<TermLine[]>([]);
  const [typingText, setTypingText] = useState("");
  const [showPrompt, setShowPrompt] = useState(true);
  const [headlineVisible, setHeadline] = useState(false);
  const lineId = useRef(0);

  // ── Cursor ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const move = (e: MouseEvent) => {
      const x = `${e.clientX}px`,
        y = `${e.clientY}px`;
      if (curRef.current) {
        curRef.current.style.left = x;
        curRef.current.style.top = y;
      }
      if (ringRef.current) {
        ringRef.current.style.left = x;
        ringRef.current.style.top = y;
      }
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // ── Canvas particle network ──────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0,
      H = 0;
    let particles: Particle[] = [];
    let rafId = 0;
    let alive = true;

    const makeParticle = (): Particle => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      b: Math.floor(Math.random() * 110 + 55),
      a: Math.random() * 0.45 + 0.25,
    });

    const init = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      particles = Array.from(
        { length: Math.floor((W * H) / 9000) },
        makeParticle,
      );
    };

    const tick = () => {
      if (!alive) return;
      ctx.clearRect(0, 0, W, H);

      const { x: mx, y: my } = mousePos.current;
      const maxDist = 155;

      // Lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p = particles[i],
            q = particles[j];
          const dx = p.x - q.x,
            dy = p.y - q.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < maxDist) {
            const t = 1 - d / maxDist;
            const mp = Math.hypot(mx - p.x, my - p.y);
            const mq = Math.hypot(mx - q.x, my - q.y);
            const boost = Math.max(0, 1 - Math.min(mp, mq) / 160);
            const bri = (p.b + q.b) >> 1;
            // blend toward accent #4af0c4 = rgb(74,240,196) on mouse proximity
            const r = Math.round(bri + (74 - bri) * boost);
            const g = Math.round(bri + (240 - bri) * boost);
            const b2 = Math.round(bri + (196 - bri) * boost);
            ctx.strokeStyle = `rgba(${r},${g},${b2},${t * 0.11 + boost * 0.35})`;
            ctx.lineWidth = t * 0.7 + boost * 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

      // Dots
      for (const p of particles) {
        const md = Math.hypot(mx - p.x, my - p.y);
        const inf = Math.max(0, 1 - md / 200);
        // blend dot colour toward accent on proximity
        const r = Math.round(p.b + (74 - p.b) * inf);
        const g = Math.round(p.b + (240 - p.b) * inf);
        const b2 = Math.round(p.b + (196 - p.b) * inf);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + inf * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b2},${p.a + inf * 0.5})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = W + 10;
        else if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        else if (p.y > H + 10) p.y = -10;
      }

      rafId = requestAnimationFrame(tick);
    };

    const onResize = () => init();
    window.addEventListener("resize", onResize);
    init();
    tick();

    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // ── Terminal sequence ────────────────────────────────────────────────────────
  useEffect(() => {
    let alive = true;
    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    const pushLine = (line: TermLine) => {
      if (!alive) return;
      setLines((p) => [...p, line]);
    };

    const typeInput = async (text: string) => {
      setShowPrompt(true);
      setTypingText("");
      for (let i = 0; i <= text.length; i++) {
        if (!alive) return;
        setTypingText(text.slice(0, i));
        await sleep(28);
      }
    };

    const run = async () => {
      for (let i = 0; i < SEQUENCE.length; i++) {
        if (!alive) return;
        const step = SEQUENCE[i];
        const wait = i === 0 ? step.delay : step.delay - SEQUENCE[i - 1].delay;
        await sleep(wait);
        if (!alive) return;

        if (step.type === "done") {
          setShowPrompt(false);
          setTypingText("");
          setHeadline(true);
          return;
        }
        if (step.type === "input") {
          await typeInput(step.text!);
          pushLine({
            id: lineId.current++,
            prompt: true,
            text: step.text!,
            cls: null,
          });
          setTypingText("");
          setShowPrompt(false);
        } else {
          setShowPrompt(false);
          pushLine({
            id: lineId.current++,
            prompt: false,
            text: step.text!,
            cls: step.cls ?? null,
          });
        }
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, []);

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Custom cursor ── */}
      <div
        ref={curRef}
        aria-hidden
        style={{
          position: "fixed",
          zIndex: 9999,
          pointerEvents: "none",
          width: 2,
          height: 18,
          background: "#4af0c4",
          transform: "translate(-50%,-50%)",
          mixBlendMode: "screen",
        }}
      />
      <div
        ref={ringRef}
        aria-hidden
        style={{
          position: "fixed",
          zIndex: 9998,
          pointerEvents: "none",
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1px solid rgba(74,240,196,0.25)",
          transform: "translate(-50%,-50%)",
          transition:
            "left 0.18s cubic-bezier(0.17,0.67,0.35,1.2), top 0.18s cubic-bezier(0.17,0.67,0.35,1.2)",
        }}
      />

      {/* ── Page background ── */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background: "#060608",
        }}
      />

      {/* ── Particle network canvas ── */}
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          display: "block",
        }}
      />

      {/* ── Vignette ── */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background: `
          radial-gradient(ellipse at 50% 50%, transparent 25%, rgba(6,6,8,0.96) 100%),
          linear-gradient(to right, rgba(6,6,8,0.8) 0%, transparent 12%),
          linear-gradient(to left,  rgba(6,6,8,0.8) 0%, transparent 12%)
        `,
        }}
      />

      {/* ── Ghost brand stamp ── */}
      <div
        aria-hidden
        className="nw-fade-in"
        style={{
          position: "fixed",
          bottom: "-0.1em",
          right: "-0.05em",
          zIndex: 15,
          pointerEvents: "none",
          userSelect: "none",
          fontFamily: "var(--font-syne)",
          fontWeight: 800,
          fontSize: "clamp(80px,12vw,190px)",
          letterSpacing: "-0.04em",
          whiteSpace: "nowrap",
          color: "transparent",
          WebkitTextStroke: "1px rgba(255,255,255,0.05)",
          animationDelay: "4.2s",
          opacity: 0,
        }}
      >
        nw
        <span style={{ WebkitTextStroke: "1px rgba(74,240,196,0.1)" }}>
          .ph
        </span>
      </div>

      {/* ── Nav ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "22px 56px",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <LogoIcon />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.08em",
              color: "#b8b8c0",
            }}
          >
            northernware<span style={{ color: "#4af0c4" }}>.ph</span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 44 }}>
          <ul
            style={{
              display: "flex",
              gap: 36,
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            {["Services", "Work", "Stack", "About"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#606068",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#f0f0f0")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#606068")
                  }
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
          <button
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#4af0c4",
              border: "1px solid rgba(74,240,196,0.35)",
              padding: "8px 18px",
              background: "transparent",
              cursor: "none",
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#4af0c4";
              e.currentTarget.style.color = "#060608";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#4af0c4";
            }}
          >
            Start Project
          </button>
        </div>
      </nav>

      {/* ── Hero section ── */}
      <section
        style={{
          position: "relative",
          zIndex: 10,
          width: "100vw",
          height: "100vh",
          display: "grid",
          gridTemplateRows: "1fr auto",
          padding: "0 56px",
          background: "transparent",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingTop: 80,
          }}
        >
          {/* Terminal */}
          <div
            className="nw-fade-in"
            style={{
              width: "100%",
              maxWidth: 760,
              border: "1px solid #282830",
              borderRadius: 6,
              overflow: "hidden",
              boxShadow:
                "0 0 80px rgba(74,240,196,0.04), 0 24px 80px rgba(0,0,0,0.6)",
              animationDelay: "0.2s",
              opacity: 0,
            }}
          >
            {/* Title bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 16px",
                background: "#0c0c0f",
                borderBottom: "1px solid #282830",
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#ff5f57",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#ffbd2e",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#28c840",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  color: "#606068",
                }}
              >
                northernware — bash — 132×38
              </span>
            </div>

            {/* Body */}
            <div
              style={{
                background: "rgba(6,6,8,0.95)",
                padding: "22px 24px",
                minHeight: 210,
                fontFamily: "var(--font-mono)",
                fontSize: 12.5,
                lineHeight: 1.85,
                color: "#b8b8c0",
              }}
            >
              {lines.map((line) => (
                <div key={line.id} style={{ display: "flex", gap: 10 }}>
                  {line.prompt && (
                    <span style={{ color: "#4af0c4", flexShrink: 0 }}>›</span>
                  )}
                  <span
                    style={{
                      color: line.cls ? CLS_COLOR[line.cls] : "#b8b8c0",
                    }}
                  >
                    {line.text}
                  </span>
                </div>
              ))}
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                {showPrompt && (
                  <span style={{ color: "#4af0c4", flexShrink: 0 }}>›</span>
                )}
                <span style={{ color: "#b8b8c0" }}>{typingText}</span>
                <span
                  className="nw-blink"
                  style={{
                    display: "inline-block",
                    verticalAlign: "middle",
                    marginLeft: 2,
                    width: 7,
                    height: 14,
                    background: "#4af0c4",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Headline */}
          <div
            style={{
              marginTop: 52,
              opacity: headlineVisible ? 1 : 0,
              transform: headlineVisible ? "translateY(0)" : "translateY(24px)",
              transition:
                "opacity 0.9s, transform 0.9s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <h1
              style={{
                fontFamily: "var(--font-syne)",
                fontWeight: 800,
                fontSize: "clamp(52px,7vw,102px)",
                lineHeight: 0.92,
                letterSpacing: "-0.035em",
                color: "#f0f0f0",
                margin: 0,
              }}
            >
              Code that
              <br />
              <span
                style={{
                  color: "transparent",
                  WebkitTextStroke: "1.5px rgba(240,240,240,0.18)",
                }}
              >
                ships.
              </span>{" "}
              Systems
              <br />
              that <span style={{ color: "#4af0c4" }}>endure.</span>
            </h1>

            <div
              style={{
                marginTop: 28,
                display: "flex",
                alignItems: "flex-end",
                gap: 52,
                flexWrap: "wrap",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  lineHeight: 2,
                  color: "#606068",
                  maxWidth: 360,
                  margin: 0,
                }}
              >
                Full-stack engineering from Manila to the world.
                <br />
                We architect, build, and scale the software
                <br />
                your business runs on.
              </p>
              <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                <button
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#060608",
                    background: "#f0f0f0",
                    padding: "13px 32px",
                    border: "none",
                    cursor: "none",
                    transition: "background 0.25s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#4af0c4")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#f0f0f0")
                  }
                >
                  View Our Work
                </button>
                <button
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#606068",
                    background: "transparent",
                    border: "1px solid #282830",
                    padding: "13px 32px",
                    cursor: "none",
                    transition: "color 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#f0f0f0";
                    e.currentTarget.style.borderColor = "#606068";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#606068";
                    e.currentTarget.style.borderColor = "#282830";
                  }}
                >
                  Let&apos;s Talk
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div
          className="nw-fade-in"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            padding: "14px 0",
            animationDelay: "4.8s",
            opacity: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#606068",
              }}
            >
              <span
                className="nw-status-pulse"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#28c840",
                  boxShadow: "0 0 6px #28c840",
                  display: "inline-block",
                }}
              />
              All systems operational
            </div>
            {[
              "80+ projects shipped",
              "6 yrs experience",
              "99.9% uptime SLA",
            ].map((s) => (
              <span
                key={s}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#606068",
                }}
              >
                · {s}
              </span>
            ))}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.1em",
              color: "#606068",
            }}
          >
            <span style={{ color: "#4af0c4" }}>v3.2.1</span> / northernware.ph
          </div>
        </div>
      </section>
    </>
  );
}
