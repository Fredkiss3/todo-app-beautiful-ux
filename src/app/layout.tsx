import { Toaster } from "~/components/ui/toaster";
import "./globals.css";
import { Inter } from "next/font/google";
import { FlashMessage } from "./(flash-message)/flash-message";
import { isDarkMode } from "./(dark-mode-toggle)/_actions";
import { use } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "The best todo App in the world",
};

export default function RootLayout({
  children,
  login,
  todo_app,
}: {
  children: React.ReactNode;
  login: React.ReactNode;
  todo_app: React.ReactNode;
}) {
  return (
    <html lang="en" className={use(isDarkMode()) ? "dark" : ""}>
      <body className={inter.className}>
        {children}

        <FlashMessage key={Math.random()} />
        <Toaster />
      </body>
    </html>
  );
}
