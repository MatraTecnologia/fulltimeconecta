import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Social } from "@/lib/types";
import { InstagramIcon, LinkedinIcon, TiktokIcon, YoutubeIcon } from "./social-icons";

const networks = [
  { key: "instagram", label: "Instagram", icon: InstagramIcon, url: (v: string) => `https://instagram.com/${v}`, handle: (v: string) => `@${v}`, tone: "hover:border-brand-coral hover:text-brand-coral" },
  { key: "youtube", label: "YouTube", icon: YoutubeIcon, url: (v: string) => `https://youtube.com/@${v}`, handle: (v: string) => `@${v}`, tone: "hover:border-destructive hover:text-destructive" },
  { key: "tiktok", label: "TikTok", icon: TiktokIcon, url: (v: string) => `https://tiktok.com/@${v}`, handle: (v: string) => `@${v}`, tone: "hover:border-foreground" },
  { key: "linkedin", label: "LinkedIn", icon: LinkedinIcon, url: (v: string) => `https://linkedin.com/in/${v}`, handle: () => "LinkedIn", tone: "hover:border-brand-sky hover:text-brand-sky" },
  { key: "site", label: "Site", icon: Globe, url: (v: string) => `https://${v}`, handle: (v: string) => v, tone: "hover:border-primary hover:text-primary" },
] as const;

export const SocialLinks = ({ social, compact }: { social: Social; compact?: boolean }) => {
  const items = networks.filter((n) => social[n.key]);
  if (!items.length) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((n) => {
        const v = social[n.key]!;
        return (
          <li key={n.key}>
            <a
              href={n.url(v)}
              target="_blank"
              rel="noreferrer"
              aria-label={`${n.label} de ${n.handle(v)}`}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border bg-background text-sm font-medium transition-colors",
                compact ? "size-9 justify-center" : "px-3 py-1.5",
                n.tone,
              )}
            >
              <n.icon className="size-4" />
              {!compact && <span className="max-w-64 truncate">{n.handle(v)}</span>}
            </a>
          </li>
        );
      })}
    </ul>
  );
};
