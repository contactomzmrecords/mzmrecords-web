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
import EventDetail from "./Components/EventDetail";
import { useTranslation } from "./lib/useTranslation";

export default function App() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

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
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/media" element={<Media />} />

          <Route path="/about" element={
            <section className="py-32 border-b border-[var(--line)]">
              <div className="max-w-[var(--max)] mx-auto px-6">
                <h2 className="text-5xl md:text-7xl font-extrabold uppercase italic mb-8">{t("about.about")} <span className="text-white/50 italic">{t("about.us")}</span></h2>
                <p className="text-white/60 max-w-2xl text-lg leading-relaxed">
                  {t("about.body")}
                </p>
              </div>
            </section>
          } />

          <Route path="/contact" element={
            <section className="py-32">
              <div className="max-w-[var(--max)] mx-auto px-6">
                <h2 className="text-5xl md:text-7xl font-extrabold uppercase italic mb-8">{t("contact.contact")} / <span className="text-white/50 italic">{t("contact.info")}</span></h2>
                <p className="text-white/60 max-w-2xl text-lg leading-relaxed mb-12">
                  {t("contact.body")}
                </p>

                <div className="flex flex-col md:flex-row gap-8">
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=contacto.mzmrecords@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative border border-white bg-white text-black font-black tracking-widest px-10 py-5 rounded-full transition-all hover:bg-transparent hover:text-white text-center"
                  >
                    <span className="relative z-10 uppercase">{t("contact.sendMail")}</span>
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
