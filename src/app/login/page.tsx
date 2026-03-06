import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <div className="container" style={{ maxWidth: 520, paddingTop: 60 }}>
      <div className="card">
        <div className="h1">Entrar</div>
        <p className="muted" style={{ marginTop: 6 }}>
          Usuários: <span className="tag">Diretoria</span> e <span className="tag">Vendas</span> • Senha seed: <span className="tag">Sport@123</span>
        </p>
        <div className="hr" />
        <form action={async (formData) => {
          "use server";
          const email = String(formData.get("email") || "");
          const password = String(formData.get("password") || "");
          await signIn("credentials", { email, password, redirectTo: "/app" });
        }} className="grid">
          <div>
            <label className="small muted">E-mail</label>
            <input name="email" type="email" placeholder="diretoria@sportcarlos.local" required />
          </div>
          <div>
            <label className="small muted">Senha</label>
            <input name="password" type="password" placeholder="Sport@123" required />
          </div>
          <button className="btn btnPrimary" type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}
