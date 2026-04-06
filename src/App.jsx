import React, { useMemo, useState } from "react";

const responsablesIniciales = [
  { id: 1, nombre: "Juan Pérez", telefono: "600111222", corral: "Corral A", usuario: "juan" },
  { id: 2, nombre: "María Gómez", telefono: "600333444", corral: "Corral B", usuario: "maria" },
  { id: 3, nombre: "Antonio Ruiz", telefono: "600555666", corral: "Corral C", usuario: "antonio" },
];

const interactoresIniciales = [
  { id: 1, nombre: "Pedro Gómez", telefono: "600777111", corral: "Corral A", usuario: "interactor1", activo: true },
  { id: 2, nombre: "Lucía Romero", telefono: "600777222", corral: "Corral B", usuario: "interactor2", activo: true },
];

const ovejasIniciales = [
  { referencia: "ES-001245", nombre: "Luna", responsableId: 1, corral: "Corral A", hora: "18:41", registrada: true },
  { referencia: "ES-001246", nombre: "Perla", responsableId: 1, corral: "Corral A", hora: null, registrada: false },
  { referencia: "ES-001247", nombre: "Brisa", responsableId: 1, corral: "Corral A", hora: null, registrada: false },
  { referencia: "ES-004112", nombre: "Estrella", responsableId: 2, corral: "Corral B", hora: "18:37", registrada: true },
  { referencia: "ES-005010", nombre: "Sol", responsableId: 2, corral: "Corral B", hora: null, registrada: false },
  { referencia: "ES-008921", nombre: "Nieve", responsableId: 3, corral: "Corral C", hora: "18:39", registrada: true },
  { referencia: "ES-009101", nombre: "Sombra", responsableId: 3, corral: "Corral C", hora: null, registrada: false },
  { referencia: "ES-009102", nombre: "Lola", responsableId: 3, corral: "Corral C", hora: null, registrada: false },
];

const corralesIniciales = ["Corral A", "Corral B", "Corral C"];

function Badge({ children, tone = "gray" }) {
  const styles = {
    gray: "bg-slate-100 text-slate-700",
    green: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-rose-100 text-rose-700",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-medium ${styles[tone]}`}>
      {children}
    </span>
  );
}

function Card({ children, className = "" }) {
  return <div className={`rounded-[22px] border border-slate-200 bg-white p-6 shadow-sm ${className}`}>{children}</div>;
}

function StatCard({ title, value }) {
  return (
    <Card className="p-5">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-3 text-2xl font-bold text-slate-950">{value}</div>
    </Card>
  );
}

