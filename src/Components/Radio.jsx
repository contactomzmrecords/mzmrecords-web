import { useEffect } from "react";

export default function Radio() {
    useEffect(() => {
        // Caster.fm embed script loading
        const script = document.createElement("script");
        script.src = "//cdn.cloud.caster.fm//widgets/embed.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Cleanup script if component unmounts
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <section id="radio" className="py-32 border-b border-[var(--line)]">
            <div className="max-w-[var(--max)] mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>

                        <h2 className="text-6xl md:text-8xl font-extrabold uppercase leading-[0.8] mb-10 font-display">
                            MZM <br />
                            <span className="text-white/50 italic">RADIO</span>
                        </h2>

                        <p className="text-[var(--muted)] text-lg mb-12 max-w-md leading-relaxed">
                            Tune in to our live broadcast to experience a curated selection of techno, exclusive sets, and underground sound exploration directly from our label.
                        </p>

                        <div className="space-y-4">
                            <p className="text-[10px] font-black tracking-widest uppercase text-white/20">
                                MZM Records — Official Broadcast
                            </p>
                        </div>
                    </div>

                    <div className="relative">
                        {/* Player Container */}
                        <div className="border border-white/10 bg-white/[0.02] p-8 md:p-12 rounded-sm backdrop-blur-sm relative overflow-hidden group">
                            {/* Scanline effect for player area */}
                            <div className="absolute inset-0 scan-line opacity-5 pointer-events-none" />

                            <div className="relative z-10 flex flex-col items-center justify-center min-h-[200px]">
                                {/* Caster.fm Embed Container */}
                                <div
                                    className="cstrEmbed w-full flex flex-wrap justify-center gap-x-4"
                                    data-type="newStreamPlayer"
                                    data-publicToken="2a0f8678-604d-4310-bebf-504d54f80c74"
                                    data-theme="dark"
                                    data-color="6C2BDD"
                                    data-channelId=""
                                    data-rendered="false"
                                >
                                    <a href="https://www.caster.fm" className="text-[10px] opacity-10 hover:opacity-100 transition-opacity">Shoutcast Hosting</a>
                                    <a href="https://www.caster.fm" className="text-[10px] opacity-10 hover:opacity-100 transition-opacity">Stream Hosting</a>
                                    <a href="https://www.caster.fm" className="text-[10px] opacity-10 hover:opacity-100 transition-opacity">Radio Server Hosting</a>
                                </div>
                            </div>

                            {/* Industrial details */}
                            <div className="absolute top-0 right-0 p-4">
                            
                            </div>
                        </div>

                        {/* Visual background element */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/[0.02] blur-3xl rounded-full -z-10" />
                    </div>
                </div>
            </div>
        </section>
    );
}
