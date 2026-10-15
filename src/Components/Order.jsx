import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { getOrder, getPaymentInfo, uploadReceipt } from "../lib/api";
import { useTranslation } from "../lib/useTranslation";

export default function Order() {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();
    const orderId = searchParams.get("id")
        || location.state?.order?.id
        || location.state?.order?.order_id;
    const token = searchParams.get("token")
        || location.state?.order?.token
        || location.state?.order?.access_token
        || location.state?.order?.order_token
        || location.state?.order?.order_access_token;
    const requestedBank = searchParams.get("bank")
        || location.state?.selectedBank
        || "lafise";
    const selectedBank = ["lafise", "bac", "banpro"].includes(requestedBank)
        ? requestedBank
        : "lafise";
    const [order, setOrder] = useState(() => (
        location.state?.order ? { ...location.state.order, token } : null
    ));
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [receipt, setReceipt] = useState(null);
    const [receiptUploaded, setReceiptUploaded] = useState(false);
    const [orderStatus, setOrderStatus] = useState(null);
    const [reservationSeconds, setReservationSeconds] = useState(null);
    const [error, setError] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        let cancelled = false;

        if (!orderId) {
            setError(t("eventDetail.orderNotFound"));
            return () => {
                cancelled = true;
            };
        }

        if (!order) {
            getOrder(orderId, token)
                .then((data) => {
                    if (!cancelled) {
                        setOrder({
                            ...data,
                            token: token || data.token || data.access_token || data.order_token || data.order_access_token,
                        });
                    }
                })
                .catch((loadError) => {
                    console.error(loadError);
                    if (!cancelled) {
                        setError(t("eventDetail.orderNotFound"));
                    }
                });
        }

        return () => {
            cancelled = true;
        };
    }, [order, orderId, t, token]);

    useEffect(() => {
        let cancelled = false;

        getPaymentInfo(token)
            .then((data) => {
                if (!cancelled) {
                    setPaymentInfo(data);
                }
            })
            .catch((loadError) => {
                console.error(loadError);
                if (!cancelled) {
                    setError(t("eventDetail.orderFailed"));
                }
            });

        return () => {
            cancelled = true;
        };
    }, [t, token]);

    useEffect(() => {
        if (!order) {
            setReservationSeconds(null);
            return;
        }

        const expiration = order.expires_at ?? order.reservation_expires_at;
        const expirationTime = expiration
            ? Date.parse(expiration)
            : Date.parse(order.created_at) + 20 * 60 * 1000;

        if (!Number.isFinite(expirationTime)) {
            setReservationSeconds(null);
            return;
        }

        const updateRemainingTime = () => {
            setReservationSeconds(Math.max(0, Math.ceil((expirationTime - Date.now()) / 1000)));
        };

        updateRemainingTime();
        const intervalId = window.setInterval(updateRemainingTime, 1000);
        return () => window.clearInterval(intervalId);
    }, [order]);

    async function handleReceiptUpload() {
        if (!receipt) {
            setError(t("eventDetail.selectReceiptFirst"));
            return;
        }

        setIsUploading(true);
        setError("");

        try {
            const orderToken = token
                || order.token
                || order.access_token
                || order.order_token
                || order.order_access_token;
            await uploadReceipt(orderId, receipt, orderToken);
            const updatedOrder = await getOrder(orderId, orderToken);
            setOrder({ ...updatedOrder, token: orderToken });
            setOrderStatus(updatedOrder.status);
            setReceiptUploaded(true);
        } catch (uploadError) {
            console.error(uploadError);
            setError(t("eventDetail.receiptUploadFailed"));
        } finally {
            setIsUploading(false);
        }
    }

    const bankInfo = paymentInfo?.banks?.[selectedBank]
        ?? paymentInfo?.banks?.[selectedBank.toUpperCase()]
        ?? order?.bank_details
        ?? order?.bank_info
        ?? order?.payment_details
        ?? null;
    const bankName = bankInfo?.bank ?? bankInfo?.bank_name ?? selectedBank.toUpperCase();
    const accountHolder = bankInfo?.account_name ?? bankInfo?.account_holder ?? bankInfo?.holder_name;
    const accountNumber = bankInfo?.account_number ?? bankInfo?.account;
    const accountType = bankInfo?.account_type ?? bankInfo?.type;
    const reservationTime = reservationSeconds === null
        ? null
        : `${String(Math.floor(reservationSeconds / 60)).padStart(2, "0")}:${String(reservationSeconds % 60).padStart(2, "0")}`;

    return (
        <section className="max-w-[var(--max)] mx-auto px-6 pt-40 pb-20 text-white">
            {!order ? (
                <div className="border border-white/10 bg-white/[0.02] p-6">
                    <p className="mb-6">{error || t("eventDetail.loading")}</p>
                    <Link to="/events" className="underline underline-offset-4">
                        {t("eventDetail.backToEvents")}
                    </Link>
                </div>
            ) : (
                <div className="mx-auto max-w-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
                    <p className="mb-2 text-xs uppercase tracking-[0.3em] text-white/40">
                        {t("eventDetail.orderReservation")}
                    </p>
                    <h1 className="mb-6 text-3xl font-bold">{t("eventDetail.paymentInstructions")}</h1>

                    {reservationTime !== null && (
                        <div
                            className={`mb-6 border px-4 py-3 ${reservationSeconds <= 300 ? "border-red-500/40 bg-red-950/30 text-red-300" : "border-white/15 bg-black text-white/80"}`}
                            role="timer"
                            aria-live="off"
                        >
                            <p className="text-xs uppercase tracking-[0.2em]">
                                {reservationSeconds === 0
                                    ? t("eventDetail.reservationExpired")
                                    : t("eventDetail.reservationTimeRemaining")}
                            </p>
                            <p className="mt-1 font-mono text-4xl font-bold tabular-nums">
                                {reservationTime}
                            </p>
                        </div>
                    )}

                    <div className="mb-6 border-y border-white/10 py-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                            {t("eventDetail.referenceCode")}
                        </p>
                        <p className="mt-1 font-mono text-xl font-bold">
                            {order.order_number || order.reference_code || order.id || order.order_id}
                        </p>
                    </div>

                    <div className="mb-8 space-y-2">
                        <h2 className="mb-3 font-bold uppercase tracking-[0.15em]">
                            {t("eventDetail.selectedBank")}: {selectedBank.toUpperCase()}
                        </h2>
                        <p><strong>{t("eventDetail.bank")}:</strong> {bankName}</p>
                        <p><strong>{t("eventDetail.accountHolder")}:</strong> {accountHolder || "—"}</p>
                        <p><strong>{t("eventDetail.account")}:</strong> {accountNumber || "—"}</p>
                        <p><strong>{t("eventDetail.accountType")}:</strong> {accountType || "—"}</p>
                    </div>

                    <div className="border-t border-white/10 pt-6">
                        <label
                            htmlFor="receipt"
                            className="inline-block cursor-pointer border border-white/30 px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] hover:bg-white hover:text-black"
                        >
                            {t("eventDetail.selectReceipt")}
                        </label>
                        <input
                            id="receipt"
                            type="file"
                            onChange={(inputEvent) => setReceipt(inputEvent.target.files?.[0] ?? null)}
                            className="sr-only"
                        />
                        {receipt && <p className="mt-3 text-sm text-white/60">{receipt.name}</p>}

                        <button
                            type="button"
                            onClick={handleReceiptUpload}
                            disabled={isUploading}
                            className="mt-4 block bg-white px-6 py-3 font-bold text-black disabled:opacity-50"
                        >
                            {isUploading ? t("eventDetail.processing") : t("eventDetail.sendReceipt")}
                        </button>

                        {error && <p className="mt-4 text-red-400">{error}</p>}
                        {receiptUploaded && (
                            <p className="mt-4 text-green-400">{t("eventDetail.receiptSent")}</p>
                        )}
                        {orderStatus === "review" && (
                            <p className="mt-2 font-bold text-yellow-400">{t("eventDetail.paymentReview")}</p>
                        )}
                        {orderStatus === "approved" && (
                            <p className="mt-2 font-bold text-green-400">{t("eventDetail.paymentApproved")}</p>
                        )}
                        {orderStatus === "rejected" && (
                            <p className="mt-2 font-bold text-red-400">{t("eventDetail.paymentRejected")}</p>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
