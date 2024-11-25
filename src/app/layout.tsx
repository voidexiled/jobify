import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
	title: "Jobify - Encuentra tu próximo trabajo",
	description:
		"Jobify es una aplicación web que te permite encontrar tu próximo trabajo.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="es" className="dark">
			<body
				className={`min-h-screen ${geistSans.variable} ${geistMono.variable} antialiased bg-[#1a1a1a] text-white relative`}
			>
				{children}
			</body>
		</html>
	);
}
