import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const Logo = ({ className, href = "/" }: { className?: string; href?: string }) => (
  <Link href={href} className={cn("inline-flex items-center", className)} aria-label="NeuroConecta, início">
    <Image src="/brand/logo-horizontal.png" alt="NeuroConecta" width={266} height={32} className="h-6 w-auto sm:h-8 dark:hidden" priority />
    <Image src="/brand/logo-horizontal-dark.png" alt="NeuroConecta" width={266} height={32} className="hidden h-6 w-auto sm:h-8 dark:block" priority />
  </Link>
);
