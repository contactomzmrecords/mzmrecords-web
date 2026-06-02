import { ArrowDown } from "lucide-react";
import heroBg from "../assets/hero-bg.jpg";

export default function Hero() {
    return (
        <section id="home" className="relative min-h-[90vh] flex flex-col justify-center border-b border-[var(--line)] overflow-hidden">
            {/* HERO BACKGROUND */}
<div
  className="absolute inset-0 bg-center bg-cover bg-no-repeat"
  style={{
    backgroundImage: `linear-gradient(rgba(0,0,0,0.60), rgba(0,0,0,0.60)), url(${heroBg})`,
  }}
/>

            <div className="max-w-[var(--max)] mx-auto px-6 w-full relative z-10 pt-28">
                <div className="flex flex-col items-center text-center">
                    {/* Kicker */}

                    {/* Título principal */}
                    <h1 className="text-[clamp(48px,12vw,120px)] font-extrabold uppercase mb-6 leading-[0.85] italic font-display text-glow">
                        MZM<br />
                        <span className="text-white/70 not-italic">RECORDS</span>
                    </h1>

                    {/* Subtítulo */}
                    <p className="max-w-[640px] text-[var(--muted)] text-lg md:text-xl leading-relaxed mb-10 font-medium">
                        <span className="text-white/60 not-italic">Independent electronic label, radio & events platform.</span>
                    </p>

                    {/* Botones */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <a
                            href="/radio"
                            className="group relative border border-white bg-white text-black font-black tracking-widest px-10 py-5 rounded-full transition-all hover:bg-transparent hover:text-white"
                        >
                            <span className="relative z-10">MZM RADIO</span>
                        </a>
                        <a
                            href="/label"
                            className="group border border-white/20 bg-transparent text-white/80 font-black tracking-widest px-10 py-5 rounded-full transition-all hover:bg-white/5 hover:text-white hover:border-white/40"
                        >
                            LABEL
                        </a>
                    </div>
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.03] blur-[120px] rounded-full pointer-events-none" />
        </section>
    );
}
