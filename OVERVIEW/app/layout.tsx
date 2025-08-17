import { inter } from "@/constants";
import { generateMetadata } from "@/utils";
import "./globals.css";

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
