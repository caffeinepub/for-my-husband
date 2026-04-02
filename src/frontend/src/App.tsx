import { useEffect, useRef, useState } from "react";

/* ─────────────── Music Player ─────────────── */
function MusicPlayer() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [state, setState] = useState<"idle" | "playing" | "muted">("idle");

  const sendCommand = (func: string, args: unknown[] = []) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "*",
    );
  };

  const handleClick = () => {
    if (state === "idle") {
      sendCommand("unMute");
      sendCommand("setVolume", [80]);
      sendCommand("seekTo", [0, true]);
      sendCommand("playVideo");
      setState("playing");
    } else if (state === "playing") {
      sendCommand("mute");
      setState("muted");
    } else {
      sendCommand("unMute");
      sendCommand("setVolume", [80]);
      setState("playing");
    }
  };

  const icon = state === "idle" ? "🎵" : state === "playing" ? "🔊" : "🔇";
  const label =
    state === "idle"
      ? "Tap to play music"
      : state === "playing"
        ? "Mute music"
        : "Unmute music";

  return (
    <>
      <iframe
        ref={iframeRef}
        src="https://www.youtube.com/embed/ACBNT7UG7LY?autoplay=1&mute=1&loop=1&playlist=ACBNT7UG7LY&enablejsapi=1"
        allow="autoplay; encrypted-media"
        title="Background music"
        aria-hidden="true"
        style={{
          position: "fixed",
          width: 1,
          height: 1,
          top: 0,
          left: 0,
          opacity: 0,
          pointerEvents: "none",
          zIndex: -1,
        }}
      />
      <button
        type="button"
        data-ocid="music.toggle"
        onClick={handleClick}
        aria-label={label}
        title={label}
        className={state === "playing" ? "music-btn-pulse" : ""}
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 50,
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "1.5px solid oklch(0.73 0.1 75 / 0.7)",
          background: "rgba(18, 6, 10, 0.72)",
          backdropFilter: "blur(10px)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          boxShadow:
            "0 0 0 1px rgba(200,162,90,0.15), 0 4px 20px rgba(0,0,0,0.45), 0 0 18px rgba(180,80,80,0.18)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform =
            "scale(1.12)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 0 0 2px rgba(200,162,90,0.4), 0 6px 28px rgba(0,0,0,0.5), 0 0 28px rgba(200,162,90,0.25)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 0 0 1px rgba(200,162,90,0.15), 0 4px 20px rgba(0,0,0,0.45), 0 0 18px rgba(180,80,80,0.18)";
        }}
      >
        {icon}
      </button>
    </>
  );
}

/* ─────────────── Floating Petals + Hearts Layer ─────────────── */
const FLOAT_SYMBOLS = [
  "❤️",
  "❤️",
  "❤️",
  "🌸",
  "❤️",
  "✿",
  "❤️",
  "🌸",
  "❤️",
  "✿",
  "❤️",
  "❤️",
  "🌸",
  "❤️",
  "✿",
  "❤️",
  "❤️",
  "🌸",
];

