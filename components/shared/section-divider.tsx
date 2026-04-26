interface SectionDividerProps {
  flip?: boolean;
  variant?: "wave" | "curve" | "peak";
  fromColor?: string;
  toColor?: string;
}




const SectionDivider = ({ flip = false, variant = "wave", fromColor, toColor }: SectionDividerProps) => {
  const paths: Record<string, string> = {
    wave: "M0,64 C320,120 640,0 960,64 C1280,128 1440,32 1440,32 L1440,0 L0,0 Z",
    curve: "M0,0 L0,40 Q360,120 720,40 Q1080,-40 1440,40 L1440,0 Z",
    peak: "M0,0 L0,48 C240,96 480,16 720,64 C960,112 1200,32 1440,80 L1440,0 Z",
  };

  return (
    <div className={`relative w-full overflow-hidden leading-[0] ${flip ? "rotate-180" : ""}`} style={{ marginTop: "-1px", marginBottom: "-1px" }}>
      <svg
        viewBox="0 0 1440 128"
        preserveAspectRatio="none"
        className="relative block w-full"
        style={{ height: "clamp(48px, 6vw, 96px)" }}
      >
        <defs>
          <linearGradient id={`divider-grad-${variant}-${flip}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.08" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        {/* Subtle gradient fill behind */}
        <path d={paths[variant]} fill={`url(#divider-grad-${variant}-${flip})`} />
        {/* Main shape fill matching target section */}
        <path
          d={paths[variant]}
          className={toColor || "fill-background"}
          style={{ opacity: 0.97 }}
        />
        {/* Accent line on top of the wave */}
        <path
          d={paths[variant]}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          strokeOpacity="0.15"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* Dot accent */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-2 w-2 rounded-full bg-primary/20 animate-pulse-glow" />
      </div>
    </div>
  );
};

export default SectionDivider;