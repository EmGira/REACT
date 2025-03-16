import React, { useState } from "react";
import FirebaseService from "../services/FirebaseService.ts";
import { FirebaseError } from "firebase/app";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Inserisci email e password");
      return;
    }

    setLoading(true);
    setError(null); // Reset eventuali errori precedenti

    try {
      await FirebaseService.signIn(email, password);
      console.log("Login successful!");
    } catch (err) {
      if (err instanceof FirebaseError) {
        console.error("Firebase Error:", err.code, err.message);
        setError(mapFirebaseError(err.code));
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Errore sconosciuto durante il login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Mappa i codici di errore Firebase a messaggi più chiari per l'utente
  const mapFirebaseError = (code: string): string => {
    const errorMap: Record<string, string> = {
      "auth/invalid-email": "L'email inserita non è valida.",
      "auth/user-disabled": "Il tuo account è stato disabilitato.",
      "auth/user-not-found": "Utente non trovato. Controlla l'email.",
      "auth/wrong-password": "Password errata. Riprova.",
      "auth/too-many-requests": "Troppi tentativi di accesso. Riprova più tardi.",
    };
    return errorMap[code] || "Errore di autenticazione. Riprova.";
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Caricamento..." : "Login"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;
