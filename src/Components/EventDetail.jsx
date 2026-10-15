import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEvent } from "../lib/api";
import { useTranslation } from "../lib/useTranslation";


export default function EventDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { language, t } = useTranslation();

    const [event, setEvent] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [preregistrationName, setPreregistrationName] = useState("");
    const [preregistrationEmail, setPreregistrationEmail] = useState("");
    const [preregistrationConfirmEmail, setPreregistrationConfirmEmail] = useState("");
    const [instagram, setInstagram] = useState("");
    const [registrationSubmitted, setRegistrationSubmitted] = useState(false);
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [quantity, setQuantity] = useState(1);

    async function handlePreregistrationSubmit(submitEvent) {
        submitEvent.preventDefault();
        setFormError("");
        setIsSubmitting(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_TICKETNI_API}/api/events/${encodeURIComponent(id)}/preregister`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: preregistrationName,
                        email: preregistrationEmail,
                        confirm_email: preregistrationConfirmEmail,
                        instagram: instagram || null,
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const detail = Array.isArray(errorData?.detail)
                    ? errorData.detail.map((item) => item.msg).join(", ")
                    : errorData?.detail;
                throw new Error(detail || t("eventDetail.registrationFailed"));
            }

            setRegistrationSubmitted(true);
        } catch {
            setFormError(t("eventDetail.registrationFailed"));
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        async function loadEvent() {
            try {
                const data = await getEvent(id);
                setEvent(data);
            } catch (error) {
                console.error(error);
            }
        }

        loadEvent();
    }, [id]);

    if (!event) {
        return (
            <section className="max-w-[var(--max)] mx-auto px-6 pt-40 pb-20 text-white">
                {t("eventDetail.loading")}
            </section>
        );
    }

    return (
        <section className="max-w-[var(--max)] mx-auto px-6 pt-40 pb-20 text-white">
            <div className="grid lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] gap-10 lg:gap-16 items-start">
                <div className="lg:sticky lg:top-28 self-start">
                    <div className="w-full aspect-[4/5] overflow-hidden bg-black" style={{ aspectRatio: "1/1" }}>
                <img
                    src={event.image_url}
                    alt={event.name}
                    className="w-full h-full object-cover"
                />
                    </div>
                </div>

                <div className="min-w-0">
            <h1 className="text-5xl font-bold mb-4">
                {event.name}
            </h1>

            {event.show_date !== false &&
                event.date != null &&
                String(event.date).trim() !== "" &&
                !Number.isNaN(Date.parse(event.date)) && (
                    <p className="text-white/50 mt-4">
                        {new Date(event.date).toLocaleDateString(language === "es" ? "es-NI" : "en-US")}
                    </p>
                )}

<p className="text-white/60 mt-2">
    {event.location}
</p>

<p className="text-white/80 mt-8 max-w-3xl leading-relaxed">
    {event.description}
</p>

            {event.is_teaser === true ? (
                <form onSubmit={handlePreregistrationSubmit} className="mt-12 space-y-4">
                    <h2 className="text-2xl font-bold mb-6">
                        {t("eventDetail.earlyAccess")}
                    </h2>

                    {registrationSubmitted ? (
                        <p className="text-green-400">{t("eventDetail.registrationReceived")}</p>
                    ) : (
                        <>
                            <input
                                type="text"
                                placeholder={t("eventDetail.name")}
                                value={preregistrationName}
                                onChange={(e) => setPreregistrationName(e.target.value)}
                                required
                                className="w-full bg-black border border-white/20 p-3"
                            />
                            <input
                                type="email"
                                placeholder={t("eventDetail.email")}
                                value={preregistrationEmail}
                                onChange={(e) => setPreregistrationEmail(e.target.value)}
                                required
                                className="w-full bg-black border border-white/20 p-3"
                            />
                            <input
                                type="email"
                                placeholder={t("eventDetail.confirmEmail")}
                                value={preregistrationConfirmEmail}
                                onChange={(e) => setPreregistrationConfirmEmail(e.target.value)}
                                required
                                className="w-full bg-black border border-white/20 p-3"
                            />
                            <input
                                type="text"
                                placeholder={t("eventDetail.instagramOptional")}
                                value={instagram}
                                onChange={(e) => setInstagram(e.target.value)}
                                className="w-full bg-black border border-white/20 p-3"
                            />
                            {formError && <p className="text-red-400">{formError}</p>}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-white text-black px-6 py-3 font-bold"
                            >
                                {isSubmitting ? t("eventDetail.sending") : t("eventDetail.register")}
                            </button>
                        </>
                    )}
                </form>
            ) : (
                <>
            <h2 className="text-2xl font-bold mt-12 mb-6">
    {t("eventDetail.ticketsAvailable")}
</h2>

<div className="space-y-4">
    {event.ticket_types?.map((ticket) => (
        <div
            key={ticket.id}
            className="border border-white/10 p-4 flex justify-between items-center"
        >
            <div>
                <h3 className="font-bold">{ticket.name}</h3>
                <p className="text-white/50 text-sm">
                    {ticket.description}
                </p>
            </div>

            <div className="text-right">
                <p className="font-bold">
                    C${ticket.price}
                </p>

                <button
    type="button"
    onClick={() => {
        setSelectedTicket(ticket);
        setQuantity(1);
    }}
    className="bg-white text-black px-6 py-3 font-bold"
>
    {t("eventDetail.buy")}
</button>
            </div>
        </div>
    ))}
</div>
        {selectedTicket && (
    <div className="mt-8 border border-white/10 p-6">
        <h3 className="text-xl font-bold mb-2">
            {t("eventDetail.selectedTicket")}
        </h3>

        <p>{selectedTicket.name}</p>
        <p>C${selectedTicket.price}</p>

        <div className="flex items-center gap-4 mt-4">
    <button
        type="button"
        onClick={() => setQuantity(Math.max(1, quantity - 1))}
        className="bg-white text-black px-3 py-1"
    >
        -
    </button>

    <span>{quantity}</span>

    <button
        type="button"
        onClick={() => setQuantity(quantity + 1)}
        className="bg-white text-black px-3 py-1"
    >
        +
    </button>

    <p className="mt-4 font-bold">
    {t("eventDetail.total")}: C${selectedTicket.price * quantity}
</p>

</div>

        <button
            type="button"
            onClick={() => navigate(`/checkout?event_id=${encodeURIComponent(event.id || id)}&ticket_type_id=${encodeURIComponent(selectedTicket.id)}&quantity=${quantity}`, {
                state: { event, ticket: selectedTicket, quantity },
            })}
            className="mt-6 bg-white text-black px-6 py-3 font-bold"
        >
            {t("eventDetail.continuePurchase")}
        </button>
    </div>
)}
                </>
            )}
                </div>
            </div>
        </section>
    );
}
