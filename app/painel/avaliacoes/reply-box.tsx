"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { replyReview } from "@/app/painel/_actions/reviews";

export const ReplyBox = ({ id, reply }: { id: string; reply: string | null }) => {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(reply);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  if (saved) return <p className="mt-3 border-l-2 border-primary pl-3 text-sm text-muted-foreground">Sua resposta: {saved}</p>;

  return (
    <div className="mt-3 space-y-2">
      <Textarea rows={2} value={text} maxLength={1000} onChange={(e) => setText(e.target.value)} placeholder="Responder publicamente (apenas 1 resposta)" />
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          disabled={!text.trim() || pending}
          onClick={() =>
            start(async () => {
              const res = await replyReview(id, text);
              if (res?.error) setError(res.error);
              else setSaved(text.trim());
            })
          }
        >
          Publicar resposta
        </Button>
        {error && <span className="text-xs text-destructive">{error}</span>}
      </div>
    </div>
  );
};
