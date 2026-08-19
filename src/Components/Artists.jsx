import { ArrowUpRight } from "lucide-react";

const artists = [
    {
        id: 1,
        name: "TheKitz",
        image: "https://i.ibb.co/ZRgkLCJq/photo-5152664427155884979-y.jpg",
        spotify: "https://open.spotify.com/artist/1Q5y9r2ecaGazulgY4xxSr?si=y8k_xG_yQAWxBMp6HxHRxA",
        bio: "TheKitz"
    },
    {
        id: 2,
        name: "F3VER",
        image: "https://i.ibb.co/fYvBh7Mv/photo-5152664427155884976-y.jpg",
        spotify: "https://open.spotify.com/artist/2LrncjR6hDR62LtSagx1Df?si=TT1JEUJzQY2L9v0QEYO9rA",
        bio: "F3VER"
    },
    {
        id: 3,
        name: "BARAJASS",
        image: "https://i.ibb.co/k6QM0YXh/photo-4913753607140740505-y.jpg",
        spotify: "https://open.spotify.com/intl-es/artist/6dSJ6XtSqjj8XSQsAPDPiO?si=y7I6vmy3SmmrWejIxDBOcQ",
        bio: "BARAJASS"
    },
];

export default function Artists() {
    return (
        <section id="artists" className="py-32 border-b border-[var(--line)]">
            <div className="max-w-[var(--max)] mx-auto px-6">
                <div className="flex justify-between items-end mb-16">
                    <div>
                        
                        <h2 className="text-5xl md:text-7xl font-extrabold uppercase leading-[0.85] font-display">
                            OUR <span className="text-white/20 italic">ARTISTS</span>
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">
                    {artists.map((artist) => (
                        <div key={artist.id} className="group">
                            <a
                                href={artist.spotify}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                            >
                                <div className="relative aspect-[3/4] overflow-hidden bg-[#0a0a0a] mb-6 border border-white/5 rounded-sm">
                                    <img
                                        src={artist.image}
                                        alt={artist.name}
                                        className="w-full h-full object-cover grayscale opacity-60 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                                    />
                                    {/* Overlay with Bio and Link */}
                                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                        <p className="text-white/80 text-xs leading-relaxed mb-4 font-medium uppercase tracking-widest">
                                            {artist.bio}
                                        </p>
                                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                            <span className="text-[8px] font-black tracking-widest text-white uppercase">View Spotify Profile</span>
                                            <ArrowUpRight size={14} className="text-white" />
                                        </div>
                                    </div>
                                </div>
                            </a>

                            <h3 className="font-bold text-xl md:text-2xl uppercase italic group-hover:text-glow transition-all">
                                {artist.name}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
