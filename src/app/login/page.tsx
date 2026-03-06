import { LockKeyhole, ShieldUser, Users } from "lucide-react";
import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <div className="container" style={{ maxWidth: 520, paddingTop: 60 }}>
      <div className="card">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div className="h1">Entrar</div>
          <span className="pill">
            <LockKeyhole size={14} />
            Acesso interno
          </span>
        </div>
        <p className="muted" style={{ marginTop: 6 }}>
          Usuarios:
          {" "}
          <span className="tag">
            <ShieldUser size={14} />
            Diretoria
          </span>
          {" "}
          e
          {" "}
          <span className="tag">
            <Users size={14} />
            Vendas
          </span>
          {" "}
          | Senha seed:
          {" "}
          <span className="tag">
            <LockKeyhole size={14} />
            Sport@123
          </span>
        </p>
        <div className="hr" />
        <form
          action={async (formData) => {
            "use server";
            const email = String(formData.get("email") || "");
            const password = String(formData.get("password") || "");
            await signIn("credentials", { email, password, redirectTo: "/app" });
          }}
          className="grid"
        >
          <div>
            <label className="small muted">E-mail</label>
            <input name="email" type="email" placeholder="diretoria@sportcarlos.local" required />
          </div>
          <div>
            <label className="small muted">Senha</label>
            <input name="password" type="password" placeholder="Sport@123" required />
          </div>
          <button className="btn btnPrimary row" type="submit" style={{ justifyContent: "center" }}>
            <LockKeyhole size={16} />
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
