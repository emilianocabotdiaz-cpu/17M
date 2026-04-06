import React, { useMemo, useState } from "react";

const responsablesIniciales = [
  { id: 1, nombre: "Juan Pérez", telefono: "600111222", corral: "Corral A" },
  { id: 2, nombre: "María Gómez", telefono: "600333444", corral: "Corral B" },
  { id: 3, nombre: "Antonio Ruiz", telefono: "600555666", corral: "Corral C" },
];

const ovejasIniciales = [
  { referencia: "ES-001245", nombre: "Luna", responsableId: 1, corral: "Corral A", hora: "18:41", registrada: true },
  { referencia: "ES-008921", nombre: "Nieve", responsableId: 3, corral: "Corral C", hora: "18:39", registrada: true },
  { referencia: "ES-004112", nombre: "Estrella", responsableId: 2, corral: "Corral B", hora: "18:37", registrada: true },
  { referencia: "ES-001246", nombre: "Perla", responsableId: 1, corral: "Corral A", hora: null, registrada: false },
  { referencia: "ES-001247", nombre: "Brisa", responsableId: 1, corral: "Corral A", hora: null, registrada: false },
  { referencia: "ES-001248", nombre: "Mora", responsableId: 1, corral: "Corral A", hora: null, registrada: false },
];

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-4 py-1 text-xs font-medium">
      {children}
    </span>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-xl border p-4 bg-white shadow">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-xl font-bold mt-2">{value}</div>
    </div>
  );
}

export default function App() {
  const [referencia, setReferencia] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [ovejas, setOvejas] = useState(ovejasIniciales);

  const resumen = useMemo(() => {
    const esperadas = ovejas.length;
    const llegadas = ovejas.filter((o) => o.registrada).length;
    const pendientes = esperadas - llegadas;
    return { esperadas, llegadas, pendientes };
  }, [ovejas]);

  const ultimas = ovejas.filter(o => o.registrada).slice(0, 5);

  const registrar = () => {
    const ref = referencia.trim().toUpperCase();
    if (!ref) return;

    const existe = ovejas.find(o => o.referencia === ref);

    if (!existe) {
      setMensaje("❌ Referencia no encontrada");
      return;
    }

    if (existe.registrada) {
      setMensaje("⚠️ Ya registrada");
      return;
    }

    const hora = new Date().toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setOvejas(prev =>
      prev.map(o =>
        o.referencia === ref ? { ...o, registrada: true, hora } : o
      )
    );

    setReferencia("");
    setMensaje("✅ Registrada correctamente");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">

      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold">Control de entrada de ovejas</h1>
        <p className="text-gray-500">
          Registro por referencia para comprobar qué ovejas han llegado
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Ovejas esperadas" value={resumen.esperadas} />
        <StatCard title="Ovejas llegadas" value={resumen.llegadas} />
        <StatCard title="Pendientes" value={resumen.pendientes} />
        <StatCard title="Interactor" value="Corralero 1" />
      </div>

      <div className="grid grid-cols-3 gap-6">

        <div className="col-span-2 bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold mb-4">Entrada rápida</h2>

          <div className="flex gap-2">
            <input
              value={referencia}
              onChange={(e) => setReferencia(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && registrar()}
              className="border p-2 flex-1"
              placeholder="Referencia"
            />
            <button onClick={registrar} className="bg-black text-white px-4">
              Registrar
            </button>
          </div>

          <p className="mt-2">{mensaje}</p>

          <table className="w-full mt-4 text-sm">
            <thead>
              <tr className="text-left border-b">
                <th>Referencia</th>
                <th>Responsable</th>
                <th>Hora</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {ultimas.map((o) => {
                const resp = responsablesIniciales.find(r => r.id === o.responsableId);
                return (
                  <tr key={o.referencia}>
                    <td>{o.referencia}</td>
                    <td>{resp?.nombre}</td>
                    <td>{o.hora}</td>
                    <td><Badge>Registrada</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold mb-4">Resumen por responsable</h2>

          {responsablesIniciales.map((r) => {
            const ovejasResp = ovejas.filter(o => o.responsableId === r.id);
            const llegadas = ovejasResp.filter(o => o.registrada).length;

            return (
              <div key={r.id} className="border p-3 mb-3 rounded">
                <div className="font-bold">{r.nombre}</div>
                <div>{llegadas}/{ovejasResp.length}</div>
                <div>Pendientes: {ovejasResp.length - llegadas}</div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
