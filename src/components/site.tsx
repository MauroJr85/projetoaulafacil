import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { GraduationCap } from "lucide-react";

export const SUBJECTS = ["Matemática", "Português", "Inglês"] as const;
export const MODALITIES = [
  { value: "online", label: "Online" },
  { value: "presencial", label: "Presencial" },
] as const;

export function onlyDigits(v: string) {
  return v.replace(/\D/g, "");
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary">
            <GraduationCap className="h-7 w-7 text-secondary" /> AulaFácil
          </Link>
          <nav className="flex gap-4 text-sm font-medium">
            <Link to="/professores" className="hover:text-primary" activeProps={{ className: "text-primary" }}>
              Professores
            </Link>
            <Link to="/cadastro" className="hover:text-primary" activeProps={{ className: "text-primary" }}>
              Sou professor
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-muted-foreground">
          AulaFácil é um projeto demonstrativo e educacional. Negociação, agendamento e pagamento das
          aulas acontecem diretamente entre as partes, fora da plataforma. Não coletamos dados de menores de idade.
        </div>
      </footer>
    </div>
  );
}
