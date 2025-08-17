import { MetadataInput, metadataInputSchema } from "@/types";
import { Metadata } from "next";

export const generateMetadata = (input: MetadataInput = {}): Metadata => {
  const { title, description, image, icons } = metadataInputSchema.parse(input);

  return {
    title,
    description,
    icons,
    openGraph: {
      title,
      description,
      ...(image && { images: [{ url: image }] }),
    },
    ...(input.noIndex && { robots: { index: false, follow: false } }),
  };
};