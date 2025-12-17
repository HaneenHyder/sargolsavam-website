import React from 'react';

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 font-achiko">Privacy Policy</h1>

            <div className="space-y-8 text-gray-700 leading-relaxed">
                <section>
                    <h2 className="text-xl font-semibold text-primary mb-3">1. Information Collection</h2>
                    <p>
                        We collect minimal personal information necessary for the smooth conduct of Sargolsavam 2025-26. This includes your name, class, chest number, and event participation details.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-primary mb-3">2. Usage of Information</h2>
                    <p>
                        The collected information is used solely for:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Registration and event management.</li>
                        <li>Generating scorecards and leaderboards.</li>
                        <li>Publishing results on the website and notice boards.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-primary mb-3">3. Media Consent</h2>
                    <p>
                        By participating in the event, you consent to being photographed and filmed by the official media team. These images and videos may be used for promotional purposes on our website, social media channels, and college publications.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-primary mb-3">4. Data Security</h2>
                    <p>
                        We take appropriate measures to ensure the security of your data. Access to sensitive information (like login credentials for team captains) is restricted to authorized personnel only.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-primary mb-3">5. Third-Party Services</h2>
                    <p>
                        We may use third-party services for payments (e.g., Razorpay for appeals) or hosting. These services have their own privacy policies, and we encourage you to review them.
                    </p>
                </section>
            </div>
        </div>
    );
}
