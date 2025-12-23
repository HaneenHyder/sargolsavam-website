import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import HeaderWrapper from "@/components/HeaderWrapper";
import MainWrapper from "@/components/MainWrapper";
import FooterWrapper from "@/components/FooterWrapper";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";


import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Sargolsavam 2025-26",
    description: "Azharul Uloom College Arts Fest",
    icons: {
        icon: '/favicon-v4.png',
    },
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false, // Prevent zooming issues on inputs
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning className="scroll-smooth">
            <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}>
                <SmoothScroll />
                <AuthProvider>

                    <HeaderWrapper />
                    <MainWrapper>
                        {children}
                    </MainWrapper>
                    <FooterWrapper />
                    <Toaster />
                </AuthProvider>
            </body>
        </html>
    );
}
