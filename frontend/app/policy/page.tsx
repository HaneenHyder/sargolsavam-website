import React from 'react';
import {
    ScanEye,
    Banknote,
    CheckCircle2,
    ArrowRightLeft,
    XCircle,
    Phone,
    Receipt
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/Card";

export default function PolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Hero Section */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-16 text-center max-w-4xl">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
                        <Receipt className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 font-achiko tracking-wide">
                        Refund and Cancellation Policy
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                        This policy outlines the terms related to payments, refunds, and cancellations for Sargolsavam 2025–26.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="grid gap-6">
                    <Card className="border-none shadow-md overflow-hidden">
                        <CardContent className="p-8 space-y-10">

                            <Section
                                icon={<ScanEye className="w-5 h-5" />}
                                title="1. Scope"
                            >
                                <p>This policy primarily applies to payments made for <strong>Result Appeals</strong> during Sargolsavam 2025–26. No other event-related registrations or participation fees are subject to refund unless explicitly stated.</p>
                            </Section>

                            <Section
                                icon={<Banknote className="w-5 h-5" />}
                                title="2. Appeal Fees"
                            >
                                <p>A non-refundable appeal fee is mandatory for submitting a result appeal. The fee is intended to discourage frivolous appeals and to cover administrative and jury-related expenses.</p>
                            </Section>

                            <Section
                                icon={<CheckCircle2 className="w-5 h-5" />}
                                title="3. Refund Eligibility"
                            >
                                <div className="grid gap-4 mt-2">
                                    <div className="bg-green-50/50 p-5 rounded-xl border border-green-100">
                                        <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                            Successful Appeals
                                        </h3>
                                        <p className="text-sm text-green-800/80 pl-4">
                                            If the Jury of Appeal upholds the claim and the result is revised in favor of the appellant, the full appeal fee will be refunded.
                                        </p>
                                    </div>

                                    <div className="bg-red-50/50 p-5 rounded-xl border border-red-100">
                                        <h3 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                            Rejected Appeals
                                        </h3>
                                        <p className="text-sm text-red-800/80 pl-4">
                                            If the appeal is rejected after review, the appeal fee shall be forfeited, and no refund will be issued.
                                        </p>
                                    </div>

                                    <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                                        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                            Technical Errors
                                        </h3>
                                        <p className="text-sm text-blue-800/80 pl-4">
                                            In cases of duplicate payments, failed transactions, or deductions without successful appeal registration, a full refund will be initiated after verification.
                                        </p>
                                    </div>
                                </div>
                            </Section>

                            <Section
                                icon={<ArrowRightLeft className="w-5 h-5" />}
                                title="4. Refund Process"
                            >
                                <p>Approved refunds will be processed within <strong>5–7 working days</strong> after the conclusion of the concerned event. Refunds will be credited to the original mode of payment or settled in cash through the college office, as determined by the organizing committee. Proof of payment may be required for verification.</p>
                            </Section>

                            <Section
                                icon={<XCircle className="w-5 h-5" />}
                                title="5. Cancellation Policy"
                            >
                                <p>Once an appeal is submitted, it cannot be withdrawn or canceled. No refund shall be issued for voluntary withdrawal of appeals.</p>
                            </Section>

                            <Section
                                icon={<Phone className="w-5 h-5" />}
                                title="6. Contact"
                            >
                                <p>For any concerns or disputes related to payments or refunds, participants must contact the Appeal Committee through official channels within the stipulated time.</p>
                            </Section>

                        </CardContent>
                    </Card>
                </div>

                <div className="mt-12 text-center text-gray-500 text-sm">
                    <p>The decision of the organizing committee regarding refunds and cancellations shall be final and binding.</p>
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
