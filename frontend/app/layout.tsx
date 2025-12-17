import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import FooterWrapper from "@/components/FooterWrapper";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import AnalyticsTracker from "@/components/AnalyticsTracker";

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
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}>
                <AuthProvider>
                    <AnalyticsTracker />
                    <Header />
                    <main className="flex-1 container mx-auto px-4 py-8">
                        {children}
                    </main>
                    <FooterWrapper />
                    <Toaster />
                </AuthProvider>
            </body>
        </html>
    );
}
