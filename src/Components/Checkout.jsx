import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { createOrder, getEvent } from "../lib/api";
import { useTranslation } from "../lib/useTranslation";

export default function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();
    const eventId = searchParams.get("event_id") || location.state?.event?.id;
    const ticketId = searchParams.get("ticket_type_id") || location.state?.ticket?.id;
    const [event, setEvent] = useState(location.state?.event ?? null);
    const [ticket, setTicket] = useState(location.state?.ticket ?? null);
    const quantity = Number(location.state?.quantity ?? searchParams.get("quantity")) || 1;
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [selectedBank, setSelectedBank] = useState("lafise");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(!location.state?.event || !location.state?.ticket);

    useEffect(() => {
        if (!eventId || !ticketId) {
            setLoading(false);
            return;
        }

        if (event?.ticket_types?.some((item) => String(item.id) === String(ticketId))) {
            setTicket(event.ticket_types.find((item) => String(item.id) === String(ticketId)));
            setLoading(false);
            return;
        }

        let cancelled = false;
        setLoading(true);

        getEvent(eventId)
            .then((data) => {
                if (cancelled) {
                    return;
                }

                const selectedTicket = data.ticket_types?.find(
                    (item) => String(item.id) === String(ticketId)
                );
                if (!selectedTicket) {
                    setFormError(t("eventDetail.ticketUnavailable"));
                    return;
                }

                setEvent(data);
                setTicket(selectedTicket);
            })
            .catch((error) => {
                console.error(error);
                if (!cancelled) {
                    setFormError(t("eventDetail.orderFailed"));
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [event, eventId, ticketId, t]);

    async function handleSubmit(submitEvent) {
        submitEvent.preventDefault();
        if (!event || !ticket) {
            return;
        }

        setFormError("");
        setIsSubmitting(true);

        try {
            const responseData = await createOrder({
                event_id: event.id || eventId,
                full_name: fullName,
                email,
                confirm_email: confirmEmail,
                items: [{ ticket_type_id: ticket.id, quantity }],
                payment_method: "bank_transfer",
                selected_bank: selectedBank,
            });

            const orderData = responseData.data ?? responseData;
            const orderId = orderData.id ?? orderData.order_id;
            if (!orderId) {
                throw new Error("Order response did not include an order ID");
            }

            const tokenFields = [
                responseData.customer_access_token,
                responseData.data?.customer_access_token,
                responseData.token,
                responseData.access_token,
                responseData.order_access_token,
                responseData.data?.token,
                responseData.data?.access_token,
                responseData.data?.order_access_token,
            ];
            const token = tokenFields.find(
                (value) => typeof value === "string" && value.trim().length > 0
            );
            if (token) {
                try {
                    window.localStorage.setItem("ticketni_order_access_token", token);
                    window.localStorage.setItem(`ticketni_token_${orderId}`, token);
                    window.sessionStorage.setItem("ticketni_order_access_token", token);
                    console.info("MZM order authorization token found and stored.");
                } catch (storageError) {
                    console.warn("Could not persist the MZM order authorization token.", storageError);
                }
            } else {
                console.warn("MZM order response did not include an authorization token.");
            }

            const params = new URLSearchParams({
                id: String(orderId),
                bank: selectedBank,
            });

            navigate(`/order?${params.toString()}`, {
                state: { order: { ...orderData, token }, selectedBank },
            });
        } catch (error) {
            console.error(error);
            setFormError(t("eventDetail.orderFailed"));
        } finally {
            setIsSubmitting(false);
        }
    }

    if (loading) {
        return (
            <section className="max-w-[var(--max)] mx-auto px-6 pt-40 pb-20 text-white">
                {t("eventDetail.loading")}
            </section>
        );
    }

    if (!event || !ticket) {
        return (
            <section className="max-w-[var(--max)] mx-auto px-6 pt-40 pb-20 text-white">
                <p className="mb-6">{formError || t("eventDetail.ticketUnavailable")}</p>
                <Link to="/events" className="underline underline-offset-4">
                    {t("eventDetail.backToEvents")}
                </Link>
            </section>
        );
    }

    return (
        <section className="max-w-[var(--max)] mx-auto px-6 pt-40 pb-20 text-white">
            <div className="mx-auto max-w-xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
                <p className="mb-2 text-xs uppercase tracking-[0.3em] text-white/40">
                    {event.name}
                </p>
                <h1 className="mb-2 text-3xl font-bold">{t("eventDetail.checkout")}</h1>
                <p className="mb-8 text-white/60">
                    {ticket.name} · {quantity} × C${ticket.price}
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                        type="text"
                        placeholder={t("eventDetail.fullName")}
                        value={fullName}
                        onChange={(inputEvent) => setFullName(inputEvent.target.value)}
                        required
                        className="w-full border border-white/20 bg-black p-3"
                    />
                    <input
                        type="email"
                        placeholder={t("eventDetail.email")}
                        value={email}
                        onChange={(inputEvent) => setEmail(inputEvent.target.value)}
                        required
                        className="w-full border border-white/20 bg-black p-3"
                    />
                    <input
                        type="email"
                        placeholder={t("eventDetail.confirmEmail")}
                        value={confirmEmail}
                        onChange={(inputEvent) => setConfirmEmail(inputEvent.target.value)}
                        required
                        className="w-full border border-white/20 bg-black p-3"
                    />

                    <div>
                        <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.15em]">
                            {t("eventDetail.paymentMethod")}
                        </h2>
                        <div className="flex gap-3">
                            {["lafise", "bac", "banpro"].map((bank) => (
                                <button
                                    key={bank}
                                    type="button"
                                    onClick={() => setSelectedBank(bank)}
                                    aria-pressed={selectedBank === bank}
                                    className={`border px-4 py-2 ${selectedBank === bank ? "border-white bg-white text-black" : "border-white/30 text-white"}`}
                                >
                                    {bank.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {formError && <p className="text-red-400">{formError}</p>}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-white px-6 py-3 font-bold text-black disabled:opacity-50"
                    >
                        {isSubmitting ? t("eventDetail.processing") : t("eventDetail.reserveOrder")}
                    </button>
                </form>
            </div>
        </section>
    );
}
