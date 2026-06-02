import { ArrowUpRight } from "lucide-react";

const releases = [
  {
    id: 1,
    title: "AT LAST",
    artist: "TheKitz",
    cover: "/covers/mzm001.jpg",
    description: "...",
    catalog: "MZM 001",
    spotifyUrl: "https://open.spotify.com/intl-es/track/0SVmjEmsUZ2agNGf0u0mxL?si=43ea4f16a5b24cdb"
  },
  {
    id: 2,
    title: "BUTCHER",
    artist: "F3VER",
    cover: "/covers/mzm003.jpg",
    description: "...",
    catalog: "MZM 003",
    spotifyUrl: "https://open.spotify.com/track/YYYY"
  },
  {
    id: 3,
    title: "Velvet",
    artist: "TheKitz",
    cover: "/covers/mzm004.jpg",
    description: "...",
    catalog: "MZM 004",
    spotifyUrl: "https://open.spotify.com/intl-es/track/233BLLzIchjPmD0SQp4nT5?si=1570b54b28cb4feb"
  },
  {
    id: 4,
    title: "VIOLIN CRIES EP",
    artist: "F3VER",
    cover: "/covers/mzm005.jpg",
    description: "...",
    catalog: "MZM 005",
    spotifyUrl: "https://open.spotify.com/intl-es/album/30szBLvnpPxeVMxe0AmdVM?si=fJKQWgImRr6ZuagC1Hbvkw"
  },
];


export default function FeaturedReleases() {
    return (
        <section id="label" className="py-32 border-b border-[var(--line)]">
            <div className="max-w-[var(--max)] mx-auto px-6">
                <div className="flex justify-between items-end mb-16">
                    <div>
                        
                        <h2 className="text-5xl md:text-7xl font-extrabold uppercase leading-[0.85] font-display">
                            LATEST <span className="text-white/50 italic">RELEASES</span>
                        </h2>
                    </div>
                    
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {[...releases].reverse().map((release) => (
                        <div key={release.id} className="group p-8 border border-white/5 bg-white/[0.02] rounded-sm hover:border-white/10 transition-all cursor-crosshair">
                            <a
  href={release.spotifyUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="block mb-6"
>
  <div className="aspect-square overflow-hidden rounded-sm border border-white/10 bg-black">
    <img
      src={release.cover}
      alt={`${release.title} cover`}
      className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
      loading="lazy"
    />
  </div>
</a>


                            <div className="flex justify-between items-start mb-6">
                                <span className="text-[10px] font-black tracking-widest text-white/60 uppercase border border-white/10 px-2 py-1">
                                    {release.catalog}
                                </span>
                                <ArrowUpRight size={16} className="text-white/20 group-hover:text-white transition-colors" />
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-bold text-2xl leading-none uppercase italic mb-1 group-hover:text-glow transition-all">
                                        {release.title}
                                    </h3>
                                    <p className="text-white font-black tracking-[0.2em] text-[11px] uppercase">
                                        {release.artist}
                                    </p>
                                </div>

                                
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
