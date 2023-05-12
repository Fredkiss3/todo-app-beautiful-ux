import Link from "next/link";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "The best todo App in the world",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("Root Layout");
  return (
    <html lang="en">
      <body className={inter.className}>
        <ul className="flex flex-col gap-2 underline text-blue-500">
          <Link href={`/`}>Go home</Link>
          <Link href={`/counter/sub`}>Go to sub</Link>
          <Link href={`/counter/`}>Go to counter home</Link>
        </ul>
        {children}
      </body>
    </html>
  );
}
