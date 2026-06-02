import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Topbar from "./Components/Topbar";
import Hero from "./Components/Hero";
import FeaturedReleases from "./Components/FeaturedReleases";
import Artists from "./Components/Artists";
import Radio from "./Components/Radio";
import Events from "./Components/Events";
import Footer from "./Components/Footer";
import Media from "./Components/Media";

export default function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col">
      <div className="noise-overlay" />
      <Topbar />

      <main className="flex-1">
        <Routes>
          {/* Home Page: Only Hero Section */}
          <Route path="/" element={<Hero />} />

          {/* Dedicated Pages */}
          <Route path="/label" element={<FeaturedReleases />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/radio" element={<Radio />} />
          <Route path="/events" element={<Events />} />
          <Route path="/media" element={<Media />} />

          <Route path="/about" element={
            <section className="py-32 border-b border-[var(--line)]">
              <div className="max-w-[var(--max)] mx-auto px-6">
                <h2 className="text-5xl md:text-7xl font-extrabold uppercase italic mb-8">About  <span className="text-white/50 italic">US</span></h2>
                <p className="text-white/60 max-w-2xl text-lg leading-relaxed">
                  MZM Records was founded in Nicaragua with the vision of establishing itself as one of the leading forces within the country’s electronic music and events scene, covering genres such as hard techno, techno, and experimental music, with a broad and diverse sonic repertoire.

With the launch of MZM Records, our organization takes a significant step forward in the expansion and reach of the genre, both locally and regionally. At MZM Records, we recognize a notable lack of record labels offering platforms as comprehensive and multidimensional as ours within the techno landscape, integrating music releases, radio, events, and showcases under a unified identity.

“With this step, our goal is to become a valuable asset for artists who align with the vision of the label,” states Ilyar Muñoz, the driving force behind MZM Records.

Working closely with emerging talent, the creation of MZM Records allows us to provide stronger support by presenting their music to an ever-growing audience. Our commitment lies in nurturing, developing, and promoting young talent, and this new chapter enables us to amplify their presence within the electronic music industry.

MZM Records is more than a label — it is a platform dedicated to electronic culture, artistic growth, and the development of a strong and sustainable scene.
                </p>
              </div>
            </section>
          } />

          <Route path="/contact" element={
            <section className="py-32">
              <div className="max-w-[var(--max)] mx-auto px-6">
                <h2 className="text-5xl md:text-7xl font-extrabold uppercase italic mb-8">Contact / <span className="text-white/50 italic">INFO</span></h2>
                <p className="text-white/60 max-w-2xl text-lg leading-relaxed mb-12">
                  For demos or general inquiries, contact us through our official channel or follow us on our social networks.
                </p>

                <div className="flex flex-col md:flex-row gap-8">
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=contacto.mzmrecords@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative border border-white bg-white text-black font-black tracking-widest px-10 py-5 rounded-full transition-all hover:bg-transparent hover:text-white text-center"
                  >
                    <span className="relative z-10 uppercase">SEND MAIL</span>
                  </a>

                  <a
                    href="https://www.instagram.com/mzm_records?igsh=MWU0amdma2ZqbGhvMA%3D%3D&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative border border-white/20 text-white font-black tracking-widest px-10 py-5 rounded-full transition-all hover:bg-white hover:text-black text-center"
                  >
                    <span className="relative z-10 uppercase">INSTAGRAM</span>
                  </a>
                </div>

              </div>
            </section>
          } />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
