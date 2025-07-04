import React, { useEffect, useState, useCallback } from "react";
import echo from "../echo";
import { Link } from "react-router-dom";
import { useOrdenesActivas } from "../hooks/useOrdenesActivas";
import { useMesas } from "../hooks/useMesas";
import { FaTable } from "react-icons/fa6";
import ModalOrdenDetalle from "../components/ModalOrdenDetalle";
import PedidoItemsList from "../components/pedidos/PedidoItemsList";
import axios from "../axiosConfig";
import { BotonPruebaImpresion } from "../components/BotonPruebaImpresion";

export default function Mesas() {
    // Estados para crear y editar mesa
    const [form, setForm] = useState({ nombre: '', personas: 0 });
    const [editMesa, setEditMesa] = useState(null); // { id, nombre, personas }
    const [editLoading, setEditLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [ordenDetalle, setOrdenDetalle] = useState(null);
    const [toastMsg, setToastMsg] = useState("");

    // Centralizar estado de mesas usando el hook
    const { mesas, loading, error, refetch } = useMesas();
    const { ordenes: ordenesActivas, fetchOrdenes } = useOrdenesActivas();

    // Suscribirse a eventos realtime para refrescar mesas
    useEffect(() => {
        const channel = echo.channel("mesas").listen("MesaActualizada", () => {
            refetch();
            if (typeof fetchOrdenes === "function") fetchOrdenes();
        });
        return () => {
            channel.stopListening("MesaActualizada");
        };
    }, [refetch, fetchOrdenes]);

    // Crear nueva mesa
    const handleCrear = useCallback(async (e) => {
        e.preventDefault();
        const nombre = form.nombre.trim();
        if (!nombre) return;
        if (mesas.some(m => m.name.trim().toLowerCase() === nombre.toLowerCase())) {
            setToastMsg("Ya existe una mesa con ese nombre.");
            setTimeout(() => setToastMsg(""), 2000);
            return;
        }
        try {
            await axios.post("/api/mesas", { name: nombre, personas: form.personas });
            setForm({ nombre: '', personas: 0 });
            refetch();
        } catch {
            setToastMsg("Error al crear mesa");
            setTimeout(() => setToastMsg(""), 2000);
        }
    }, [form, mesas, refetch]);

    // Iniciar edición de mesa
    const handleEditMesa = mesa => {
        setEditMesa({ id: mesa.id, nombre: mesa.name, personas: mesa.personas || 0 });
    };

    // Cambiar campos de edición
    const handleEditChange = e => {
        setEditMesa({ ...editMesa, [e.target.name]: e.target.value });
    };

    // Guardar edición de mesa
    const handleEditSave = async () => {
        const nombre = (editMesa?.nombre || '').trim();
        if (!nombre) return;
        if (mesas.some(m => m.name.trim().toLowerCase() === nombre.toLowerCase() && m.id !== editMesa.id)) {
            setToastMsg("Ya existe una mesa con ese nombre.");
            setTimeout(() => setToastMsg(""), 2000);
            return;
        }
        setEditLoading(true);
        try {
            await axios.put(`/api/mesas/${editMesa.id}`, { name: nombre, personas: editMesa.personas });
            setEditMesa(null);
            refetch();
            setToastMsg("Mesa actualizada");
        } catch {
            setToastMsg("Error al editar mesa");
        } finally {
            setEditLoading(false);
            setTimeout(() => setToastMsg(""), 2000);
        }
    };

    // Inhabilitar/reactivar mesa
    const handleToggleMesa = async (mesa) => {
        setEditLoading(true);
        try {
            await axios.put(`/api/mesas/${mesa.id}`, { active: !mesa.active });
            refetch();
            setToastMsg(mesa.active ? "Mesa inhabilitada" : "Mesa reactivada");
        } catch (err) {
            setToastMsg("Error al actualizar mesa");
        } finally {
            setEditLoading(false);
            setTimeout(() => setToastMsg(""), 2000);
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                width: "100vw",
                height: "100vh",
                background: "#222",
                zIndex: 0,
            }}
        >
            <BotonPruebaImpresion />
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    zIndex: 1,
                }}
            >
                <h2 style={{ color: "#ffd203", marginBottom: 24 }}>
                    Gestión de Mesas
                </h2>
                <form onSubmit={handleCrear} style={{ marginBottom: 32, display: "flex", gap: 12, alignItems: "center" }}>
                    <input
                        type="text"
                        name="nombre"
                        value={form.nombre}
                        onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                        placeholder="Nombre o número de mesa"
                        style={{ padding: "0.7rem 1.2rem", borderRadius: "0.7rem", border: "1px solid #ffd203", fontSize: "1.1rem", minWidth: 180 }}
                    />
                    <input
                        type="number"
                        name="personas"
                        min={1}
                        max={30}
                        value={form.personas}
                        onChange={e => setForm(f => ({ ...f, personas: Number(e.target.value) }))}
                        placeholder="Personas"
                        style={{ padding: "0.7rem 1.2rem", borderRadius: "0.7rem", border: "1px solid #ffd203", fontSize: "1.1rem", width: 110 }}
                    />
                    <button type="submit" style={{ padding: "0.7rem 1.5rem", borderRadius: "1rem", background: "#ffd203", color: "#010001", fontWeight: 700, border: "none", cursor: "pointer", fontSize: "1.1rem" }}>Agregar</button>
                </form>
                {error && (
                    <p style={{ color: "red", marginBottom: 16 }}>{error}</p>
                )}
                {loading ? (
                    <p style={{ color: "#fff" }}>Cargando mesas...</p>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "1.5rem",
                            marginTop: 24,
                            width: "100%",
                            maxWidth: 1400,
                            marginLeft: "auto",
                            marginRight: "auto",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                        }}
                    >
                        {mesas.length === 0 ? (
                            <div
                                style={{ color: "#fff", gridColumn: "1 / -1" }}
                            >
                                No hay mesas registradas.
                            </div>
                        ) : (
                            mesas.map((mesa) => {
                                const ordenActiva = ordenesActivas.find(
                                    (o) => o.mesa_id === mesa.id
                                );
                                const ocupada = !!ordenActiva;
                                return (
                                    <div
                                        key={mesa.id}
                                        style={{
                                            background: !mesa.active
                                                ? "#555"
                                                : ocupada
                                                ? "#3a1818"
                                                : "#232323",
                                            color: !mesa.active
                                                ? "#aaa"
                                                : ocupada
                                                ? "#ff4d4f"
                                                : "#ffd203",
                                            border: ocupada
                                                ? "2.5px solid #ff4d4f"
                                                : "2px solid #ffd203",
                                            borderRadius: 18,
                                            boxShadow: ocupada
                                                ? "0 2px 12px 0 rgba(255,77,79,0.10)"
                                                : "0 1px 4px 0 rgba(0,0,0,0.10)",
                                            opacity: mesa.active ? 1 : 0.6,
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: 180,
                                            height: 220,
                                            padding: "0 12px",
                                            transition: "all 0.2s",
                                            position: "relative",
                                            cursor:
                                                ocupada && mesa.active
                                                    ? "pointer"
                                                    : "default",
                                        }}
                                        title={
                                            ocupada
                                                ? "Ocupada: hay una orden activa"
                                                : "Libre"
                                        }
                                        onClick={async (e) => {
                                            // Si el click viene de un botón, no abrir modal
                                            if (e.target.tagName === "BUTTON")
                                                return;
                                            if (ocupada && mesa.active) {
                                                try {
                                                    const res = await axios.get(
                                                        `/api/orders/${ordenActiva.id}`
                                                    );
                                                    const data = res.data;
                                                    setOrdenDetalle({
                                                        id: data.id,
                                                        mesa: mesa.name,
                                                        productos:
                                                            data.items.map(
                                                                (item) => ({
                                                                    name:
                                                                        item
                                                                            .product
                                                                            ?.name ||
                                                                        "Producto",
                                                                    quantity:
                                                                        item.quantity,
                                                                    price: item.price,
                                                                    notes: item.notes,
                                                                })
                                                            ),
                                                        total: data.total,
                                                        estado:
                                                            data.status ||
                                                            "Activo",
                                                    });
                                                    setModalOpen(true);
                                                } catch (e) {
                                                    setOrdenDetalle({
                                                        id: ordenActiva.id,
                                                        mesa: mesa.name,
                                                        productos: [],
                                                        total: 0,
                                                        estado: "Error",
                                                        error: "No se pudo cargar el detalle de la orden.",
                                                    });
                                                    setModalOpen(true);
                                                }
                                            }
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "100%",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                marginBottom: 4,
                                            }}
                                        >
                                            <FaTable
                                                size={38}
                                                style={{
                                                    marginBottom: 10,
                                                    color: ocupada
                                                        ? "#ff4d4f"
                                                        : "#ffd203",
                                                    opacity: mesa.active
                                                        ? 1
                                                        : 0.5,
                                                }}
                                            {editMesa && editMesa.id === mesa.id ? (
                                                <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 2, gap: 8 }}>
                                                    <input
                                                        name="nombre"
                                                        value={editMesa.nombre}
                                                        onChange={handleEditChange}
                                                        style={{ fontWeight: 900, fontSize: "1.1rem", borderRadius: 6, border: "1px solid #ffd203", padding: "2px 8px", width: "100%", maxWidth: 110, textAlign: "center", background: "#232323", color: "#ffd203" }}
                                                        disabled={editLoading}
                                                        maxLength={50}
                                                        autoFocus
                                                        onKeyDown={e => { if (e.key === 'Enter') handleEditSave(); }}
                                                        onClick={e => e.stopPropagation()}
                                                        required
                                                    />
                                                    <input
                                                        name="personas"
                                                        type="number"
                                                        min={1}
                                                        max={30}
                                                        value={editMesa.personas}
                                                        onChange={handleEditChange}
                                                        style={{ fontWeight: 700, fontSize: '1.05rem', borderRadius: 6, border: '1px solid #ffd203', padding: '2px 8px', width: 60, textAlign: 'center', background: '#232323', color: '#ffd203' }}
                                                        disabled={editLoading}
                                                        onClick={e => e.stopPropagation()}
                                                    />
                                                    <button
                                                        onClick={handleEditSave}
                                                        style={{ background: "#ffd203", color: "#010001", border: "none", borderRadius: 6, fontWeight: 700, padding: "2px 8px", marginRight: 2, cursor: "pointer" }}
                                                        disabled={editLoading}
                                                    >✔</button>
                                                    <button
                                                        onClick={() => setEditMesa(null)}
                                                        style={{ background: "#232323", color: "#ffd203", border: "1px solid #ffd203", borderRadius: 6, fontWeight: 700, padding: "2px 8px", cursor: "pointer" }}
                                                        disabled={editLoading}
                                                    >✖</button>
                                                </div>
                                                </div>
                                            ) : (
                                                <div
                                                    style={{
                                                        width: "100%",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        marginBottom: 2,
                                                    }}
                                                >
                                                    <span style={{ fontWeight: 900, fontSize: "1.25rem", textAlign: "center", flex: 1 }}>{mesa.name}</span>
                                                    <span style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginLeft: 8 }}>{mesa.personas ? `(${mesa.personas} pers.)` : ''}</span>
                                                    {mesa.active && !editMesa && (
                                                        <button
                                                            onClick={e => { e.stopPropagation(); handleEditMesa(mesa); }}
                                                            style={{ marginLeft: 6, background: 'none', color: '#ffd203', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 13, lineHeight: 1, padding: 0, verticalAlign: 'middle' }}
                                                            title="Editar mesa"
                                                        >✎</button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 13,
                                                color: ocupada
                                                    ? "#ff4d4f"
                                                    : "#fff",
                                                fontWeight: 700,
                                                marginBottom: 2,
                                            }}
                                        >
                                            {!mesa.active
                                                ? "Inhabilitada"
                                                : ocupada
                                                ? "Ocupada"
                                                : "Libre"}
                                        </div>
                                        {ocupada && (
                                            <span
                                                style={{
                                                    fontSize: 13,
                                                    color: "#ff4d4f",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                ● Orden activa
                                            </span>
                                        )}
                                        {!ocupada && mesa.active ? (
                                            <Link
                                                to={`/pedidos?mesa=${mesa.id}`}
                                                style={{
                                                    display: "inline-block",
                                                    marginTop: 10,
                                                    background: "#ffd203",
                                                    color: "#010001",
                                                    border: "none",
                                                    borderRadius: 8,
                                                    padding: "0.5rem 1.1rem",
                                                    fontWeight: 800,
                                                    fontSize: 15,
                                                    cursor: "pointer",
                                                    opacity: 1,
                                                    width: "90%",
                                                    marginLeft: 0,
                                                    marginRight: 0,
                                                    textAlign: "center",
                                                    textDecoration: "none",
                                                    transition: "all 0.2s",
                                                }}
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                Crear orden
                                            </Link>
                                        ) : (
                                            <button
                                                style={{
                                                    marginTop: 10,
                                                    background: "#aaa",
                                                    color: "#888",
                                                    border: "none",
                                                    borderRadius: 8,
                                                    padding: "0.5rem 1.1rem",
                                                    fontWeight: 800,
                                                    fontSize: 15,
                                                    cursor: "not-allowed",
                                                    opacity: 0.7,
                                                    width: "80%",
                                                    maxWidth: 150,
                                                    marginLeft: "auto",
                                                    marginRight: "auto",
                                                    transition: "all 0.2s",
                                                }}
                                                disabled
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                Crear orden
                                            </button>
                                        )}
                                        <button
                                            style={{
                                                marginTop: 8,
                                                background: "#232323",
                                                color: "#ffd203",
                                                border: "1.5px solid #ffd203",
                                                borderRadius: 8,
                                                padding: "0.35rem 0.8rem",
                                                fontWeight: 700,
                                                fontSize: 13,
                                                cursor: !mesa.active
                                                    ? "not-allowed"
                                                    : "pointer",
                                                opacity: !mesa.active ? 0.5 : 1,
                                                width: "90%",
                                                transition: "all 0.2s",
                                            }}
                                            disabled={!mesa.active}
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                if (!mesa.active) return;
                                                try {
                                                    let toast = "";
                                                    if (
                                                        ocupada &&
                                                        ordenActiva
                                                    ) {
                                                        await axios.delete(
                                                            `/api/orders/${ordenActiva.id}`
                                                        );
                                                        toast =
                                                            "Orden cancelada y mesa marcada como libre.";
                                                    } else {
                                                        toast =
                                                            "Mesa marcada como ocupada.";
                                                    }
                                                    setToastMsg(toast);
                                                    refetch();
                                                    fetchOrdenes();
                                                } catch (err) {
                                                    setToastMsg(
                                                        "No se pudo actualizar el estado de la mesa"
                                                    );
                                                } finally {
                                                    setTimeout(
                                                        () => setToastMsg(""),
                                                        2500
                                                    );
                                                }
                                            }}
                                        >
                                            {ocupada
                                                ? "Marcar libre"
                                                : "Marcar ocupada"}
                                        </button>
                                        {/* Botón para inhabilitar/reactivar mesa */}
                                        <button
                                            style={{
                                                marginTop: 6,
                                                background: mesa.active
                                                    ? "#ff4d4f"
                                                    : "#ffd203",
                                                color: mesa.active
                                                    ? "#fff"
                                                    : "#010001",
                                                border: "none",
                                                borderRadius: 8,
                                                padding: "0.35rem 0.8rem",
                                                fontWeight: 700,
                                                fontSize: 13,
                                                cursor: editLoading
                                                    ? "not-allowed"
                                                    : "pointer",
                                                opacity: editLoading ? 0.6 : 1,
                                                width: "90%",
                                                transition: "all 0.2s",
                                            }}
                                            disabled={editLoading}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleMesa(mesa);
                                            }}
                                        >
                                            {mesa.active
                                                ? "Inhabilitar"
                                                : "Reactivar"}
                                        </button>
                                        {/* Click en la tarjeta solo abre detalle si está ocupada */}
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
                {/* Toast feedback */}
                {toastMsg && (
                    <div
                        style={{
                            position: "fixed",
                            top: 32,
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: "#ffd203",
                            color: "#010001",
                            fontWeight: 900,
                            fontSize: "1.1rem",
                            padding: "0.8rem 2rem",
                            borderRadius: 14,
                            boxShadow: "0 4px 24px 0 rgba(0,0,0,0.13)",
                            zIndex: 9999,
                        }}
                    >
                        {toastMsg}
                    </div>
                )}
                {/* Modal de detalle de orden */}
                <ModalOrdenDetalle
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                >
                    {ordenDetalle && (
                        <>
                            <h3 style={{ color: "#ffd203", marginBottom: 10 }}>
                                Orden #{ordenDetalle.id} - Mesa{" "}
                                {ordenDetalle.mesa}
                            </h3>
                            <div style={{ marginBottom: 10 }}>
                                <span
                                    style={{ color: "#fff", fontWeight: 700 }}
                                >
                                    Estado:{" "}
                                </span>
                                <span
                                    style={{
                                        color: "#ffd203",
                                        fontWeight: 700,
                                    }}
                                >
                                    {ordenDetalle.estado}
                                </span>
                            </div>
                            <PedidoItemsList
                                items={ordenDetalle.productos}
                                quitarItem={() => {}}
                            />
                            <div
                                style={{
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: 18,
                                    marginTop: 12,
                                }}
                            >
                                Total:{" "}
                                <span style={{ color: "#ffd203" }}>
                                    ${ordenDetalle.total}
                                </span>
                            </div>
                        </>
                    )}
                </ModalOrdenDetalle>
            </div>
        </div>
    );
}
