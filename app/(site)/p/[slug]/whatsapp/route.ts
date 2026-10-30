import { whatsappUrl } from "@/components/professional/professional-card";
import { db } from "@/lib/server/db";

export const GET = async (_: Request, { params }: RouteContext<"/p/[slug]/whatsapp">) => {
  const pro = await db.professional.findFirst({ where: { slug: (await params).slug, status: "VERIFICADO" } });
  if (!pro || !pro.whatsapp) return new Response("Não encontrado", { status: 404 });
  await db.event.create({ data: { professionalId: pro.id, type: "WHATSAPP" } });
  return Response.redirect(whatsappUrl(pro), 302);
};