function FloatingHeartsLayer() {
  const hearts = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${5 + ((i * 5.5) % 90)}%`,
    size: `${8 + ((i * 5) % 22)}px`,
    delay: `${(i * 1.3) % 12}s`,
    duration: `${12 + ((i * 2.1) % 10)}s`,
    opacity: 0.18 + (i % 5) * 0.08,
    drift: i % 3 === 0 ? "drift-left" : i % 3 === 1 ? "drift-right" : "",
    symbol: FLOAT_SYMBOLS[i % FLOAT_SYMBOLS.length],
  }));

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        overflow: "hidden",
      }}
    >
      {hearts.map((h) => (
        <span
          key={h.id}
          className={`animate-float-heart ${h.drift}`}
          style={{
            position: "absolute",
            bottom: "-60px",
            left: h.left,
            fontSize: h.size,
            animationDuration: h.duration,
            animationDelay: h.delay,
            opacity: h.opacity,
          }}
        >
          {h.symbol}
        </span>
      ))}
    </div>
  );
}

/* ─────────────── Petal Rain Layer ─────────────── */
const PETAL_DATA = [
  { left: "12%", duration: "22s", delay: "0s", size: 18, id: "p1" },
  { left: "34%", duration: "28s", delay: "4s", size: 14, id: "p2" },
  { left: "58%", duration: "20s", delay: "8s", size: 20, id: "p3" },
  { left: "74%", duration: "25s", delay: "2s", size: 16, id: "p4" },
  { left: "88%", duration: "30s", delay: "6s", size: 12, id: "p5" },
];

function PetalRainLayer() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {PETAL_DATA.map((p) => (
        <span
          key={p.id}
          className="animate-petal-fall"
          style={{
            position: "absolute",
            top: "-40px",
            left: p.left,
            fontSize: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
            opacity: 0.12,
          }}
        >
          🌸
        </span>
      ))}
    </div>
  );
}

/* ─────────────── Sparkle Dots ─────────────── */
function SparkleDots({
  count = 8,
  light = false,
}: { count?: number; light?: boolean }) {
  const dots = Array.from({ length: count }, (_, i) => ({
    id: i,
    top: `${10 + ((i * 13) % 80)}%`,
    left: `${5 + ((i * 11) % 90)}%`,
    delay: `${(i * 0.6) % 3}s`,
    size: `${3 + (i % 4) * 2}px`,
  }));
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {dots.map((d) => (
        <span
          key={d.id}
          className="animate-twinkle"
          style={{
            position: "absolute",
            top: d.top,
            left: d.left,
            width: d.size,
            height: d.size,
            borderRadius: "50%",
            background: light
              ? "rgba(255,255,255,0.95)"
              : "rgba(200,162,90,0.75)",
            animationDuration: "2.5s",
            animationDelay: d.delay,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────── Section Reveal Hook ─────────────── */
function useSectionReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.classList.add("visible");
        }
      },
      { threshold: 0.12 },
    );
    const els = document.querySelectorAll(".section-reveal");
    for (const el of els) observer.observe(el);
    return () => observer.disconnect();
  }, []);
}

/* ─────────────── Gold Divider (Ornate) ─────────────── */
function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-2 my-8">
      <div
        style={{
          width: 80,
          height: 1,
          background:
            "linear-gradient(to right, transparent, oklch(0.73 0.1 75))",
        }}
      />
      <span
        style={{ color: "oklch(0.73 0.1 75)", fontSize: "11px", opacity: 0.65 }}
      >
        ✦
      </span>
      <span style={{ color: "oklch(0.73 0.1 75)", fontSize: "20px" }}>✦</span>
      <span style={{ color: "oklch(0.73 0.1 75)", fontSize: "16px" }}>❤️</span>
      <span style={{ color: "oklch(0.73 0.1 75)", fontSize: "20px" }}>✦</span>
      <span
        style={{ color: "oklch(0.73 0.1 75)", fontSize: "11px", opacity: 0.65 }}
      >
        ✦
      </span>
      <div
        style={{
          width: 80,
          height: 1,
          background:
            "linear-gradient(to left, transparent, oklch(0.73 0.1 75))",
        }}
      />
    </div>
  );
}

const SPARKLE_POSITIONS = [
  { top: "12%", left: "8%", delay: "0s" },
  { top: "20%", right: "10%", delay: "0.8s" },
  { bottom: "15%", left: "15%", delay: "1.5s" },
  { bottom: "10%", right: "8%", delay: "0.4s" },
] as const;

/* ─────────────── Gallery Photos ─────────────── */
const GALLERY_PHOTOS = [
  {
    src: "/assets/3abbd7cc-1198-4e28-accd-813e7449bbb3-019d4b2a-a1f7-7420-bf72-827f0cd5b8b0.jpg",
    caption: "Hamare Pal ❤️",
  },
  {
    src: "/assets/9a0eb21b-3cbc-4be7-b684-9e72c5bed827-019d4b2a-a279-77ad-a965-90622ec506c2.jpg",
    caption: "Khushi ke Lamhe ✨",
  },
  {
    src: "/assets/7b4c7406-6981-4e3f-8c54-5c531b6404a1-019d4b2a-a26f-777c-9667-08d95845d9bb.jpg",
    caption: "Saath Saath 💛",
  },
  {
    src: "/assets/019a8790-f502-44c7-88d3-37dc65c80620-019d4b2a-a2ee-7233-ac60-0f67bf487584.jpg",
    caption: "Dil ki Baatein 🌸",
  },
  {
    src: "/assets/6e6b05c5-6473-4a1f-979c-36d2e6d1897f-019d4b2a-a410-70e8-bb65-58873e283f76.jpg",
    caption: "Yeh Waqt Hamara ❤️",
  },
  {
    src: "/assets/fcb99482-e964-42ed-81d1-b2c417c6b459-019d4b36-5f21-7207-8a6f-279b9bdbc43a.jpg",
    caption: "Hamari Khushi ❤️",
  },
];

const FEATURED_PHOTO = {
  src: "/assets/78e1700f-2069-49fa-b82a-ba42c231b059-019d4b2a-a4df-74e9-88f6-9f02a92eedfa.jpg",
  caption: "Humare Khuwaabon Ka Din ❤️",
};

/* ─────────────── Lightbox ─────────────── */
function Lightbox({
  src,
  caption,
  onClose,
}: { src: string; caption: string; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <dialog
      data-ocid="gallery.modal"
      aria-modal="true"
      aria-label={caption}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(8,3,3,0.95)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        backdropFilter: "blur(10px)",
        animation: "fadeInOverlay 0.25s ease",
      }}
    >
      <button
        type="button"
        aria-label="Close lightbox backdrop"
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          width: "100%",
          height: "100%",
        }}
      />
      <button
        type="button"
        data-ocid="gallery.close_button"
        onClick={onClose}
        style={{
          position: "absolute",
          top: "1.5rem",
          right: "1.5rem",
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,220,180,0.3)",
          borderRadius: "50%",
          width: 44,
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "rgba(255,220,180,0.9)",
          fontSize: 20,
          lineHeight: 1,
          transition: "background 0.2s",
          zIndex: 2,
        }}
        aria-label="Close lightbox"
      >
        ×
      </button>
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "min(90vw, 820px)",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <img
          src={src}
          alt={caption}
          style={{
            maxWidth: "100%",
            maxHeight: "78vh",
            objectFit: "contain",
            borderRadius: 12,
            boxShadow:
              "0 0 0 1px rgba(200,162,90,0.3), 0 20px 80px rgba(0,0,0,0.7)",
          }}
        />
        <p
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
            color: "rgba(255,220,180,0.9)",
            textAlign: "center",
            letterSpacing: "0.05em",
          }}
        >
          {caption}
        </p>
      </div>
    </dialog>
  );
}

/* ─────────────── Polaroid Card ─────────────── */
function PolaroidCard({
  src,
  caption,
  onOpen,
  index,
}: { src: string; caption: string; onOpen: () => void; index: number }) {
  const tilt = index % 2 === 0 ? "rotate(-1.5deg)" : "rotate(1.5deg)";
  return (
    <button
      type="button"
      data-ocid={`gallery.item.${index + 1}`}
      onClick={onOpen}
      style={{
        background: "#faf5ef",
        border: "none",
        borderRadius: 3,
        padding: "10px 10px 32px",
        boxShadow: "0 6px 24px rgba(140,50,60,0.18), 0 2px 6px rgba(0,0,0,0.1)",
        cursor: "pointer",
        transform: tilt,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        width: "100%",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform =
          "scale(1.06) rotate(0deg)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow =
          "0 16px 44px rgba(140,50,60,0.28), 0 4px 12px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = tilt;
        (e.currentTarget as HTMLButtonElement).style.boxShadow =
          "0 6px 24px rgba(140,50,60,0.18), 0 2px 6px rgba(0,0,0,0.1)";
      }}
      aria-label={`Open photo: ${caption}`}
    >
      <img
        src={src}
        alt={caption}
        style={{
          width: "100%",
          aspectRatio: "4/3",
          objectFit: "cover",
          borderRadius: 1,
          display: "block",
        }}
      />
      <p
        style={{
          fontFamily: "'Dancing Script', cursive",
          fontSize: "clamp(0.75rem, 2vw, 0.9rem)",
          color: "oklch(0.35 0.035 20)",
          marginTop: 8,
          letterSpacing: "0.04em",
          lineHeight: 1.2,
        }}
      >
        {caption}
      </p>
    </button>
  );
}

/* ─────────────── MAIN APP ─────────────── */
export default function App() {
  useSectionReveal();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<{
    src: string;
    caption: string;
  } | null>(null);

  const scrollDown = () => {
    document
      .getElementById("love-message")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="bg-outer-gradient min-h-screen"
      style={{ position: "relative" }}
    >
      <MusicPlayer />
      <PetalRainLayer />
      <FloatingHeartsLayer />

      {lightbox && (
        <Lightbox
          src={lightbox.src}
          caption={lightbox.caption}
          onClose={() => setLightbox(null)}
        />
      )}

      {/* ══════════════ 1. HERO ══════════════ */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url('/assets/generated/romantic-hero-bg.dim_1920x1080.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(3px) brightness(0.75)",
            transform: "scale(1.06)",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(20,5,8,0.48) 0%, rgba(40,10,15,0.2) 45%, rgba(90,20,30,0.7) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 38%, rgba(8,2,4,0.75) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "80%",
            height: "45%",
            background:
              "radial-gradient(ellipse at bottom, rgba(200,100,50,0.28) 0%, transparent 70%)",
          }}
        />
        <SparkleDots count={14} light />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            padding: "clamp(1.5rem, 5vw, 2.5rem)",
            maxWidth: 720,
          }}
        >
          <p
            className="animate-breathe"
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: "clamp(1rem, 3vw, 1.4rem)",
              color: "rgba(255,215,195,0.9)",
              marginBottom: "1.2rem",
              letterSpacing: "0.14em",
            }}
          >
            — a little surprise —
          </p>
          <h1
            className="hero-title"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.8rem, 9vw, 6rem)",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              textShadow:
                "0 0 40px rgba(255,180,140,0.45), 0 0 80px rgba(200,100,80,0.25), 0 4px 24px rgba(0,0,0,0.5)",
              marginBottom: "1.4rem",
            }}
          >
            For My Husband ❤️
          </h1>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontSize: "clamp(1.1rem, 3vw, 1.6rem)",
              color: "rgba(255,225,210,0.88)",
              letterSpacing: "0.04em",
              textShadow: "0 2px 12px rgba(0,0,0,0.35)",
            }}
          >
            A little surprise only for you...
          </p>
          <button
            type="button"
            data-ocid="hero.button"
            onClick={scrollDown}
            className="scroll-indicator"
            style={{
              marginTop: "3.5rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              color: "rgba(255,210,195,0.85)",
              marginLeft: "auto",
              marginRight: "auto",
            }}
            aria-label="Scroll down"
          >
            <span
              style={{
                fontSize: 11,
                fontFamily: "'Lato', sans-serif",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              scroll
            </span>
            <svg
              width="20"
              height="26"
              viewBox="0 0 20 26"
              fill="none"
              role="img"
              aria-label="Scroll down arrow"
            >
              <title>Scroll down arrow</title>
              <path
                d="M10 0v20M2 14l8 9 8-9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </section>

      {/* ══════════════ CARD WRAPPER ══════════════ */}
      <div
        ref={scrollRef}
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "0 clamp(0.75rem, 3vw, 1.5rem) 5rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* ── 2. LOVE MESSAGE ── */}
        <section
          id="love-message"
          style={{
            background: "oklch(0.975 0.012 80)",
            borderRadius: 28,
            padding: "clamp(3rem, 7vw, 5rem) clamp(1.5rem, 6vw, 4.5rem)",
            marginTop: "-2.5rem",
            boxShadow:
              "0 12px 60px rgba(140,50,60,0.14), 0 2px 16px rgba(0,0,0,0.07)",
            position: "relative",
            overflow: "hidden",
            textAlign: "center",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "-20px",
              left: "clamp(1rem, 4%, 3rem)",
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(10rem, 22vw, 18rem)",
              lineHeight: 1,
              color: "oklch(0.88 0.04 15 / 0.18)",
              fontWeight: 700,
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            “
          </div>
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 220,
              height: 220,
              borderRadius: "0 28px 0 100%",
              background:
                "radial-gradient(circle, oklch(0.88 0.05 15 / 0.45) 0%, transparent 70%)",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: 170,
              height: 170,
              borderRadius: "0 100% 0 28px",
              background:
                "radial-gradient(circle, oklch(0.88 0.04 15 / 0.3) 0%, transparent 70%)",
            }}
          />
          <SparkleDots count={6} />
          <div className="section-reveal">
            <p
              style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
                color: "oklch(0.73 0.1 75)",
                letterSpacing: "0.12em",
                marginBottom: "0.6rem",
              }}
            >
              — with all my heart —
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 5.5vw, 3.2rem)",
                fontWeight: 800,
                color: "oklch(0.18 0.02 40)",
                marginBottom: "0.5rem",
                letterSpacing: "-0.02em",
              }}
            >
              To My Dearest ❤️
            </h2>
          </div>
          <GoldDivider />
          <div className="section-reveal">
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: "clamp(1.05rem, 2.5vw, 1.3rem)",
                lineHeight: 2.0,
                color: "oklch(0.28 0.025 30)",
                maxWidth: 580,
                margin: "0 auto",
              }}
            >
              Hi meri jan ke toote ❤️ Agar ap yahan tak aa gaye ho to iska matlab
              hai ap mere liye kitne special ho…
            </p>
            <div
              style={{
                marginTop: "1.75rem",
                fontSize: 22,
                letterSpacing: "0.5em",
              }}
              aria-hidden="true"
            >
              ✨ ❤️ ✨
            </div>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: "clamp(1.05rem, 2.5vw, 1.3rem)",
                lineHeight: 2.0,
                color: "oklch(0.28 0.025 30)",
                maxWidth: 580,
                margin: "1.75rem auto 0",
              }}
            >
              3 mahine ho gaye hain shaadi ko, aur har din mujhe apse aur zyada
              pyaar hota hai… Distance mushkil hai lekin apki mohabbat sab asaan
              bana deti hai.
            </p>
          </div>
        </section>

        {/* ── 3. IF I WAS THERE ── */}
        <section
          style={{
            background:
              "linear-gradient(145deg, oklch(0.93 0.032 15) 0%, oklch(0.945 0.025 25) 50%, oklch(0.95 0.018 50) 100%)",
            borderRadius: 28,
            padding: "clamp(3rem, 7vw, 5rem) clamp(1.5rem, 6vw, 4.5rem)",
            marginTop: "2rem",
            boxShadow: "0 12px 60px rgba(180,80,80,0.12)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "-60px",
              right: "-60px",
              width: 320,
              height: 320,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, oklch(0.84 0.06 5 / 0.22) 0%, oklch(0.88 0.05 10 / 0.1) 50%, transparent 75%)",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: "-80px",
              left: "-50px",
              width: 260,
              height: 260,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, oklch(0.82 0.065 10 / 0.18) 0%, transparent 70%)",
            }}
          />
          <SparkleDots count={5} />
          <div className="section-reveal">
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.8rem, 5vw, 2.9rem)",
                fontWeight: 800,
                color: "oklch(0.18 0.02 40)",
                marginBottom: "1.6rem",
                letterSpacing: "-0.02em",
              }}
            >
              Agar Main Paas Hoti... ✨
            </h2>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: "clamp(1.05rem, 2.5vw, 1.3rem)",
                lineHeight: 2.0,
                color: "oklch(0.3 0.03 20)",
                maxWidth: 560,
                margin: "0 auto",
              }}
            >
              Agar main apke paas hoti to… apke saath chai peeti, apko tang
              karti, bina wajah naraz hoti, aur phir khud hi mana leti ❤️
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "clamp(1.5rem, 5vw, 3rem)",
                marginTop: "2.8rem",
              }}
            >
              {[
                { icon: "☕", label: "Chai saath" },
                { icon: "❤️", label: "Pyaar" },
                { icon: "✨", label: "Nok-jhonk" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span
                    className="animate-breathe"
                    style={{
                      fontSize: 40,
                      display: "block",
                      filter: "drop-shadow(0 3px 8px rgba(180,80,80,0.3))",
                    }}
                  >
                    {item.icon}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Lato', sans-serif",
                      fontSize: 11,
                      color: "oklch(0.45 0.045 20)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. MEMORIES ── */}
        <section
          style={{
            background: "oklch(0.975 0.012 80)",
            borderRadius: 28,
            padding: "clamp(3rem, 7vw, 5rem) clamp(1.5rem, 6vw, 4.5rem)",
            marginTop: "2rem",
            boxShadow: "0 12px 60px rgba(140,50,60,0.1)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "-20px",
              right: "clamp(1rem, 4%, 3rem)",
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(8rem, 18vw, 14rem)",
              lineHeight: 1,
              color: "oklch(0.88 0.04 15 / 0.14)",
              fontWeight: 700,
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            ”
          </div>
          <SparkleDots count={4} />
          <div className="section-reveal">
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.8rem, 5vw, 2.9rem)",
                fontWeight: 800,
                color: "oklch(0.18 0.02 40)",
                marginBottom: "0.6rem",
                letterSpacing: "-0.02em",
              }}
            >
              Yaadein ❤️
            </h2>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: "clamp(1.05rem, 2.5vw, 1.25rem)",
                lineHeight: 2.0,
                color: "oklch(0.35 0.025 25)",
                maxWidth: 560,
                margin: "0 auto",
              }}
            >
              Mujhe sab se zyada yaad aata hai… apki awaaz, apki ankhein, aapka
              care karna, aur wo feeling ke ap mere ho ❤️
            </p>
          </div>
        </section>

        {/* ── 4.5 PHOTO GALLERY ── */}
        <section
          style={{
            background:
              "linear-gradient(160deg, oklch(0.965 0.022 60) 0%, oklch(0.975 0.018 30) 50%, oklch(0.965 0.022 60) 100%)",
            borderRadius: 28,
            padding: "clamp(3rem, 7vw, 5rem) clamp(1.5rem, 5vw, 3.5rem)",
            marginTop: "2rem",
            boxShadow: "0 12px 60px rgba(140,50,60,0.1)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <SparkleDots count={6} />
          <div className="section-reveal">
            <p
              style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
                color: "oklch(0.73 0.1 75)",
                letterSpacing: "0.12em",
                marginBottom: "0.5rem",
              }}
            >
              — moments we cherish —
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.8rem, 5vw, 2.9rem)",
                fontWeight: 800,
                color: "oklch(0.18 0.02 40)",
                marginBottom: "0.2rem",
                letterSpacing: "-0.02em",
              }}
            >
              Hamari Yadein 📸
            </h2>
          </div>
          <GoldDivider />

          {/* Featured photo */}
          <div className="section-reveal">
            <button
              type="button"
              data-ocid="gallery.item.6"
              onClick={() => setLightbox(FEATURED_PHOTO)}
              className="featured-photo-btn"
              style={{
                background: "#fff",
                border: "none",
                borderRadius: 10,
                padding: 0,
                cursor: "pointer",
                width: "100%",
                maxWidth: 540,
                margin: "0 auto",
                display: "block",
                transition: "transform 0.35s ease, box-shadow 0.35s ease",
                outline: "3px solid oklch(0.73 0.1 75)",
                outlineOffset: "5px",
                boxShadow:
                  "0 0 0 1px oklch(0.85 0.08 80), 0 0 0 8px rgba(200,162,90,0.12), 0 12px 50px rgba(200,162,90,0.32), 0 4px 20px rgba(140,50,60,0.18), inset 0 0 0 2px rgba(255,240,200,0.3)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "scale(1.02)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 0 1px oklch(0.85 0.08 80), 0 0 0 8px rgba(200,162,90,0.18), 0 20px 70px rgba(200,162,90,0.42), 0 6px 24px rgba(140,50,60,0.22)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "scale(1)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 0 1px oklch(0.85 0.08 80), 0 0 0 8px rgba(200,162,90,0.12), 0 12px 50px rgba(200,162,90,0.32), 0 4px 20px rgba(140,50,60,0.18), inset 0 0 0 2px rgba(255,240,200,0.3)";
              }}
              aria-label={`Open photo: ${FEATURED_PHOTO.caption}`}
            >
              <div
                style={{
                  position: "relative",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <img
                  src={FEATURED_PHOTO.src}
                  alt={FEATURED_PHOTO.caption}
                  style={{
                    width: "100%",
                    aspectRatio: "4/3",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    boxShadow: "inset 0 0 30px rgba(100,40,20,0.2)",
                    borderRadius: 8,
                  }}
                />
              </div>
              <p
                style={{
                  fontFamily: "'Dancing Script', cursive",
                  fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                  color: "oklch(0.35 0.06 20)",
                  margin: "14px 0 16px",
                  letterSpacing: "0.05em",
                  fontWeight: 600,
                }}
              >
                {FEATURED_PHOTO.caption}
              </p>
            </button>
          </div>

          {/* Polaroid grid */}
          <div
            className="section-reveal"
            style={{
              marginTop: "2.5rem",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(180px, 100%), 1fr))",
              gap: "1.5rem",
            }}
          >
            {GALLERY_PHOTOS.map((photo, i) => (
              <PolaroidCard
                key={photo.src}
                src={photo.src}
                caption={photo.caption}
                index={i}
                onOpen={() => setLightbox(photo)}
              />
            ))}
          </div>
          <div
            style={{ marginTop: "2rem", fontSize: 22, letterSpacing: "0.4em" }}
            aria-hidden="true"
          >
            ✨ ❤️ ✨
          </div>
        </section>

        {/* ── 5. FUTURE PROMISE ── */}
        <section
          style={{
            background:
              "linear-gradient(155deg, oklch(0.28 0.065 10) 0%, oklch(0.22 0.055 20) 50%, oklch(0.25 0.07 5) 100%)",
            borderRadius: 28,
            padding: "clamp(3rem, 7vw, 5.5rem) clamp(1.5rem, 6vw, 4.5rem)",
            marginTop: "2rem",
            boxShadow:
              "0 16px 80px rgba(80,10,20,0.4), 0 4px 24px rgba(0,0,0,0.3)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "70%",
              height: "70%",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, oklch(0.55 0.12 20 / 0.18) 0%, oklch(0.40 0.1 15 / 0.1) 50%, transparent 75%)",
              animation: "auraGlow 4s ease-in-out infinite",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background:
                "linear-gradient(90deg, transparent, oklch(0.73 0.1 75 / 0.6), transparent)",
            }}
          />

          {SPARKLE_POSITIONS.map((pos) => (
            <span
              key={pos.delay}
              className="animate-sparkle-float"
              aria-hidden="true"
              style={{
                position: "absolute",
                fontSize: 18,
                color: "oklch(0.73 0.1 75)",
                animationDuration: "3s",
                animationDelay: pos.delay,
                ...pos,
              }}
            >
              ✦
            </span>
          ))}

          <div className="section-reveal">
            <p
              style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                color: "oklch(0.73 0.1 75)",
                letterSpacing: "0.1em",
                marginBottom: "0.6rem",
              }}
            >
              ✦ mera waada ✦
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.8rem, 5vw, 3rem)",
                fontWeight: 800,
                color: "oklch(0.92 0.07 75)",
                marginBottom: "1.6rem",
                letterSpacing: "-0.01em",
                textShadow: "0 0 30px rgba(200,162,90,0.3)",
              }}
            >
              Mera Waada 💛
            </h2>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: "clamp(1.05rem, 2.5vw, 1.3rem)",
                lineHeight: 2.0,
                color: "oklch(0.82 0.04 30)",
                maxWidth: 560,
                margin: "0 auto 2.5rem",
              }}
            >
              Ek din aisa ayega jab yeh distance khatam ho jayega… aur phir main
              apko roz tang karungi 😌❤️ Yeh mera promise hai.
            </p>

            <div style={{ position: "relative", display: "inline-block" }}>
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: "-16px",
                  borderRadius: 999,
                  background:
                    "radial-gradient(ellipse, oklch(0.73 0.1 75 / 0.35) 0%, transparent 70%)",
                  animation: "auraGlow 2.5s ease-in-out infinite",
                  filter: "blur(8px)",
                }}
              />
              <div
                style={{
                  position: "relative",
                  background:
                    "linear-gradient(90deg, oklch(0.62 0.12 72), oklch(0.80 0.10 82), oklch(0.72 0.13 76), oklch(0.80 0.10 82), oklch(0.62 0.12 72))",
                  backgroundSize: "300% auto",
                  animation: "goldShimmer 3.5s linear infinite",
                  borderRadius: 999,
                  padding: "0.85rem 2.5rem",
                  boxShadow:
                    "0 0 0 1px rgba(255,220,120,0.2), 0 6px 28px rgba(200,162,90,0.45)",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Dancing Script', cursive",
                    fontSize: "clamp(1.1rem, 2.8vw, 1.35rem)",
                    color: "oklch(0.12 0.02 30)",
                    fontWeight: 700,
                    letterSpacing: "0.03em",
                  }}
                >
                  Forever Yours ❤️
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer
        style={{
          textAlign: "center",
          padding: "2.5rem 1rem 2rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          aria-hidden="true"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            marginBottom: "0.8rem",
            opacity: 0.45,
          }}
        >
          <div
            style={{ width: 40, height: 1, background: "oklch(0.55 0.04 20)" }}
          />
          <span style={{ fontSize: 12, color: "oklch(0.55 0.07 10)" }}>❤️</span>
          <div
            style={{ width: 40, height: 1, background: "oklch(0.55 0.04 20)" }}
          />
        </div>
        <p
          style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: 13,
            color: "oklch(0.45 0.025 20)",
            letterSpacing: "0.06em",
          }}
        >
          Ashtalha ❤️
        </p>
      </footer>
    </div>
  );
}
