import { useState } from "react";
import type { FormEvent } from "react";
import "./styles/Login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (response.status === 401) {
        setError("Неверный логин или пароль.");
        return;
      }
      if (response.status === 400) {
        setError("Введите логин и пароль.");
        return;
      }
      if (!response.ok) throw new Error("Login failed");

      setPassword("");
      navigate("/dashboard", { replace: true });
    } catch {
      setError("Не удалось войти. Проверьте соединение и попробуйте снова.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="login-page">
      <div className="login-panel">
        <span className="login-caption">COLDRAVINE</span>
        <h1>Sign in</h1>
        <p className="login-description">Enter your account credentials.</p>
        <form onSubmit={handleSubmit} className="login-form" aria-busy={loading}>
          <label htmlFor="login-username">Username</label>
          <input id="login-username" name="username" autoComplete="username"
            value={username} onChange={(event) => setUsername(event.target.value)}
            required disabled={loading} />
          <label htmlFor="login-password">Password</label>
          <input id="login-password" name="password" type="password" autoComplete="current-password"
            value={password} onChange={(event) => setPassword(event.target.value)}
            required disabled={loading} />
          {error && <p className="login-alert" role="alert">{error}</p>}
          <button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
        </form>
      </div>
    </section>
  );
}

export default Login;
