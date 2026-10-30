"use client";

import { useEffect } from "react";
import { trackView } from "@/app/(site)/_actions/public";

export const TrackView = ({ slug }: { slug: string }) => {
  useEffect(() => {
    trackView(slug);
  }, [slug]);
  return null;
};
