import { Camera, Globe } from "lucide-react";
import { InstagramIcon, LinkedinIcon, TiktokIcon, YoutubeIcon } from "@/components/professional/social-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { PanelCard, PanelHeader } from "@/components/panel/panel-ui";
import { SaveBar } from "@/components/panel/save-bar";
import { ProAvatar } from "@/components/professional/pro-badges";
import { specialties } from "@/lib/mock/catalog";
import { currentProfessional as pro } from "@/lib/mock/professionals";

const socialFields = [
  { key: "instagram", label: "Instagram", icon: InstagramIcon, prefix: "instagram.com/", placeholder: "seu.usuario" },
  { key: "youtube", label: "YouTube", icon: YoutubeIcon, prefix: "youtube.com/@", placeholder: "seucanal" },
  { key: "tiktok", label: "TikTok", icon: TiktokIcon, prefix: "tiktok.com/@", placeholder: "seu.usuario" },
  { key: "linkedin", label: "LinkedIn", icon: LinkedinIcon, prefix: "linkedin.com/in/", placeholder: "seu-perfil" },
  { key: "site", label: "Site", icon: Globe, prefix: "https://", placeholder: "seusite.com.br" },
] as const;

const PerfilPage = () => (
  <>
    <PanelHeader title="Meu perfil" description="Como as famílias veem você na busca e no seu portfólio" />
    <div className="space-y-6">
      <PanelCard title="Foto">
        <div className="flex items-center gap-4">
          <ProAvatar pro={pro} size="lg" />
          <div className="space-y-2">
            <Button variant="outline">
              <Camera /> Trocar foto
            </Button>
            <p className="text-xs text-muted-foreground">JPG ou PNG até 5 MB. Rosto visível, sem crianças identificáveis.</p>
          </div>
        </div>
      </PanelCard>

      <PanelCard title="Dados públicos">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nome de exibição</Label>
            <Input id="name" defaultValue={pro.name} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="slug">Endereço do perfil</Label>
            <div className="flex items-center rounded-md border border-input pl-2.5 text-sm text-muted-foreground">
              fulltime.com.br/p/
              <input id="slug" defaultValue={pro.slug} className="h-9 flex-1 bg-transparent px-1 text-foreground outline-none" />
            </div>
            <p className="text-xs text-muted-foreground">Pode ser alterado 1 vez a cada 30 dias.</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="spec">Especialidade principal</Label>
            <NativeSelect id="spec" defaultValue={pro.specialty} className="w-full">
              {specialties.map((s) => (
                <NativeSelectOption key={s}>{s}</NativeSelectOption>
              ))}
            </NativeSelect>
            <p className="text-xs text-muted-foreground">Alterar volta o perfil para análise.</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="years">Anos de experiência</Label>
            <Input id="years" type="number" defaultValue={pro.years} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="bio">Sobre você</Label>
            <Textarea id="bio" rows={5} maxLength={1500} defaultValue={pro.bio} />
            <p className="text-xs text-muted-foreground">Mínimo 200, máximo 1.500 caracteres. Não prometa cura ou resultados garantidos.</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="langs">Idiomas</Label>
            <Input id="langs" defaultValue={pro.languages.join(", ")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="wa">WhatsApp</Label>
            <Input id="wa" defaultValue="(43) 99999-0001" />
          </div>
        </div>
      </PanelCard>

      <PanelCard title="Redes sociais" description="Aparecem como botões no topo do seu perfil público">
        <div className="grid gap-4 md:grid-cols-2">
          {socialFields.map((f) => (
            <div key={f.key} className="space-y-1.5">
              <Label htmlFor={f.key} className="flex items-center gap-1.5">
                <f.icon className="size-4" /> {f.label}
              </Label>
              <div className="flex items-center rounded-md border border-input pl-2.5 text-sm text-muted-foreground">
                {f.prefix}
                <input id={f.key} defaultValue={pro.social[f.key] ?? ""} placeholder={f.placeholder} className="h-9 min-w-0 flex-1 bg-transparent px-1 text-foreground outline-none" />
              </div>
            </div>
          ))}
        </div>
      </PanelCard>

      <PanelCard title="Mensagem automática do WhatsApp" description="Texto que já vem escrito quando a família clica no botão">
        <Textarea rows={2} defaultValue="Olá, Ana! Vi seu perfil no Fulltime e gostaria de mais informações." />
      </PanelCard>
    </div>
    <SaveBar />
  </>
);

export default PerfilPage;
