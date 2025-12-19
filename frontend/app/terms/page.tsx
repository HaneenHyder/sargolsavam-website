import React from 'react';
import {
    Users,
    BadgeCheck,
    Scale,
    Clock,
    FileText,
    Gavel,
    Camera,
    Shield,
    RefreshCw,
    ScrollText
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/Card";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Hero Section */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-16 text-center max-w-4xl">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
                        <ScrollText className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 font-achiko tracking-wide">
                        Terms and Conditions
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                        These terms govern participation and attendance in Sargolsavam 2025–26. By registering or participating, individuals agree to comply with these conditions.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="grid gap-6">
                    <Card className="border-none shadow-md overflow-hidden">
                        <CardContent className="p-8 space-y-10">

                            <Section
                                icon={<Users className="w-5 h-5" />}
                                title="1. General Participation"
                            >
                                <p>By participating in Sargolsavam 2025-26, all candidates, team captains, and attendees agree to abide by the rules and regulations set forth by the organizing committee of Azharul Uloom College of Islamic and Linguistic Studies.</p>
                            </Section>

                            <Section
                                icon={<BadgeCheck className="w-5 h-5" />}
                                title="2. Eligibility"
                            >
                                <p>Participation is strictly limited to bonafide students of Azharul Uloom College of Islamic and Linguistic Studies for the academic year 2025–26. Proof of identity may be requested if required.</p>
                            </Section>

                            <Section
                                icon={<Scale className="w-5 h-5" />}
                                title="3. Code of Conduct"
                            >
                                <p>Participants must maintain discipline, dignity, and respectful behavior at all times. Any form of misconduct, malpractice, or violation of college or festival rules may result in disqualification and further disciplinary action as deemed appropriate by the authorities.</p>
                            </Section>

                            <Section
                                icon={<Clock className="w-5 h-5" />}
                                title="4. Reporting & Attendance"
                            >
                                <p>Participants must report at the assigned venue at the assigned time. Late arrival may result in disqualification, and the organizing committee will not be responsible for missed performances due to delay.</p>
                            </Section>

                            <Section
                                icon={<FileText className="w-5 h-5" />}
                                title="5. Event Rules"
                            >
                                <p>Specific rules for each item (time limits, themes, etc.) will be provided by the respective event heads. It is the participant's responsibility to adhere to these guidelines. Failure to comply may result in point deductions or disqualification.</p>
                            </Section>

                            <Section
                                icon={<Gavel className="w-5 h-5" />}
                                title="6. Judgement and Appeals"
                            >
                                <p>The decision of the judges shall be final and binding. Appeals, if any, must be submitted only through the respective Team Captains within the specified time, along with the prescribed fee. Appeals raised outside this process or time frame will not be entertained.</p>
                            </Section>

                            <Section
                                icon={<Camera className="w-5 h-5" />}
                                title="7. Media & Publicity"
                            >
                                <p>By participating in Sargolsavam 2025–26, participants grant permission to the organizing committee to use photographs, videos, and recordings of events for official documentation, publicity, and promotional purposes.</p>
                            </Section>

                            <Section
                                icon={<Shield className="w-5 h-5" />}
                                title="8. Safety & Responsibility"
                            >
                                <p>Participants are responsible for their personal belongings. The organizing committee shall not be held responsible for any loss, damage, or injury during the course of the festival, except where required by institutional policy.</p>
                            </Section>

                            <Section
                                icon={<RefreshCw className="w-5 h-5" />}
                                title="9. Modifications"
                            >
                                <p>The organizing committee reserves the right to amend, modify, or cancel any event, rule, or schedule in case of unforeseen circumstances. All such decisions will be communicated through official channels and shall be final.</p>
                            </Section>

                        </CardContent>
                    </Card>
                </div>

                <div className="mt-12 text-center text-gray-500 text-sm">
                    <p>Participation in Sargolsavam signifies acceptance of all the above terms and conditions.</p>
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
