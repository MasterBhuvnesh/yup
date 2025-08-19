import { inter } from "@/constants";
import "@/styles/globals.css";
import { generateMetadata } from "@/utils";
import { Analytics } from "@vercel/analytics/next";
import { Metadata } from "next";

const pageMetadata = generateMetadata();
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  ...pageMetadata,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}