"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export const ModerationActions = ({ approve, reject }: { approve: string; reject: string }) => {
  const [done, setDone] = useState<string | null>(null);
  if (done) return <span className="text-sm font-medium text-muted-foreground">{done}</span>;
  return (
    <div className="flex justify-end gap-2">
      <Button size="sm" onClick={() => setDone(`${approve} ✓`)}>
        {approve}
      </Button>
      <Button size="sm" variant="destructive" onClick={() => setDone(`${reject} ✓`)}>
        {reject}
      </Button>
    </div>
  );
};