function LoginScreen({ onLogin, responsables, interactores }) {
  const [rol, setRol] = useState("cooperativa");
  const [usuario, setUsuario] = useState("admin");

  const entrar = () => {
    onLogin({ rol, usuario: usuario || "admin" });
  };

  return (
    <div className="min-h-screen bg-slate-100 px-5 py-8 md:px-8">
      <div className="mx-auto max-w-xl">
        <Card>
          <h1 className="text-3xl font-bold text-slate-950">Acceso a la aplicación</h1>
          <p className="mt-2 text-slate-600">Selecciona el perfil para entrar a la pantalla correspondiente.</p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Perfil</label>
              <select
                value={rol}
                onChange={(e) => {
                  const nuevoRol = e.target.value;
                  setRol(nuevoRol);
                  if (nuevoRol === "responsable") setUsuario(responsables[0]?.usuario || "");
                  else if (nuevoRol === "interactor") setUsuario(interactores[0]?.usuario || "");
                  else setUsuario("admin");
                }}
                className="h-12 w-full rounded-xl border border-slate-200 px-4 outline-none"
              >
                <option value="cooperativa">Cooperativa</option>
                <option value="interactor">Interactor</option>
                <option value="responsable">Responsable</option>
              </select>
            </div>

            {rol === "responsable" ? (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Responsable</label>
                <select
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 outline-none"
                >
                  {responsables.map((r) => (
                    <option key={r.id} value={r.usuario}>{r.nombre}</option>
                  ))}
                </select>
              </div>
            ) : null}

            {rol === "interactor" ? (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Interactor</label>
                <select
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 outline-none"
                >
                  {interactores.filter(i => i.activo).map((i) => (
                    <option key={i.id} value={i.usuario}>{i.nombre}</option>
                  ))}
                </select>
              </div>
            ) : null}

            <button onClick={entrar} className="h-12 w-full rounded-xl bg-slate-950 text-white font-semibold">
              Entrar
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function InteractorScreen({ onLogout, ovejas, setOvejas, usuario, interactores }) {
  const [referencia, setReferencia] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("gray");

  const registrar = () => {
    const ref = referencia.trim().toUpperCase();
    if (!ref) return;

    const existe = ovejas.find((o) => o.referencia === ref);
    if (!existe) {
      setMensaje("Referencia no encontrada");
      setTipoMensaje("red");
      return;
    }

    if (existe.registrada) {
      setMensaje("Ya registrada");
      setTipoMensaje("amber");
      return;
    }

    const hora = new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
    setOvejas((prev) => prev.map((o) => (o.referencia === ref ? { ...o, registrada: true, hora } : o)));
    setReferencia("");
    setMensaje("Registrada correctamente");
    setTipoMensaje("green");
  };

  return (
    <div className="min-h-screen bg-slate-100 px-5 py-6 md:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-950">Pantalla interactor</h1>
              <p className="mt-2 text-slate-600">Solo puede registrar referencias.</p>
            <p className="mt-1 text-sm text-slate-500">Interactor activo: {interactores.find(i => i.usuario === usuario)?.nombre || usuario}</p>
            </div>
            <button onClick={onLogout} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium">Salir</button>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-slate-950">Registro de entrada</h2>
          <div className="mt-5 flex flex-col gap-4 md:flex-row">
            <input
              value={referencia}
              onChange={(e) => setReferencia(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && registrar()}
              placeholder="Escribir referencia"
              className="h-14 flex-1 rounded-xl border border-slate-200 px-4 text-lg outline-none"
            />
            <button onClick={registrar} className="h-14 rounded-xl bg-slate-950 px-8 text-white font-semibold">
              Registrar
            </button>
          </div>

          <div className="mt-4">
            <Badge tone={tipoMensaje}>{mensaje || "Esperando referencia"}</Badge>
          </div>
        </Card>
      </div>
    </div>
  );
}

function ResponsableScreen({ onLogout, usuario, ovejas }) {
  const responsable = responsablesIniciales.find((r) => r.usuario === usuario);
  const ovejasResponsable = ovejas.filter((o) => o.responsableId === responsable?.id);
  const llegadas = ovejasResponsable.filter((o) => o.registrada).length;
  const pendientes = ovejasResponsable.length - llegadas;

  return (
    <div className="min-h-screen bg-slate-100 px-5 py-6 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-950">Pantalla responsable</h1>
              <p className="mt-2 text-slate-600">Solo puede ver las ovejas de su corral.</p>
            </div>
            <button onClick={onLogout} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium">Salir</button>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard title="Responsable" value={responsable?.nombre || "-"} />
          <StatCard title="Corral" value={responsable?.corral || "-"} />
          <StatCard title="Llegadas / Pendientes" value={`${llegadas} / ${pendientes}`} />
        </div>

        <Card>
          <h2 className="text-xl font-bold text-slate-950">Estado de sus ovejas</h2>
          <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100 text-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left">Referencia</th>
                  <th className="px-4 py-3 text-left">Nombre</th>
                  <th className="px-4 py-3 text-left">Hora</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                </tr>
              </thead>
              <tbody>
                {ovejasResponsable.map((o) => (
                  <tr key={o.referencia} className="border-t border-slate-200">
                    <td className="px-4 py-3 font-semibold">{o.referencia}</td>
                    <td className="px-4 py-3">{o.nombre}</td>
                    <td className="px-4 py-3">{o.hora || "-"}</td>
                    <td className="px-4 py-3">
                      {o.registrada ? <Badge tone="green">Ha entrado</Badge> : <Badge tone="amber">Falta</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

function CooperativaScreen({ onLogout, ovejas, setOvejas, responsables, setResponsables, interactores, setInteractores, corrales, setCorrales }) {
  const [nuevaReferencia, setNuevaReferencia] = useState("");
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoResponsableId, setNuevoResponsableId] = useState(responsables[0]?.id || "");
  const [nuevoCorral, setNuevoCorral] = useState(corrales[0] || "");

  const [nombreResponsable, setNombreResponsable] = useState("");
  const [telefonoResponsable, setTelefonoResponsable] = useState("");
  const [corralResponsable, setCorralResponsable] = useState(corrales[0] || "");

  const [nombreCorral, setNombreCorral] = useState("");

  const [nombreInteractor, setNombreInteractor] = useState("");
  const [telefonoInteractor, setTelefonoInteractor] = useState("");
  const [corralInteractor, setCorralInteractor] = useState(corrales[0] || "");

  const total = ovejas.length;
  const llegadas = ovejas.filter((o) => o.registrada).length;
  const pendientes = total - llegadas;

  const crearOveja = () => {
    if (!nuevaReferencia || !nuevoResponsableId || !nuevoCorral) return;
    if (ovejas.some((o) => o.referencia === nuevaReferencia.toUpperCase())) return;

    setOvejas([
      ...ovejas,
      {
        referencia: nuevaReferencia.toUpperCase(),
        nombre: nuevoNombre,
        responsableId: Number(nuevoResponsableId),
        corral: nuevoCorral,
        hora: null,
        registrada: false,
      },
    ]);

    setNuevaReferencia("");
    setNuevoNombre("");
  };

  const crearResponsable = () => {
    if (!nombreResponsable) return;
    const usuario = nombreResponsable.toLowerCase().split(" ")[0];
    setResponsables([
      ...responsables,
      {
        id: Date.now(),
        nombre: nombreResponsable,
        telefono: telefonoResponsable,
        corral: corralResponsable,
        usuario,
      },
    ]);
    setNombreResponsable("");
    setTelefonoResponsable("");
  };

  const crearCorral = () => {
    if (!nombreCorral) return;
    if (corrales.includes(nombreCorral)) return;
    setCorrales([...corrales, nombreCorral]);
    setNombreCorral("");
  };

  const crearInteractor = () => {
    if (!nombreInteractor) return;
    const usuario = nombreInteractor.toLowerCase().split(" ")[0] + interactores.length;
    setInteractores([
      ...interactores,
      {
        id: Date.now(),
        nombre: nombreInteractor,
        telefono: telefonoInteractor,
        corral: corralInteractor,
        usuario,
        activo: true,
      },
    ]);
    setNombreInteractor("");
    setTelefonoInteractor("");
  };

  return (
    <div className="min-h-screen bg-slate-100 px-5 py-6 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-950">Pantalla cooperativa</h1>
              <p className="mt-2 text-slate-600">Puede crear y editar ovejas, responsables y corrales. También consulta todo.</p>
            </div>
            <button onClick={onLogout} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium">Salir</button>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard title="Total ovejas" value={total} />
          <StatCard title="Llegadas" value={llegadas} />
          <StatCard title="Pendientes" value={pendientes} />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <h2 className="text-lg font-bold text-slate-950">Alta de oveja</h2>
            <div className="mt-4 space-y-3">
              <input value={nuevaReferencia} onChange={(e) => setNuevaReferencia(e.target.value.toUpperCase())} placeholder="Referencia" className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none" />
              <input value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} placeholder="Nombre" className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none" />
              <select value={nuevoResponsableId} onChange={(e) => setNuevoResponsableId(e.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none">
                {responsables.map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
              </select>
              <select value={nuevoCorral} onChange={(e) => setNuevoCorral(e.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none">
                {corrales.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <button onClick={crearOveja} className="h-11 w-full rounded-xl bg-slate-950 text-white font-semibold">Crear oveja</button>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-bold text-slate-950">Alta de responsable</h2>
            <div className="mt-4 space-y-3">
              <input value={nombreResponsable} onChange={(e) => setNombreResponsable(e.target.value)} placeholder="Nombre" className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none" />
              <input value={telefonoResponsable} onChange={(e) => setTelefonoResponsable(e.target.value)} placeholder="TLF" className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none" />
              <select value={corralResponsable} onChange={(e) => setCorralResponsable(e.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none">
                {corrales.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <button onClick={crearResponsable} className="h-11 w-full rounded-xl bg-slate-950 text-white font-semibold">Crear responsable</button>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-bold text-slate-950">Alta de interactor</h2>
            <div className="mt-4 space-y-3">
              <input value={nombreInteractor} onChange={(e) => setNombreInteractor(e.target.value)} placeholder="Nombre" className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none" />
              <input value={telefonoInteractor} onChange={(e) => setTelefonoInteractor(e.target.value)} placeholder="TLF" className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none" />
              <select value={corralInteractor} onChange={(e) => setCorralInteractor(e.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none">
                {corrales.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <button onClick={crearInteractor} className="h-11 w-full rounded-xl bg-slate-950 text-white font-semibold">Crear interactor</button>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <h2 className="text-lg font-bold text-slate-950">Alta de corral</h2>
            <div className="mt-4 space-y-3">
              <input value={nombreCorral} onChange={(e) => setNombreCorral(e.target.value)} placeholder="Nombre del corral" className="h-11 w-full rounded-xl border border-slate-200 px-4 outline-none" />
              <button onClick={crearCorral} className="h-11 w-full rounded-xl bg-slate-950 text-white font-semibold">Crear corral</button>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-bold text-slate-950">Usuarios dados de alta</h2>
            <div className="mt-4 space-y-4 text-sm">
              <div>
                <div className="mb-2 font-semibold text-slate-900">Responsables</div>
                <div className="space-y-2">
                  {responsables.map((r) => (
                    <div key={r.id} className="rounded-xl border border-slate-200 p-3">
                      <div className="font-medium">{r.nombre}</div>
                      <div className="text-slate-500">{r.corral} · {r.telefono}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-2 font-semibold text-slate-900">Interactores</div>
                <div className="space-y-2">
                  {interactores.map((i) => (
                    <div key={i.id} className="rounded-xl border border-slate-200 p-3">
                      <div className="font-medium">{i.nombre}</div>
                      <div className="text-slate-500">{i.corral} · {i.telefono}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <h2 className="text-lg font-bold text-slate-950">Consulta general</h2>
          <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100 text-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left">Referencia</th>
                  <th className="px-4 py-3 text-left">Nombre</th>
                  <th className="px-4 py-3 text-left">Responsable</th>
                  <th className="px-4 py-3 text-left">Corral</th>
                  <th className="px-4 py-3 text-left">Hora</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                </tr>
              </thead>
              <tbody>
                {ovejas.map((o) => {
                  const responsable = responsables.find((r) => r.id === o.responsableId);
                  return (
                    <tr key={o.referencia} className="border-t border-slate-200">
                      <td className="px-4 py-3 font-semibold">{o.referencia}</td>
                      <td className="px-4 py-3">{o.nombre}</td>
                      <td className="px-4 py-3">{responsable?.nombre}</td>
                      <td className="px-4 py-3">{o.corral}</td>
                      <td className="px-4 py-3">{o.hora || "-"}</td>
                      <td className="px-4 py-3">{o.registrada ? <Badge tone="green">Ha entrado</Badge> : <Badge tone="amber">Falta</Badge>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function App() {
  const [sesion, setSesion] = useState(null);
  const [ovejas, setOvejas] = useState(ovejasIniciales);
  const [responsables, setResponsables] = useState(responsablesIniciales);
  const [interactores, setInteractores] = useState(interactoresIniciales);
  const [corrales, setCorrales] = useState(corralesIniciales);

  if (!sesion) {
    return <LoginScreen onLogin={setSesion} responsables={responsables} interactores={interactores} />;
  }

  if (sesion.rol === "interactor") {
    return <InteractorScreen onLogout={() => setSesion(null)} ovejas={ovejas} setOvejas={setOvejas} usuario={sesion.usuario} interactores={interactores} />;
  }

  if (sesion.rol === "responsable") {
    return <ResponsableScreen onLogout={() => setSesion(null)} usuario={sesion.usuario} ovejas={ovejas} />;
  }

  return (
    <CooperativaScreen
      onLogout={() => setSesion(null)}
      ovejas={ovejas}
      setOvejas={setOvejas}
      responsables={responsables}
      setResponsables={setResponsables}
      interactores={interactores}
      setInteractores={setInteractores}
      corrales={corrales}
      setCorrales={setCorrales}
    />
  );
}
