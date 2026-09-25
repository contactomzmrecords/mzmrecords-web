import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEvent, createOrder, getPaymentInfo, uploadReceipt, getOrder } from "../lib/api";


export default function EventDetail() {
    const { id } = useParams();

    const [event, setEvent] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [order, setOrder] = useState(null);
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [selectedBank, setSelectedBank] = useState("lafise");
    const [receipt, setReceipt] = useState(null);
    const [receiptUploaded, setReceiptUploaded] = useState(false);
    const [orderStatus, setOrderStatus] = useState(null);

    const [quantity, setQuantity] = useState(1);

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
                Cargando evento...
            </section>
        );
    }

const bankInfo =
    paymentInfo?.banks?.[selectedBank] ?? null;

    return (
        <section className="max-w-[var(--max)] mx-auto px-6 pt-40 pb-20 text-white">
            <div className="grid lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] gap-10 lg:gap-16 items-start">
                <div className="lg:sticky lg:top-28 self-start">
                    <div className="w-full aspect-[4/5] overflow-hidden bg-black">
                <img
                    src={event.image_url}
                    alt={event.name}
                    className="w-full h-full object-cover"
                />
                    </div>
                </div>

                <div className="min-w-0">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-5">
                        {event.name}
                    </h1>

                    <div className="space-y-2 text-white/50">
                        <p>{new Date(event.date).toLocaleDateString()}</p>
                        <p>{event.location}</p>
                    </div>

                    {event.description && (
                        <p className="text-white/70 mt-8 max-w-3xl leading-relaxed">
                            {event.description}
                        </p>
                    )}

                    <div className="pt-2">

                    <h2 className="text-2xl font-bold mt-10 mb-6">
    Tickets Disponibles
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
    Comprar
</button>
            </div>
        </div>
    ))}
</div>
                    </div>

        {selectedTicket && (
    <div className="mt-8 border border-white/10 p-6">
        <h3 className="text-xl font-bold mb-2">
            Ticket seleccionado
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
    Total: C${selectedTicket.price * quantity}
</p>

</div>

        <div className="mt-6 space-y-4">
    <input
    type="text"
    placeholder="Nombre completo"
    value={fullName}
    onChange={(e) => setFullName(e.target.value)}
    className="w-full bg-black border border-white/20 p-3"
/>

    <input
    type="email"
    placeholder="Correo electrónico"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full bg-black border border-white/20 p-3"
/>

    <input
    type="tel"
    placeholder="Teléfono"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    className="w-full bg-black border border-white/20 p-3"
/>

    <button
    disabled={!!order}
    onClick={async () => {
        try {
            const order = await createOrder({
                event_id: event.id,
                full_name: fullName,
                email,
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

            setOrder(order);

            const payment = await getPaymentInfo();
            setPaymentInfo(payment);

            console.log("ORDEN CREADA:", order);
        } catch (error) {
            console.error(error);
        }
    }}
    className="bg-white text-black px-6 py-3 font-bold"
>
    Continuar Compra
</button>
</div>
    </div>
)}
        {order && paymentInfo && (
    <div className="mt-8 border border-white/10 p-6">
        <h2 className="text-2xl font-bold mb-4">
            Instrucciones de Pago
        </h2>


        <p className="mb-4">
            Orden: {order.order_number}
        </p>

        <div className="mb-6">
    <h3 className="font-bold mb-4">
        Selecciona el banco
    </h3>

    <div className="flex gap-3 mb-6">
        <button
            type="button"
            onClick={() => setSelectedBank("lafise")}
            className={`px-4 py-2 border ${
                selectedBank === "lafise"
                    ? "bg-white text-black"
                    : "border-white/30"
            }`}
        >
            LAFISE
        </button>

        <button
            type="button"
            onClick={() => setSelectedBank("bac")}
            className={`px-4 py-2 border ${
                selectedBank === "bac"
                    ? "bg-white text-black"
                    : "border-white/30"
            }`}
        >
            BAC
        </button>

        <button
            type="button"
            onClick={() => setSelectedBank("banpro")}
            className={`px-4 py-2 border ${
                selectedBank === "banpro"
                    ? "bg-white text-black"
                    : "border-white/30"
            }`}
        >
            Banpro
        </button>
    </div>

    {bankInfo && (
        <>
            <p>
                <strong>Banco:</strong> {bankInfo.bank}
            </p>

            <p>
                <strong>Titular:</strong> {bankInfo.account_name}
            </p>

            <p>
                <strong>Cuenta:</strong> {bankInfo.account_number}
            </p>

            <p>
                <strong>Tipo:</strong> {bankInfo.account_type}
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
        Seleccionar comprobante
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
            alert("Selecciona un comprobante primero");
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
    Enviar comprobante
</button>

{receiptUploaded && (
    <p className="mt-4 text-green-500">
        Comprobante enviado correctamente
    </p>
)}


{orderStatus === "review" && (
    <p className="mt-2 text-yellow-400 font-bold">
        🟡 Pago en revisión
    </p>
)}

{orderStatus === "approved" && (
    <p className="mt-2 text-green-400 font-bold">
        🟢 Pago aprobado
    </p>
)}

{orderStatus === "rejected" && (
    <p className="mt-2 text-red-400 font-bold">
        🔴 Pago rechazado
    </p>
)}
        </div>
    </div>
)}
                    </div>
                </div>
            </div>
        </section>
    );
}
