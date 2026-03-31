import "./SkinBackground.css";

const particles = [
  { icon: "💧", style: { left: "5%",  animationDuration: "12s", animationDelay: "0s",   fontSize: "1.4rem" } },
  { icon: "🌸", style: { left: "12%", animationDuration: "15s", animationDelay: "2s",   fontSize: "1.8rem" } },
  { icon: "✨", style: { left: "20%", animationDuration: "10s", animationDelay: "1s",   fontSize: "1rem"   } },
  { icon: "🫧", style: { left: "28%", animationDuration: "14s", animationDelay: "3.5s", fontSize: "1.6rem" } },
  { icon: "🌿", style: { left: "36%", animationDuration: "16s", animationDelay: "0.5s", fontSize: "1.5rem" } },
  { icon: "💧", style: { left: "44%", animationDuration: "11s", animationDelay: "4s",   fontSize: "1.2rem" } },
  { icon: "🌸", style: { left: "52%", animationDuration: "13s", animationDelay: "1.5s", fontSize: "2rem"   } },
  { icon: "✨", style: { left: "60%", animationDuration: "9s",  animationDelay: "2.5s", fontSize: "1.1rem" } },
  { icon: "🫧", style: { left: "68%", animationDuration: "17s", animationDelay: "0s",   fontSize: "1.7rem" } },
  { icon: "🌿", style: { left: "76%", animationDuration: "12s", animationDelay: "3s",   fontSize: "1.3rem" } },
  { icon: "💧", style: { left: "84%", animationDuration: "15s", animationDelay: "1s",   fontSize: "1.5rem" } },
  { icon: "✨", style: { left: "92%", animationDuration: "10s", animationDelay: "4.5s", fontSize: "0.9rem" } },
  { icon: "🌸", style: { left: "8%",  animationDuration: "18s", animationDelay: "6s",   fontSize: "1.6rem" } },
  { icon: "🫧", style: { left: "48%", animationDuration: "13s", animationDelay: "5s",   fontSize: "1.4rem" } },
  { icon: "🌿", style: { left: "88%", animationDuration: "16s", animationDelay: "2s",   fontSize: "1.2rem" } },
];

const SkinBackground = () => {
  return (
    <div className="skin-background" aria-hidden="true">
      {particles.map((p, i) => (
        <span key={i} className="skin-particle" style={p.style}>
          {p.icon}
        </span>
      ))}
    </div>
  );
};

export default SkinBackground;
