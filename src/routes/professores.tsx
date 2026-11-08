import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SiteLayout, SUBJECTS, onlyDigits } from "@/components/site";

export const Route = createFileRoute("/professores")({
  head: () => ({
    meta: [
      { title: "Professores — AulaFácil" },
      { name: "description", content: "Catálogo de professores particulares aprovados de Matemática, Português e Inglês." },
      { property: "og:title", content: "Professores — AulaFácil" },
      { property: "og:description", content: "Encontre um professor particular e solicite sua aula." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Catalogo,
});

type Teacher = { id: string; name: string; subject: string; modality: string; bio: string };

function Catalogo() {
  const [filter, setFilter] = useState<string>("Todas");
  const [selected, setSelected] = useState<Teacher | null>(null);
  const { data, isLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("teachers").select("id,name,subject,modality,bio").eq("status", "aprovado").order("name");
      if (error) throw error;
      return data as Teacher[];
    },
  });
  const list = (data ?? []).filter((t) => filter === "Todas" || t.subject === filter);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-bold">Encontre um professor</h1>
        <div className="mt-6 flex flex-wrap gap-2">
          {["Todas", ...SUBJECTS].map((s) => (
            <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)}>{s}</Button>
          ))}
        </div>
        {isLoading ? (
          <p className="mt-10 text-muted-foreground">Carregando...</p>
        ) : list.length === 0 ? (
          <p className="mt-10 text-muted-foreground">Nenhum professor disponível nesta disciplina ainda.</p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((t) => (
              <article key={t.id} className="flex flex-col rounded-xl border bg-card p-6 shadow-soft">
                <h2 className="text-xl font-semibold">{t.name}</h2>
                <div className="mt-2 flex gap-2">
                  <Badge>{t.subject}</Badge>
                  <Badge variant="outline" className="capitalize">{t.modality}</Badge>
                </div>
                <p className="mt-4 flex-1 whitespace-pre-line text-sm text-muted-foreground">{t.bio}</p>
                <Button variant="secondary" className="mt-5" onClick={() => setSelected(t)}>Solicitar aula</Button>
              </article>
            ))}
          </div>
        )}
      </div>
      <RequestDialog teacher={selected} onClose={() => setSelected(null)} />
    </SiteLayout>
  );
}

const schema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(100),
  whatsapp: z.string().transform(onlyDigits).pipe(z.string().regex(/^\d{10,13}$/, "WhatsApp inválido (DDD + número)")),
  message: z.string().trim().max(500, "Máximo de 500 caracteres"),
  adult: z.literal(true, { message: "Necessário confirmar" }),
  consent: z.literal(true, { message: "Necessário aceitar" }),
});

function RequestDialog({ teacher, onClose }: { teacher: Teacher | null; onClose: () => void }) {
  const empty = { name: "", whatsapp: "", message: "", adult: false, consent: false };
  const [f, setF] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!teacher) return;
    const r = schema.safeParse(f);
    if (!r.success) {
      const errs: Record<string, string> = {};
      r.error.issues.forEach((i) => (errs[String(i.path[0])] ??= i.message));
      setErrors(errs); return;
    }
    setErrors({});
    setLoading(true);
    const { error } = await supabase.rpc("submit_lesson_request", {
      _teacher_id: teacher.id, _name: r.data.name, _whatsapp: r.data.whatsapp,
      _message: r.data.message, _consent: true, _adult: true,
    });
    setLoading(false);
    if (error) { toast.error("Não foi possível enviar. Tente novamente."); return; }
    toast.success("Solicitação enviada! Entraremos em contato pelo WhatsApp.");
    setF(empty);
    onClose();
  }
  const err = (k: string) => errors[k] && <p className="text-sm text-destructive">{errors[k]}</p>;

  return (
    <Dialog open={!!teacher} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Solicitar aula com {teacher?.name}</DialogTitle>
          <DialogDescription>Preencha com os dados do interessado (maior de idade) ou do responsável.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rn">Nome do interessado/responsável</Label>
            <Input id="rn" maxLength={100} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
            {err("name")}
          </div>
          <div className="space-y-2">
            <Label htmlFor="rw">WhatsApp (com DDD)</Label>
            <Input id="rw" inputMode="tel" maxLength={20} value={f.whatsapp} onChange={(e) => setF({ ...f, whatsapp: e.target.value })} />
            {err("whatsapp")}
          </div>
          <div className="space-y-2">
            <Label htmlFor="rm">Mensagem (opcional)</Label>
            <Textarea id="rm" rows={3} maxLength={500} placeholder="Não inclua dados pessoais de menores." value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
            {err("message")}
          </div>
          <label className="flex items-start gap-2 text-sm">
            <Checkbox checked={f.adult} onCheckedChange={(v) => setF({ ...f, adult: v === true })} />
            Declaro ter 18 anos ou mais.
          </label>
          {err("adult")}
          <label className="flex items-start gap-2 text-sm">
            <Checkbox checked={f.consent} onCheckedChange={(v) => setF({ ...f, consent: v === true })} />
            Autorizo o uso dos meus dados para contato sobre esta solicitação.
          </label>
          {err("consent")}
          <Button type="submit" disabled={loading} className="w-full">{loading ? "Enviando..." : "Enviar solicitação"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
