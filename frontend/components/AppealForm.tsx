'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { toast } from "sonner";

interface AppealFormProps {
    isOpen: boolean;
    onClose: () => void;
}

import Script from 'next/script';

export default function AppealForm({ isOpen, onClose }: AppealFormProps) {
    const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
    const [loading, setLoading] = useState(false);

    const handlePaymentAndSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isRazorpayLoaded) {
            toast.error('Payment gateway is still loading. Please wait a moment.');
            return;
        }
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const formValues = {
            event_name: formData.get('event_name'),
            reason: formData.get('reason'),
            description: formData.get('description'),
        };

        try {
            // Force relative path to ensure proxy usage
            const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`;

            // 1. Create Order
            const orderRes = await fetch(`${apiUrl}/payments/order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ amount: 5000 }) // 50 INR
            });

            if (!orderRes.ok) throw new Error('Failed to create payment order');
            const order = await orderRes.json();

            // 2. Open Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Ensure this is in frontend .env
                amount: order.amount,
                currency: order.currency,
                name: "Sargolsavam 2025-26",
                description: "Appeal Fee",
                order_id: order.id,
                handler: async function (response: any) {
                    // 3. Submit Appeal on Success
                    try {
                        const appealRes = await fetch(`${apiUrl}/appeals`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({
                                ...formValues,
                                payment_order_id: response.razorpay_order_id,
                                payment_id: response.razorpay_payment_id,
                                payment_signature: response.razorpay_signature
                            }),
                        });

                        if (!appealRes.ok) {
                            console.log('API URL:', `${apiUrl}/appeals`);
                            console.log('Response Status:', appealRes.status, appealRes.statusText);
                            const errorData = await appealRes.json();
                            console.error('Appeal submission error details:', errorData);
                            throw new Error(errorData.error || errorData.details || 'Failed to submit appeal');
                        }

                        toast.success('Appeal submitted successfully');
                        onClose();
                    } catch (err: any) {
                        console.error(err);
                        toast.error(err.message || 'Failed to submit appeal after payment');
                    }
                },
                prefill: {
                    name: "Participant", // Could fetch from user context
                    email: "participant@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.on('payment.failed', function (response: any) {
                toast.error(`Payment Failed: ${response.error.description}`);
            });
            rzp1.open();

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Failed to initiate payment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="lazyOnload"
                onLoad={() => setIsRazorpayLoaded(true)}
            />
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="File an Appeal"
                footer={
                    <>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" form="appeal-form" disabled={loading || !isRazorpayLoaded}>
                            {loading ? 'Processing...' : !isRazorpayLoaded ? 'Loading Payment...' : 'Pay ₹50 & Submit Appeal'}
                        </Button>
                    </>
                }
            >
                <form id="appeal-form" onSubmit={handlePaymentAndSubmit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="event_name">Event Name</Label>
                        <Input id="event_name" name="event_name" placeholder="e.g., Group Song" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="reason">Reason</Label>
                        <Input id="reason" name="reason" placeholder="Brief reason for appeal" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" placeholder="Detailed explanation..." required />
                    </div>
                </form>
            </Modal>
        </>
    );
}
