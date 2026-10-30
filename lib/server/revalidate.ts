import "server-only";
import { updateTag } from "next/cache";

export const refreshProfessional = (slug: string) => {
  updateTag(`professional:${slug}`);
  updateTag("professionals");
};
