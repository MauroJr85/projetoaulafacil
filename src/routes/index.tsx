import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, MessageCircle, Search, UserPlus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AulaFácil — Encontre professores particulares" },
      { name: "description", content: "Conectamos alunos e responsáveis a professores particulares de Matemática, Português e Inglês." },
      { property: "og:title", content: "AulaFácil — Encontre professores particulares" },
      { property: "og:description", content: "Professores particulares freelancers de Matemática, Português e Inglês, online ou presencial." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const steps = [
  { icon: UserPlus, title: "Professor se cadastra", text: "Envia nome, disciplina, modalidade e uma breve apresentação." },
  { icon: BadgeCheck, title: "Aprovação", text: "Nossa equipe revisa cada perfil antes de publicá-lo." },
  { icon: Search, title: "Aluno encontra", text: "Filtre por disciplina e escolha o professor ideal." },
  { icon: MessageCircle, title: "Contato combinado", text: "Envie uma solicitação; o contato e o acerto são feitos fora da plataforma." },
];

function Index() {
  return (
    <SiteLayout>
      <section className="bg-hero text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <h1 className="max-w-2xl text-4xl font-bold leading-tight md:text-6xl">
            Aula particular sem complicação.
          </h1>
          <p className="mt-5 max-w-xl text-lg opacity-90">
            O AulaFácil conecta alunos e responsáveis a professores freelancers de Matemática,
            Português e Inglês — online ou presencial.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="secondary">
              <Link to="/professores">Encontrar professor</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Link to="/cadastro">Sou professor</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["Perfis revisados", "Só aparecem professores aprovados pela equipe."],
            ["Simples e direto", "Sem cadastro para alunos: basta enviar uma solicitação."],
            ["Privacidade", "Os contatos ficam protegidos e visíveis apenas para a administração."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-xl border bg-card p-6 shadow-soft">
              <h3 className="text-lg font-semibold text-primary">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-3xl font-bold">Como funciona</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-xl bg-card p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-xs font-semibold text-secondary-foreground/70">Passo {i + 1}</p>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex gap-3 rounded-xl border border-primary/30 bg-card p-5 text-sm">
          <Info className="h-5 w-5 shrink-0 text-primary" />
          <p>
            <strong>Projeto demonstrativo e educacional.</strong> Não há pagamentos, chat ou
            agendamento na plataforma. Para usar, é preciso ter 18 anos ou mais.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
