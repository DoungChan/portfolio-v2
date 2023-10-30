"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Menu from "@/components/Menu";
import { useState, useEffect } from "react";
import { shuffle } from "lodash";
import { useParams } from "next/navigation";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const colors = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purple-500",
  ];
  const [color, setColor] = useState<string>("");
  const params = useParams();

  useEffect(() => {
    const shuffledColors = shuffle<string>(colors);
    if (shuffledColors.length > 0) {
      setColor(shuffledColors.pop() || "");
    } else {
      setColor(""); // Set a default value in case the array is empty
    }
  }, [params]);
  return (
    <html lang="en">
      <body className={inter.className}>
        <div
          className={`bg-gradient-to-b to-[#121212] ${color} min-w-full lg:px-64 px-5 py-10 lg:py-0 text-white`}
        >
          {children}
          <Menu />
        </div>
      </body>
    </html>
  );
}
