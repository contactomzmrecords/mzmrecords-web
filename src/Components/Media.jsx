const media = [
  {
    id: 1,
    title: "MZM SESSION 001",
    artist: "MELZV",
    cover: "/media/session001.jpg",
    youtubeUrl: "https://youtu.be/cP11i-gw4nE?si=FC8y5cU4hcxl7zJe"
  },

  {
    id: 2,
    title: "FIRE ROOM SESSION 001 x MZM RECORDS",
    artist: "MOMDROWNED",
    cover: "/media/session002.jpeg",
    youtubeUrl: "https://youtu.be/wM0yNG7Ih_8?si=YOedooMdCUOdYyZY"
  }
];

export default function Media() {
  return (
    <section className="py-32">
      <div className="max-w-[var(--max)] mx-auto px-6">
        
        <h1 className="text-6xl font-extrabold uppercase italic mb-16">
          MEDIA
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {media.map((item) => (
            <a
              key={item.id}
              href={item.youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="border border-white/10 p-4 hover:border-white transition"
            >
              <img
                src={item.cover}
                alt={item.title}
                className="w-full aspect-video object-cover mb-4"
              />

              <p className="text-sm text-white/60 mb-2">
                LIVE SESSION - WATCH NOW
              </p>

              <h2 className="text-3xl font-bold italic uppercase">
                {item.title}
              </h2>

              <p className="text-white/70">
                {item.artist}
              </p>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}