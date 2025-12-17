import React from 'react';

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 font-achiko">Terms and Conditions</h1>

            <div className="space-y-8 text-gray-700 leading-relaxed">
                <section>
                    <h2 className="text-xl font-semibold text-primary mb-3">1. General Participation</h2>
                    <p>
                        By participating in Sargolsavam 2025-26, all candidates, team captains, and attendees agree to abide by the rules and regulations set forth by the organizing committee of Azharul Uloom College of Islamic and Linguistic Studies.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-primary mb-3">2. Eligibility</h2>
                    <p>
                        Participation is open only to bonafide students of the college.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-primary mb-3">3. Code of Conduct</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Participants are expected to maintain high standards of discipline and decorum.</li>
                        <li>Any form of malpractice, misbehavior, or violation of college rules will lead to immediate disqualification and disciplinary action.</li>
                        <li>Respect towards judges, volunteers, and fellow participants is mandatory.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-primary mb-3">4. Event Rules</h2>
                    <p>
                        Specific rules for each item (time limits, themes, etc.) will be provided by the respective event heads. It is the participant's responsibility to adhere to these guidelines. Failure to comply may result in point deductions or disqualification.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-primary mb-3">5. Judgement and Appeals</h2>
                    <p>
                        The decision of the judges will be final and binding. Any complaints or appeals regarding the results must be submitted through the designated Team Captains within the stipulated time frame, accompanied by the required fee.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-primary mb-3">6. Modifications</h2>
                    <p>
                        The organizing committee reserves the right to reschedule events, change venues, or modify rules if unforeseen circumstances arise.
                    </p>
                </section>
            </div>
        </div>
    );
}
