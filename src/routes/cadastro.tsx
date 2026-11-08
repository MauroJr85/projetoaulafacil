import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SiteLayout, SUBJECTS, MODALITIES, onlyDigits } from "@/components/site";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Sou professor — AulaFácil" },
      { name: "description", content: "Cadastre-se como professor particular no AulaFácil." },
      { property: "og:title", content: "Sou professor — AulaFácil" },
      { property: "og:description", content: "Cadastre seu perfil de professor de Matemática, Português ou Inglês." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Cadastro,
});

const schema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(100),
  subject: z.enum(SUBJECTS, { message: "Escolha a disciplina" }),
  modality: z.enum(["online", "presencial"], { message: "Escolha a modalidade" }),
  bio: z.string().trim().min(20, "Mínimo de 20 caracteres").max(600, "Máximo de 600 caracteres"),
  whatsapp: z.string().transform(onlyDigits).pipe(z.string().regex(/^\d{10,13}$/, "WhatsApp inválido (DDD + número)")),
  consent: z.literal(true, { message: "Necessário aceitar" }),
  adult: z.literal(true, { message: "Necessário confirmar" }),
});

function Cadastro() {
  const [f, setF] = useState({ name: "", subject: "", modality: "", bio: "", whatsapp: "", consent: false, adult: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = schema.safeParse(f);
    if (!r.success) {
      const errs: Record<string, string> = {};
      r.error.issues.forEach((i) => (errs[String(i.path[0])] ??= i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    const { error } = await supabase.rpc("submit_teacher", {
      _name: r.data.name, _subject: r.data.subject, _modality: r.data.modality,
      _bio: r.data.bio, _whatsapp: r.data.whatsapp, _consent: true, _adult: true,
    });
    setLoading(false);
    if (error) { toast.error("Não foi possível enviar. Tente novamente."); return; }
    setDone(true);
  }

  if (done)
    return (
      <SiteLayout>
        <div className="mx-auto max-w-lg px-4 py-24 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-secondary" />
          <h1 className="mt-4 text-3xl font-bold">Cadastro enviado!</h1>
          <p className="mt-2 text-muted-foreground">Seu perfil está pendente de aprovação. Assim que aprovado, aparecerá no catálogo.</p>
          <Button asChild className="mt-6"><Link to="/">Voltar ao início</Link></Button>
        </div>
      </SiteLayout>
    );

  const err = (k: string) => errors[k] && <p className="text-sm text-destructive">{errors[k]}</p>;

  return (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-bold">Sou professor</h1>
        <p className="mt-2 text-muted-foreground">Preencha seus dados. Seu WhatsApp não é exibido publicamente.</p>
        <form onSubmit={submit} className="mt-8 space-y-5 rounded-xl border bg-card p-6 shadow-soft">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" maxLength={100} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
            {err("name")}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Disciplina</Label>
              <Select value={f.subject} onValueChange={(v) => setF({ ...f, subject: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{SUBJECTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
              {err("subject")}
            </div>
            <div className="space-y-2">
              <Label>Modalidade</Label>
              <Select value={f.modality} onValueChange={(v) => setF({ ...f, modality: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{MODALITIES.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
              </Select>
              {err("modality")}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Breve apresentação</Label>
            <Textarea id="bio" rows={5} maxLength={600} value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} />
            {err("bio")}
          </div>
          <div className="space-y-2">
            <Label htmlFor="wa">WhatsApp (com DDD)</Label>
            <Input id="wa" inputMode="tel" maxLength={20} placeholder="11 91234-5678" value={f.whatsapp} onChange={(e) => setF({ ...f, whatsapp: e.target.value })} />
            {err("whatsapp")}
          </div>
          <label className="flex items-start gap-2 text-sm">
            <Checkbox checked={f.adult} onCheckedChange={(v) => setF({ ...f, adult: v === true })} />
            Declaro ter 18 anos ou mais.
          </label>
          {err("adult")}
          <label className="flex items-start gap-2 text-sm">
            <Checkbox checked={f.consent} onCheckedChange={(v) => setF({ ...f, consent: v === true })} />
            Autorizo o uso dos meus dados para exibição do perfil e contato pela administração do AulaFácil.
          </label>
          {err("consent")}
          <Button type="submit" disabled={loading} className="w-full">{loading ? "Enviando..." : "Enviar cadastro"}</Button>
        </form>
      </div>
    </SiteLayout>
  );
}
