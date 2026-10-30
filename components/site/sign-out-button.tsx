"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export const SignOutButton = () => {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Sair"
      onClick={async () => {
        await authClient.signOut();
        router.push("/");
        router.refresh();
      }}
    >
      <LogOut />
    </Button>
  );
};
