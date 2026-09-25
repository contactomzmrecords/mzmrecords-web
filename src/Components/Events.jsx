import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Construction } from "lucide-react";
import { getEvents } from "../lib/api";

export default function Events() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        getEvents()
            .then((data) => {
                console.log("EVENTOS:", data);
                setEvents(data);
            })
            .catch(console.error);
    }, []);

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

                {events.length === 0 ? (
                    <div className="border border-white/10 bg-white/[0.02] py-28 px-8 flex flex-col items-center justify-center text-center">
                        <Construction
                            size={64}
                            className="text-white/30 mb-8"
                        />

                        <h3 className="text-4xl md:text-5xl font-display uppercase mb-6">
                            No Dates Announced
                        </h3>

                        <p className="max-w-xl text-white/50 leading-relaxed">
                            We're preparing the next experience.
                            Follow MZM Records and stay tuned for upcoming
                            events.
                        </p>

                        <span className="mt-10 text-xs tracking-[0.4em] uppercase text-white/30">
                            Coming Soon
                        </span>
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-center gap-8">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="w-full md:w-[calc(50%-1rem)] max-w-[620px] border border-white/10 bg-white/[0.02] overflow-hidden"
                            >
                                <div className="w-full aspect-[4/5] overflow-hidden bg-black">
                                    <img
                                        src={event.image_url}
                                        alt={event.name}
                                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                                    />
                                </div>

                                <div className="p-6">
                                    <h3 className="text-2xl font-bold mb-3">
                                        {event.name}
                                    </h3>

                                    <p className="text-sm text-white/40 mb-2">
                                        {new Date(
                                            event.date
                                        ).toLocaleDateString()}
                                    </p>

                                    <p className="text-white/60 mb-4">
                                        {event.location}
                                    </p>

                                    <Link
                                        to={`/events/${event.id}`}
                                        className="inline-block bg-white text-black px-4 py-2 font-bold transition hover:bg-lime-300"
                                    >
                                        VIEW DETAILS
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}