import { db } from "@/lib/server/db";
import { getUser } from "@/lib/server/dal";

export const GET = async () => {
  const user = await getUser();
  if (!user) return new Response("Não autorizado", { status: 401 });
  const data = await db.user.findUnique({
    where: { id: user.id },
    select: {
      name: true,
      email: true,
      role: true,
      createdAt: true,
      professional: { include: { education: true, portfolio: true, photos: true, videos: true, leads: true, reviews: true, orders: true, documents: { select: { kind: true, fileName: true, createdAt: true } } } },
      reviews: true,
      leads: true,
    },
  });
  return new Response(JSON.stringify(data, null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8", "Content-Disposition": 'attachment; filename="meus-dados-fulltime.json"' },
  });
};
