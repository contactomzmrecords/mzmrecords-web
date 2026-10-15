import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEvent, createOrder, getPaymentInfo, uploadReceipt, getOrder } from "../lib/api";
import { useTranslation } from "../lib/useTranslation";


export default function EventDetail() {
    const { id } = useParams();
    const { language, t } = useTranslation();

    const [event, setEvent] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [preregistrationName, setPreregistrationName] = useState("");
    const [preregistrationEmail, setPreregistrationEmail] = useState("");
    const [preregistrationConfirmEmail, setPreregistrationConfirmEmail] = useState("");
    const [instagram, setInstagram] = useState("");
    const [registrationSubmitted, setRegistrationSubmitted] = useState(false);
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [order, setOrder] = useState(null);
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [selectedBank, setSelectedBank] = useState("lafise");
    const [receipt, setReceipt] = useState(null);
    const [receiptUploaded, setReceiptUploaded] = useState(false);
    const [orderStatus, setOrderStatus] = useState(null);

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

    async function handleOrderSubmit(submitEvent) {
        submitEvent.preventDefault();
        setFormError("");
        setIsSubmitting(true);

        try {
            const createdOrder = await createOrder({
                event_id: event.id || id,
                full_name: fullName,
                email,
                confirm_email: confirmEmail,
                phone,
                items: [
                    {
                        ticket_type_id: selectedTicket.id,
                        quantity,
                    },
                ],
                payment_method: "bank_transfer",
                selected_bank: selectedBank,
            });

            setOrder(createdOrder);
            const payment = await getPaymentInfo();
            setPaymentInfo(payment);
        } catch {
            setFormError(t("eventDetail.orderFailed"));
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

const bankInfo =
    paymentInfo?.banks?.[selectedBank] ?? null;

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
    onClick={() => setSelectedTicket(ticket)}
    className="bg-white text-black px-6 py-3 font-bold"
>
    {t("eventDetail.buy")}
</button>
            </div>
        </div>
    ))}
</div>
        {selectedTicket && (
    <form onSubmit={handleOrderSubmit} className="mt-8 border border-white/10 p-6">
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

        <div className="mt-6 space-y-4">
    <input
    type="text"
    placeholder={t("eventDetail.fullName")}
    value={fullName}
    onChange={(e) => setFullName(e.target.value)}
    required
    className="w-full bg-black border border-white/20 p-3"
/>

    <input
    type="email"
    placeholder={t("eventDetail.email")}
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
    className="w-full bg-black border border-white/20 p-3"
/>

    <input
    type="email"
    placeholder={t("eventDetail.confirmEmail")}
    value={confirmEmail}
    onChange={(e) => setConfirmEmail(e.target.value)}
    required
    className="w-full bg-black border border-white/20 p-3"
/>

    <input
    type="tel"
    placeholder={t("eventDetail.phone")}
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    className="w-full bg-black border border-white/20 p-3"
/>

    <div>
        <h3 className="font-bold mb-4">{t("eventDetail.paymentMethod")}</h3>
        <div className="flex gap-3 mb-6">
            {["lafise", "bac", "banpro"].map((bank) => (
                <button
                    key={bank}
                    type="button"
                    onClick={() => setSelectedBank(bank)}
                    className={`px-4 py-2 border ${selectedBank === bank ? "bg-white text-black" : "border-white/30"}`}
                >
                    {bank.toUpperCase()}
                </button>
            ))}
        </div>
    </div>

    {formError && <p className="text-red-400">{formError}</p>}

    <button
        type="submit"
        disabled={isSubmitting || !!order}
        className="bg-white text-black px-6 py-3 font-bold"
    >
        {isSubmitting ? t("eventDetail.processing") : t("eventDetail.continuePurchase")}
    </button>
</div>
    </form>
)}
        {order && paymentInfo && (
    <div className="mt-8 border border-white/10 p-6">
        <h2 className="text-2xl font-bold mb-4">
            {t("eventDetail.paymentInstructions")}
        </h2>


        <p className="mb-4">
            {t("eventDetail.order")}: {order.order_number}
        </p>

        <div className="mb-6">
    <h3 className="font-bold mb-4">
        {t("eventDetail.selectedBank")}: {selectedBank.toUpperCase()}
    </h3>

    {bankInfo && (
        <>
            <p>
                <strong>{t("eventDetail.bank")}:</strong> {bankInfo.bank}
            </p>

            <p>
                <strong>{t("eventDetail.accountHolder")}:</strong> {bankInfo.account_name}
            </p>

            <p>
                <strong>{t("eventDetail.account")}:</strong> {bankInfo.account_number}
            </p>

            <p>
                <strong>{t("eventDetail.accountType")}:</strong> {bankInfo.account_type}
            </p>
        </>
    )}
</div>

        <div>

<div className="mt-6">

    <label
        htmlFor="receipt"
        className="inline-block bg-white text-black px-6 py-3 font-bold cursor-pointer"
    >
        {t("eventDetail.selectReceipt")}
    </label>

    <input
        id="receipt"
        type="file"
        onChange={(e) => setReceipt(e.target.files[0])}
        className="hidden"
    />

    {receipt && (
        <p className="mt-2 text-white/70 text-sm">
            {receipt.name}
        </p>
    )}

</div>



<button
    onClick={async () => {

        if (!receipt) {
            alert(t("eventDetail.selectReceiptFirst"));
            return;
        }

        try {
            await uploadReceipt(order.id, receipt);

            const updatedOrder = await getOrder(order.id);

setOrderStatus(updatedOrder.status);

            setReceiptUploaded(true);

            console.log("COMPROBANTE SUBIDO");
        } catch (error) {
            console.error(error);
        }
    }}
    className="mt-4 bg-white text-black px-6 py-3 font-bold"
>
    {t("eventDetail.sendReceipt")}
</button>

{receiptUploaded && (
    <p className="mt-4 text-green-500">
        {t("eventDetail.receiptSent")}
    </p>
)}


{orderStatus === "review" && (
    <p className="mt-2 text-yellow-400 font-bold">
        🟡 {t("eventDetail.paymentReview")}
    </p>
)}

{orderStatus === "approved" && (
    <p className="mt-2 text-green-400 font-bold">
        🟢 {t("eventDetail.paymentApproved")}
    </p>
)}

{orderStatus === "rejected" && (
    <p className="mt-2 text-red-400 font-bold">
        🔴 {t("eventDetail.paymentRejected")}
    </p>
)}
        </div>
    </div>
)}
                </>
            )}
                </div>
            </div>
        </section>
    );
}
