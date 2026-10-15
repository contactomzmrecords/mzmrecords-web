import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { useTranslation } from "../lib/useTranslation";

export default function Topbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const { language, setLanguage, t } = useTranslation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);

        // Lock body scroll when menu is open
        if (menuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.body.style.overflow = "auto";
        };
    }, [menuOpen]);

    const links = [
        { id: "home", path: "/" },
        { id: "artists", path: "/artists" },
        { id: "label", path: "/label" },
        { id: "radio", path: "/radio" },
        { id: "media", path: "/media" },
        { id: "events", path: "/events" },
        { id: "about", path: "/about" },
        { id: "contact", path: "/contact" },
    ];

    return (
        <header className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-500 bg-black border-b border-white/10 ${scrolled ? "py-2" : "py-3 md:py-5"
            }`}>
            <div className="max-w-[var(--max)] mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center group" onClick={() => setMenuOpen(false)}>
                    <div className="relative w-20 h-20 md:w-20 md:h-20 flex items-center justify-center">
                        <img
                            src={logo}
                            alt="MZM Records"
                            className="w-full h-full object-contain brightness-0 invert group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <ul className="flex items-center gap-2">
                        {links.map((link) => (
                            <li key={link.id}>
                                <Link
                                    to={link.path}
                                    className={`relative text-[10px] font-black tracking-widest px-5 py-2 uppercase transition-all ${location.pathname === link.path ? "text-white" : "text-white/40 hover:text-white"
                                        }`}
                                >
                                    {t(`common.${link.id}`)}
                                    {location.pathname === link.path && (
                                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[1px] bg-white" />
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="flex items-center gap-1" role="group" aria-label={t("common.language")}>
                    {["en", "es"].map((locale) => (
                        <button
                            key={locale}
                            type="button"
                            aria-pressed={language === locale}
                            onClick={() => setLanguage(locale)}
                            className={`border px-2 py-1 text-[10px] font-black tracking-widest transition ${language === locale ? "border-white text-white" : "border-white/20 text-white/40 hover:text-white"}`}
                        >
                            {locale.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Mobile Trigger */}
                <button
                    className="md:hidden text-white/60 hover:text-white z-[120]"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X size={32} strokeWidth={1.5} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Nav */}
            <div className={`md:hidden fixed inset-0 z-[100] transition-all duration-500 ease-in-out overflow-y-auto ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}>
                {/* Intense Solid Backdrop */}
                <div className="fixed inset-0 bg-black backdrop-blur-3xl -z-10" />

                <div className="relative min-h-full flex flex-col p-8 pt-32">

                    <nav className="flex flex-col gap-10">
                        {links.map((link) => (
                            <Link
                                key={link.id}
                                to={link.path}
                                className={`text-5xl font-extrabold uppercase tracking-tighter transition-all ${location.pathname === link.path ? "text-white italic" : "text-white/40 hover:text-white"
                                    }`}
                                onClick={() => setMenuOpen(false)}
                            >
                                {t(`common.${link.id}`)}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    );
}
