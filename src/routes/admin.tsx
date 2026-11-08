import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SiteLayout } from "@/components/site";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Painel administrativo — AulaFácil" },
      { name: "description", content: "Área restrita da administração do AulaFácil." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Painel administrativo — AulaFácil" },
      { property: "og:description", content: "Área restrita." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Admin,
});

function Admin() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return setIsAdmin(null);
    supabase.rpc("has_role", { _user_id: session.user.id, _role: "admin" }).then(({ data }) => setIsAdmin(!!data));
  }, [session]);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-12">
        {session === undefined ? null : !session ? (
          <Login />
        ) : isAdmin === null ? (
          <p className="text-muted-foreground">Verificando acesso...</p>
        ) : !isAdmin ? (
          <div className="mx-auto max-w-md text-center">
            <h1 className="text-2xl font-bold">Acesso negado</h1>
            <p className="mt-2 text-muted-foreground">Esta conta não tem permissão de administrador.</p>
            <Button className="mt-4" variant="outline" onClick={() => supabase.auth.signOut()}>Sair</Button>
          </div>
        ) : (
          <Dashboard email={session.user.email ?? ""} />
        )}
      </div>
    </SiteLayout>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) toast.error("E-mail ou senha inválidos.");
  }
  return (
    <form onSubmit={submit} className="mx-auto max-w-sm space-y-4 rounded-xl border bg-card p-6 shadow-soft">
      <h1 className="text-2xl font-bold">Entrar no painel</h1>
      <div className="space-y-2"><Label htmlFor="e">E-mail</Label><Input id="e" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <div className="space-y-2"><Label htmlFor="p">Senha</Label><Input id="p" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
      <Button type="submit" disabled={loading} className="w-full">{loading ? "Entrando..." : "Entrar"}</Button>
    </form>
  );
}

const tStatus: Record<string, string> = { pendente: "Pendente", aprovado: "Aprovado", rejeitado: "Rejeitado" };
const rStatus: Record<string, string> = { novo: "Novo", contatado: "Contatado", concluido: "Concluído" };
const fmt = (d: string) => new Date(d).toLocaleDateString("pt-BR");

function Dashboard({ email }: { email: string }) {
  const qc = useQueryClient();
  const teachers = useQuery({
    queryKey: ["admin-teachers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("teachers").select("*, teacher_contacts(whatsapp)").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const requests = useQuery({
    queryKey: ["admin-requests"],
    queryFn: async () => {
      const { data, error } = await supabase.from("lesson_requests").select("*, teachers(name, subject)").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function setTeacher(id: string, status: "aprovado" | "rejeitado") {
    const { error } = await supabase.from("teachers").update({ status }).eq("id", id);
    if (error) return toast.error("Falha ao atualizar.");
    toast.success(status === "aprovado" ? "Professor aprovado." : "Professor rejeitado.");
    qc.invalidateQueries({ queryKey: ["admin-teachers"] });
  }
  async function setRequest(id: string, status: "novo" | "contatado" | "concluido") {
    const { error } = await supabase.from("lesson_requests").update({ status }).eq("id", id);
    if (error) return toast.error("Falha ao atualizar.");
    qc.invalidateQueries({ queryKey: ["admin-requests"] });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Painel administrativo</h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {email}
          <Button size="sm" variant="outline" onClick={async () => { qc.clear(); await supabase.auth.signOut(); }}>Sair</Button>
        </div>
      </div>
      <Tabs defaultValue="teachers" className="mt-6">
        <TabsList>
          <TabsTrigger value="teachers">Professores</TabsTrigger>
          <TabsTrigger value="requests">Solicitações</TabsTrigger>
        </TabsList>
        <TabsContent value="teachers" className="space-y-4">
          {teachers.data?.length === 0 && <p className="text-muted-foreground">Nenhum cadastro ainda.</p>}
          {teachers.data?.map((t) => (
            <div key={t.id} className="rounded-xl border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{t.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t.subject} · <span className="capitalize">{t.modality}</span> · WhatsApp: {t.teacher_contacts?.whatsapp ?? "—"} · {fmt(t.created_at)}
                  </p>
                </div>
                <Badge variant={t.status === "aprovado" ? "default" : t.status === "rejeitado" ? "destructive" : "secondary"}>{tStatus[t.status]}</Badge>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm">{t.bio}</p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" disabled={t.status === "aprovado"} onClick={() => setTeacher(t.id, "aprovado")}>Aprovar</Button>
                <Button size="sm" variant="outline" disabled={t.status === "rejeitado"} onClick={() => setTeacher(t.id, "rejeitado")}>Rejeitar</Button>
              </div>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="requests" className="space-y-4">
          {requests.data?.length === 0 && <p className="text-muted-foreground">Nenhuma solicitação ainda.</p>}
          {requests.data?.map((r) => (
            <div key={r.id} className="flex flex-wrap items-start justify-between gap-4 rounded-xl border bg-card p-5">
              <div>
                <h3 className="font-semibold">{r.requester_name}</h3>
                <p className="text-sm text-muted-foreground">
                  WhatsApp: {r.whatsapp} · Professor: {r.teachers?.name} ({r.teachers?.subject}) · {fmt(r.created_at)}
                </p>
                {r.message && <p className="mt-2 text-sm">{r.message}</p>}
              </div>
              <Select value={r.status} onValueChange={(v) => setRequest(r.id, v as "novo")}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(rStatus).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
