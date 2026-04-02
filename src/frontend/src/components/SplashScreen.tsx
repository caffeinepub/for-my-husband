import { useEffect, useState } from "react";

const QUOTE =
  "\u201cDistance is just a test to see how far love can travel.\u201d";

const PETALS = [
  { id: "p1", left: "8%", delay: "0s", duration: "12s", size: "18px" },
  { id: "p2", left: "18%", delay: "2s", duration: "14s", size: "14px" },
  { id: "p3", left: "30%", delay: "4s", duration: "11s", size: "20px" },
  { id: "p4", left: "45%", delay: "1s", duration: "13s", size: "12px" },
  { id: "p5", left: "58%", delay: "3s", duration: "15s", size: "16px" },
  { id: "p6", left: "70%", delay: "0.5s", duration: "10s", size: "22px" },
  { id: "p7", left: "82%", delay: "2.5s", duration: "12s", size: "14px" },
  { id: "p8", left: "92%", delay: "5s", duration: "14s", size: "18px" },
  { id: "p9", left: "25%", delay: "6s", duration: "11s", size: "10px" },
  { id: "p10", left: "75%", delay: "7s", duration: "13s", size: "16px" },
];

export function SplashScreen({ onEnter }: { onEnter: () => void }) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleEnter = () => {
    if (entered) return;
    setEntered(true);
    setFading(true);
    document.body.style.overflow = "";
    setTimeout(() => {
      setVisible(false);
      onEnter();
    }, 900);
  };

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes splashFadeIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes petalFall {
          0%   { transform: translateY(-60px) rotate(0deg);   opacity: 0; }
          10%  { opacity: 0.7; }
          90%  { opacity: 0.5; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        @keyframes heartGlow {
          0%, 100% { filter: drop-shadow(0 0 18px rgba(220,80,100,0.5)); transform: scale(1); }
          50%       { filter: drop-shadow(0 0 36px rgba(220,80,100,0.85)); transform: scale(1.08); }
        }
        @keyframes btnPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(200,162,90,0.45), 0 0 28px rgba(200,162,90,0.18); }
          50%       { box-shadow: 0 0 0 6px rgba(200,162,90,0.12), 0 0 40px rgba(200,162,90,0.28); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .splash-petal {
          position: absolute;
          top: -60px;
          animation: petalFall linear infinite;
          pointer-events: none;
          user-select: none;
        }
        .splash-title {
          background: linear-gradient(120deg, #fff 30%, #f9c8b0 50%, #fff 70%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .splash-btn {
          animation: btnPulse 2.2s ease-in-out infinite;
        }
        .splash-btn:hover {
          background: rgba(200,162,90,0.12) !important;
        }
        .splash-heart {
          animation: heartGlow 3s ease-in-out infinite;
          display: inline-block;
        }
        .splash-fadein-1 { animation: splashFadeIn 1s ease 0.2s both; }
        .splash-fadein-2 { animation: splashFadeIn 1s ease 0.6s both; }
        .splash-fadein-3 { animation: splashFadeIn 1s ease 1.0s both; }
        .splash-fadein-4 { animation: splashFadeIn 1s ease 1.4s both; }
        .splash-fadein-5 { animation: splashFadeIn 1s ease 1.8s both; }
      `}</style>

      <dialog
        aria-label="Welcome splash screen"
        open
        onClick={handleEnter}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleEnter();
        }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(160deg, #1a0a0e 0%, #2d0f18 40%, #1f0c12 70%, #150810 100%)",
          opacity: fading ? 0 : 1,
          transition: "opacity 0.9s ease",
          overflow: "hidden",
          cursor: "pointer",
          border: "none",
          padding: 0,
          margin: 0,
          maxWidth: "none",
          maxHeight: "none",
          width: "100%",
          height: "100%",
        }}
      >
        {/* Ambient glow */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "70vmin",
            height: "70vmin",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(180,40,70,0.25) 0%, rgba(100,20,40,0.12) 50%, transparent 70%)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />

        {/* Falling petals */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          {PETALS.map((p, i) => (
            <span
              key={p.id}
              className="splash-petal"
              style={{
                left: p.left,
                fontSize: p.size,
                animationDuration: p.duration,
                animationDelay: p.delay,
              }}
            >
              {i % 2 === 0 ? "\u2764\uFE0F" : "\uD83C\uDF38"}
            </span>
          ))}
        </div>

        {/* Thin decorative top line */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "1px",
            height: "80px",
            background:
              "linear-gradient(to bottom, transparent, rgba(200,162,90,0.5), transparent)",
            pointerEvents: "none",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            padding: "clamp(1.5rem, 5vw, 3rem) clamp(1rem, 4vw, 2rem)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0",
            maxWidth: "520px",
            width: "100%",
          }}
        >
          {/* Subtitle above */}
          <p
            className="splash-fadein-1"
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: "clamp(0.95rem, 2.8vw, 1.2rem)",
              color: "rgba(200,162,90,0.85)",
              letterSpacing: "0.18em",
              marginBottom: "clamp(1rem, 3vw, 1.6rem)",
            }}
          >
            \u2014\u00a0a surprise just for you\u00a0\u2014
          </p>

          {/* Heart */}
          <div
            className="splash-fadein-2"
            style={{ marginBottom: "clamp(0.6rem, 2vw, 1rem)" }}
          >
            <span
              className="splash-heart"
              style={{ fontSize: "clamp(3rem, 10vw, 5rem)" }}
            >
              \u2764\uFE0F
            </span>
          </div>

          {/* Main title */}
          <h1
            className="splash-title splash-fadein-2"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.4rem, 8vw, 5rem)",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.01em",
              marginBottom: "clamp(1.2rem, 3.5vw, 2rem)",
            }}
          >
            For My Husband
          </h1>

          {/* Thin divider */}
          <div
            className="splash-fadein-3"
            aria-hidden="true"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.8rem",
              marginBottom: "clamp(1rem, 3vw, 1.6rem)",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                flex: 1,
                height: "1px",
                background:
                  "linear-gradient(to right, transparent, rgba(200,162,90,0.4))",
              }}
            />
            <span style={{ color: "rgba(200,162,90,0.7)", fontSize: "0.7rem" }}>
              \u2726
            </span>
            <div
              style={{
                flex: 1,
                height: "1px",
                background:
                  "linear-gradient(to left, transparent, rgba(200,162,90,0.4))",
              }}
            />
          </div>

          {/* Quote */}
          <blockquote
            className="splash-fadein-3"
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: "clamp(0.95rem, 2.8vw, 1.2rem)",
              color: "rgba(255,210,190,0.82)",
              fontStyle: "italic",
              lineHeight: 1.7,
              letterSpacing: "0.02em",
              maxWidth: "380px",
              margin: "0 auto clamp(1.4rem, 4vw, 2.2rem)",
              padding: 0,
              border: "none",
            }}
          >
            {QUOTE}
          </blockquote>

          {/* Enter button */}
          <button
            type="button"
            className="splash-btn splash-fadein-4"
            data-ocid="splash.primary_button"
            onClick={(e) => {
              e.stopPropagation();
              handleEnter();
            }}
            style={{
              background: "transparent",
              border: "1.5px solid rgba(200,162,90,0.65)",
              borderRadius: 999,
              padding: "0.85rem 2.6rem",
              cursor: "pointer",
              fontFamily: "'Dancing Script', cursive",
              fontSize: "clamp(1.1rem, 3vw, 1.35rem)",
              color: "rgba(230,195,140,0.95)",
              letterSpacing: "0.1em",
              backdropFilter: "blur(8px)",
              transition: "background 0.25s",
            }}
          >
            Tap to Enter \u2728
          </button>

          {/* Music hint */}
          <p
            className="splash-fadein-5"
            style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: "clamp(0.7rem, 1.8vw, 0.82rem)",
              color: "rgba(200,162,90,0.5)",
              letterSpacing: "0.12em",
              marginTop: "clamp(0.8rem, 2vw, 1.2rem)",
            }}
          >
            \uD83C\uDFB5\u00a0 Barkha will play softly
          </p>
        </div>

        {/* Thin decorative bottom line */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "1px",
            height: "80px",
            background:
              "linear-gradient(to top, transparent, rgba(200,162,90,0.5), transparent)",
            pointerEvents: "none",
          }}
        />
      </dialog>
    </>
  );
}
