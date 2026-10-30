import Link from "next/link";
import { formatDate } from "@/lib/labels";
import { getUser } from "@/lib/server/dal";
import { reviewEligibility } from "@/lib/server/reviews";
import { ReviewForm } from "./review-form";

export const ReviewCta = async ({ slug, professionalId }: { slug: string; professionalId: string }) => {
  const user = await getUser();
  if (!user)
    return (
      <p className="mt-5 text-sm text-muted-foreground">
        Já foi atendido?{" "}
        <Link href={`/entrar?next=/p/${slug}`} className="font-semibold text-primary hover:underline">
          Entre com sua conta de família
        </Link>{" "}
        para avaliar.
      </p>
    );
  if (user.role !== "familia") return null;
  const status = await reviewEligibility(professionalId, user.id);
  if (status === "reviewed") return null;
  if (status === "eligible")
    return (
      <div className="mt-5">
        <ReviewForm slug={slug} />
      </div>
    );
  return (
    <p className="mt-5 text-sm text-muted-foreground">
      {status === "no-contact"
        ? "Para avaliar, envie uma solicitação pelo formulário com sua conta conectada. A avaliação libera 7 dias depois."
        : `Você poderá avaliar a partir de ${formatDate(status.waitUntil)}.`}
    </p>
  );
};
