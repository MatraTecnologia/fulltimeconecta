"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Bot, Send } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Msg = { from: "user" | "bot"; text: string; links?: { label: string; href: string }[] };

const suggestions = [
  "Meu filho de 3 anos ainda não fala",
  "Professora disse que minha filha não presta atenção",
  "Sou adulta e acho que posso ser autista",
];

const crisis = /suic|me matar|me machucar|autoles/i;

const reply = (text: string): Msg => {
  const t = text.toLowerCase();
  if (crisis.test(t))
    return {
      from: "bot",
      text: "Sinto muito que você esteja passando por isso. Se há risco agora, ligue 188 (CVV, 24 h, gratuito) ou 192 (SAMU). Você não está sozinho(a).",
    };
  if (/fala|falar|palavra/.test(t))
    return {
      from: "bot",
      text: "Atraso de fala tem várias causas e vale começar cedo. Costuma-se procurar um fonoaudiólogo e, para avaliar o desenvolvimento como um todo, um neuropediatra. Uma terapeuta ocupacional ajuda se houver questões sensoriais.",
      links: [
        { label: "Fonoaudiólogos para atraso de fala", href: "/buscar?especialidade=Fonoaudiólogo(a)&condicao=Atraso de fala" },
        { label: "Neuropediatras", href: "/buscar?especialidade=Neuropediatra" },
      ],
    };
  if (/aten|escola|nota|concentr|hiperativ/.test(t))
    return {
      from: "bot",
      text: "Dificuldade de atenção na escola pode ter causas diferentes. Uma avaliação neuropsicológica ajuda a entender o quadro, e um psicopedagogo trabalha a aprendizagem junto com a escola. O diagnóstico médico é feito por neuropediatra ou psiquiatra infantil.",
      links: [
        { label: "Neuropsicólogos", href: "/buscar?especialidade=Neuropsicólogo(a)" },
        { label: "Psicopedagogos para TDAH", href: "/buscar?especialidade=Psicopedagogo(a)&condicao=TDAH" },
      ],
    };
  if (/adult|autista|diagnóstico tardio|eu acho/.test(t))
    return {
      from: "bot",
      text: "Muitos adultos buscam avaliação depois de anos de dúvida, e isso é comum. O caminho costuma ser uma avaliação neuropsicológica e um psiquiatra para fechar o diagnóstico.",
      links: [{ label: "Neuropsicólogos que atendem adultos", href: "/buscar?especialidade=Neuropsicólogo(a)" }],
    };
  return {
    from: "bot",
    text: "Entendi. Pode me contar a idade da pessoa, o que mais chama atenção no dia a dia e a cidade? Assim indico as especialidades certas.",
  };
};

export const AssistantChat = () => {
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "bot", text: "Olá! Sou o assistente do NeuroConecta. Como posso ajudar sua família hoje?" },
  ]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { from: "user", text }, reply(text)]);
    setInput("");
  };

  return (
    <div className="mt-6 flex h-[560px] flex-col rounded-3xl border bg-card">
      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {msgs.map((m, i) => (
          <div key={i} className={cn("flex gap-2", m.from === "user" && "justify-end")}>
            {m.from === "bot" && (
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                <Bot className="size-4" />
              </span>
            )}
            <div className={cn("max-w-[80%] space-y-2 rounded-2xl px-4 py-2.5", m.from === "user" ? "bg-primary text-primary-foreground" : "bg-muted")}>
              <p>{m.text}</p>
              {m.links?.map((l) => (
                <Link key={l.href} href={l.href} className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                  {l.label} <ArrowRight className="size-3.5" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      {msgs.length === 1 && (
        <div className="flex flex-wrap gap-2 px-5 pb-3">
          {suggestions.map((s) => (
            <button key={s} onClick={() => send(s)} className={buttonVariants({ variant: "outline", size: "sm" })}>
              {s}
            </button>
          ))}
        </div>
      )}
      <form
        className="flex gap-2 border-t p-3"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escreva sua mensagem" aria-label="Mensagem" />
        <Button type="submit" size="icon" aria-label="Enviar">
          <Send />
        </Button>
      </form>
    </div>
  );
};
