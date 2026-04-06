import React, { useState } from "react";

const responsablesIniciales = [
  { id: 1, nombre: "Juan Pérez", usuario: "juan", password: "1234" }
];

const interactoresIniciales = [
  { id: 1, nombre: "Pedro Gómez", usuario: "interactor1", password: "1234", activo: true }
];

export default function App() {
  const [sesion, setSesion] = useState(null);
  const [rol, setRol] = useState("cooperativa");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  if (!sesion) {
    const entrar = () => {
      if (rol === "cooperativa") {
        if (password === "17052026") setSesion({ rol });
        else alert("Contraseña incorrecta");
        return;
      }

      if (rol === "responsable") {
        const user = responsablesIniciales.find(
          r => r.usuario === usuario && r.password === password
        );
        if (user) setSesion({ rol, usuario });
        else alert("Credenciales incorrectas");
        return;
      }

      if (rol === "interactor") {
        const user = interactoresIniciales.find(
          i => i.usuario === usuario && i.password === password
        );
        if (user) setSesion({ rol, usuario });
        else alert("Credenciales incorrectas");
      }
    };

    return (
      <div style={{ padding: 40 }}>
        <h2>Login</h2>

        <select value={rol} onChange={e => setRol(e.target.value)}>
          <option value="cooperativa">Cooperativa</option>
          <option value="interactor">Interactor</option>
          <option value="responsable">Responsable</option>
        </select>

        {rol !== "cooperativa" && (
          <input
            placeholder="Usuario"
            value={usuario}
            onChange={e => setUsuario(e.target.value)}
          />
        )}

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button onClick={entrar}>Entrar</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Panel de control</h1>
      <p>Sesión: {sesion.rol}</p>
      <button onClick={() => setSesion(null)}>Logout</button>
    </div>
  );
}
