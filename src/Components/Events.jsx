import { Construction } from "lucide-react";

export default function Events() {
    return (
        <section id="events" className="py-32 border-b border-[var(--line)]">
            <div className="max-w-[var(--max)] mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-8">
                    <div className="max-w-xl">
                        
                        <h2 className="text-6xl md:text-8xl font-extrabold uppercase leading-[0.8] font-display mb-6">
                            LIVE <br />
                            <span className="text-white/60 italic">EVENTS</span>
                        </h2>
                    </div>
                </div>

                {/* Under Construction State */}
                <div className="border border-white/10 rounded-sm bg-white/[0.02] py-32 flex flex-col items-center justify-center text-center">
                    <Construction size={48} className="text-white/20 mb-6 animate-pulse" />
                    <h3 className="text-3xl font-extrabold uppercase italic mb-4">coming soon</h3>
                    <p className="text-[var(--muted)] max-w-sm font-medium">
                        There are currently no scheduled dates. Check back soon for our upcoming events.
                    </p>
                </div>
            </div>
        </section>
    );
}
