import { useEffect, useState } from "react";
import en from "./locales/en.json";
import es from "./locales/es.json";
import { LanguageContext } from "./lib/LanguageContext";

const dictionaries = { en, es };

function getInitialLanguage() {
    try {
        const savedLanguage = window.localStorage.getItem("mzm-language");
        if (savedLanguage === "en" || savedLanguage === "es") {
            return savedLanguage;
        }
    } catch {
        // Fall back to the document locale when storage is unavailable.
    }

    return document.documentElement.lang.toLowerCase().startsWith("es")
        ? "es"
        : "en";
}

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(getInitialLanguage);

    useEffect(() => {
        document.documentElement.lang = language;
        try {
            window.localStorage.setItem("mzm-language", language);
        } catch {
            // The locale remains active for the current session.
        }
    }, [language]);

    function t(key) {
        const value = key
            .split(".")
            .reduce((current, part) => current?.[part], dictionaries[language]);
        return typeof value === "string" ? value : key;
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}