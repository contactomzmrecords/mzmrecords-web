import { Link } from "react-router-dom";
import { useEffect } from "react";
import logo from "../assets/logo.png";

export default function Footer() {

  useEffect(() => {
    if (!document.querySelector('script[src="https://www.google.com/recaptcha/api.js"]')) {
      const script = document.createElement("script");
      script.src = "https://www.google.com/recaptcha/api.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  const links = [
    { label: "About", path: "/about" },
    { label: "Label", path: "/label" },
    { label: "Radio", path: "/radio" },
    { label: "media", path: "/media" },
    { label: "Events", path: "/events" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <footer className="py-20 bg-black border-t border-[var(--line)]">
      <div className="max-w-[var(--max)] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-2">
            <div className="flex items-center mb-6 group">
              <Link to="/" className="w-16 h-16 flex items-center justify-center">
                <img
                  src={logo}
                  alt="MZM Records"
                  className="w-full h-full object-contain brightness-0 invert opacity-60 group-hover:opacity-100 transition-opacity"
                />
              </Link>
            </div>

            <p className="text-[var(--muted)] max-w-sm mb-8">
              HOME OF RAW SOUND — label and radio. Unfiltered. Exploring the limits of industrial and experimental sound.
            </p>

            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/mzm_records?igsh=MWU0amdma2ZqbGhvMA%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-black tracking-widest uppercase text-white/40 hover:text-white transition-colors"
              >
                Instagram
              </a>

              <a
                href="https://soundcloud.com/mzm-records?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-black tracking-widest uppercase text-white/40 hover:text-white transition-colors"
              >
                Soundcloud
              </a>

            </div>
          </div>

          <div>
            <h4 className="font-black tracking-widest text-[12px] uppercase mb-6">Quick Links</h4>
            <ul className="flex flex-col gap-4">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-[var(--muted)] hover:text-white transition-colors uppercase text-sm font-bold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
  <div>
  <h4 className="font-black tracking-widest text-[12px] uppercase mb-2">
    NEWSLETTER
  </h4>
<p className="text-white/50 text-sm mb-4 max-w-xs">
  Subscribe to receive news, releases, and events before anyone else.
</p>

  <form
  action="https://forms.mailpro.com/Form/ProcessForm/"
  method="post"
  target="_blank"
  className="flex flex-col gap-2 max-w-xs"
>
    <input
      type="email"
      name="awEmail"
      required
      placeholder="Your email"
      className="bg-white/5 border border-white/10 px-4 py-3 rounded-full text-[10px] font-black tracking-widest text-white placeholder:text-white/30 focus:outline-none focus:border-white/40"
    />

    <input
      type="hidden"
      name="formGuid"
      value="62e1b3bf-9f64-4787-83da-e79898a89551"
    />

    <button
      type="submit"
      className="bg-white text-black font-black tracking-widest text-[10px] px-4 py-3 rounded-full hover:bg-white/90 transition"
    >
      SUBSCRIBE
    </button>
  </form>
</div>
</div>

        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/5 gap-4">
          <span className="text-[10px] font-black tracking-widest text-white/30 uppercase">
            Copyright 2026 © All rights Reserved. Design by MZM RECORDS
          </span>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-[10px] font-black tracking-widest text-white/30 uppercase cursor-pointer hover:text-white transition-colors"
          >
            BACK TO TOP ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
