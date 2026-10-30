import { db } from "@/lib/server/db";
import { getUser } from "@/lib/server/dal";
import { presignGet } from "@/lib/server/r2";

export const GET = async (_: Request, { params }: RouteContext<"/admin/documentos/[id]">) => {
  const user = await getUser();
  if (user?.role !== "admin") return new Response("Não autorizado", { status: 403 });
  const doc = await db.document.findUnique({ where: { id: (await params).id } });
  if (!doc) return new Response("Não encontrado", { status: 404 });
  return Response.redirect(await presignGet(doc.key), 302);
};
