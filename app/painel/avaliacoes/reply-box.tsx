"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const ReplyBox = ({ reply }: { reply: string | null }) => {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(reply);

  if (saved) return <p className="mt-3 border-l-2 border-primary pl-3 text-sm text-muted-foreground">Sua resposta: {saved}</p>;

  return (
    <div className="mt-3 space-y-2">
      <Textarea rows={2} value={text} onChange={(e) => setText(e.target.value)} placeholder="Responder publicamente (apenas 1 resposta)" />
      <Button size="sm" disabled={!text.trim()} onClick={() => setSaved(text)}>
        Publicar resposta
      </Button>
    </div>
  );
};
