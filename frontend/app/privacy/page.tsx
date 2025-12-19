import React from 'react';
import {
    Database,
    FileText,
    Camera,
    Lock,
    History,
    Globe,
    RefreshCw,
    ShieldCheck
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/Card";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Hero Section */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-16 text-center max-w-4xl">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 font-achiko tracking-wide">
                        Privacy Policy
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                        This policy outlines how we collect, use, and protect your information during Sargolsavam 2025–26. We are committed to your privacy.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="grid gap-6">
                    <Card className="border-none shadow-md overflow-hidden">
                        <CardContent className="p-8 space-y-10">

                            <Section
                                icon={<Database className="w-5 h-5" />}
                                title="1. Information Collection"
                            >
                                <p>We collect only the minimum personal information required for the effective organization of Sargolsavam 2025–26. This may include name, class, chest number, team details, and event participation information. No unnecessary personal data is collected.</p>
                            </Section>

                            <Section
                                icon={<FileText className="w-5 h-5" />}
                                title="2. Usage of Information"
                            >
                                <p className="mb-3">The collected information is used strictly for:</p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                                    <li>Event registration and coordination.</li>
                                    <li>Preparation of score sheets, tabulation, and leaderboards.</li>
                                    <li>Publication of official results on the website and college notice boards.</li>
                                    <li>Internal administrative and academic documentation.</li>
                                </ul>
                            </Section>

                            <Section
                                icon={<Camera className="w-5 h-5" />}
                                title="3. Media Consent"
                            >
                                <p>By participating in Sargolsavam 2025–26, participants grant consent to be photographed, audio-recorded, or video-recorded by the official media team. Such media may be used for documentation, reporting, archival, and promotional purposes across official platforms, including the website, social media pages, and college publications.</p>
                            </Section>

                            <Section
                                icon={<Lock className="w-5 h-5" />}
                                title="4. Data Security"
                            >
                                <p>Reasonable technical and administrative measures are implemented to safeguard collected data. Access to sensitive information, including login credentials for team captains or administrators, is limited strictly to authorized personnel.</p>
                            </Section>

                            <Section
                                icon={<History className="w-5 h-5" />}
                                title="5. Data Retention"
                            >
                                <p>Personal information collected for Sargolsavam 2025–26 will be retained only for the duration necessary to complete the event, publish results, and fulfill institutional documentation requirements. Data will not be used beyond this purpose.</p>
                            </Section>

                            <Section
                                icon={<Globe className="w-5 h-5" />}
                                title="6. Third-Party Services"
                            >
                                <p>The website may use trusted third-party services for hosting, analytics, or payment processing (such as Razorpay for appeal fees). These services operate under their own privacy policies, and the organizing committee does not have control over their data handling practices.</p>
                            </Section>

                            <Section
                                icon={<RefreshCw className="w-5 h-5" />}
                                title="7. Policy Updates"
                            >
                                <p>This Privacy Policy may be updated if required. Any changes will be published on this page and will be effective immediately upon posting.</p>
                            </Section>

                        </CardContent>
                    </Card>
                </div>

                <div className="mt-12 text-center text-gray-500 text-sm">
                    <p>For any questions or concerns regarding this Privacy Policy, please contact the organizing committee through the official channels mentioned on the website.</p>
                </div>
            </div>
        </div>
    );
}

function Section({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) {
    return (
        <section className="group">
            <div className="flex items-center gap-3 mb-3 text-primary">
                <div className="p-2 bg-primary/5 rounded-lg group-hover:bg-primary/10 transition-colors">
                    {icon}
                </div>
                <h2 className="text-xl font-bold">{title}</h2>
            </div>
            <div className="pl-12 text-gray-700 leading-relaxed">
                {children}
            </div>
        </section>
    );
}
