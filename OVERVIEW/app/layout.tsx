import { inter } from "@/constants";
import "@/styles/globals.css";
import { generateMetadata } from "@/utils";

export const metadata = generateMetadata(); 

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
