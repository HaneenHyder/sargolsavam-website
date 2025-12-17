import React from 'react';

export default function PolicyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 font-achiko">Refund and Cancellation Policy</h1>

            <div className="space-y-8 text-gray-700 leading-relaxed">
                <section>
                    <h2 className="text-xl font-semibold text-primary mb-3">1. Scope</h2>
                    <p>
                        This policy primarily applies to payments made for <strong>Result Appeals</strong> during Sargolsavam 2025-26.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-primary mb-3">2. Appeal Fees</h2>
                    <p>
                        A non-refundable fee is applicable for submitting an appeal against a result. This fee is collected to ensure only genuine grievances are raised and to cover administrative costs.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-primary mb-3">3. Refund Eligibility</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            <strong>Successful Appeals:</strong> If the Jury of Appeal upholds your claim and the result is overturned in your favor, the appeal fee will be refunded in full.
                        </li>
                        <li>
                            <strong>Rejected Appeals:</strong> If the appeal is rejected by the Jury, the fee will be forfeited and <strong>no refund</strong> will be issued.
                        </li>
                        <li>
                            <strong>Technical Failures:</strong> In case of a double payment or transaction failure where money is deducted but the appeal is not recorded, a full refund will be initiated upon verification.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-primary mb-3">4. Refund Process</h2>
                    <p>
                        Refunds for successful appeals or technical errors will be processed within 5-7 working days after the conclusion of the event. The amount will be credited back to the original payment method or returned in cash via the college office, as decided by the committee.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-primary mb-3">5. Contact</h2>
                    <p>
                        For any disputes regarding payments or refunds, please contact the Finance Convener or the General Captain immediately.
                    </p>
                </section>
            </div>
        </div>
    );
}
