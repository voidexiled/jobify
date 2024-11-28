import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const geistSans = localFont({
	src: "../fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "../fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "Talent Finder - Encuentra tu próximo trabajo",
	description:
		"Talent Finder es una aplicación web que te permite encontrar tu próximo trabajo.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<Providers>
			<html lang="es" className="dark">
				<body
					className={`min-h-screen ${geistSans.variable} ${geistMono.variable} antialiased bg-[#1a1a1a] text-white relative`}
				>
					{children}
					<ReactQueryDevtools initialIsOpen={false} />
				</body>
			</html>
		</Providers>
	);
}
