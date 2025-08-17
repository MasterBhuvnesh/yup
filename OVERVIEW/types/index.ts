import { z } from "zod";


export const iconSchema = z.object({
  rel: z.string(),
  sizes: z.string(),
  url: z.string(),
});


export const metadataInputSchema = z.object({
    title: z.string().optional().default(
        `${process.env.NEXT_PUBLIC_APP_NAME} - Overview`
    ),
    description: z.string().optional().default(
        `${process.env.NEXT_PUBLIC_APP_NAME} is an application that uses AI models to provide you with a roadmap and content to help you understand concepts easily.`
    ),
    image: z.string().optional().default("/images/thumbnail.jpeg"),
    icons: z.array(iconSchema).optional().default([
        {
            rel: "icon",
            sizes: "512x512",
            url: "/icons/logo.png",
        },
        {
            rel: "manifest",
            sizes: "512x512",
            url: "/icons/logo.ico",
        },
    ]),
    noIndex: z.boolean().optional(),
});


export type MetadataInput = z.input<typeof metadataInputSchema>;