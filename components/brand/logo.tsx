import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const Logo = ({ className, href = "/" }: { className?: string; href?: string }) => (
  <Link href={href} className={cn("inline-flex items-center", className)} aria-label="Fulltime, início">
    <Image src="/brand/logo-horizontal.svg" alt="Fulltime" width={1341} height={300} className="h-7 w-auto sm:h-9 dark:hidden" priority />
    <Image src="/brand/logo-horizontal-dark.svg" alt="Fulltime" width={1341} height={300} className="hidden h-7 w-auto sm:h-9 dark:block" priority />
  </Link>
);
