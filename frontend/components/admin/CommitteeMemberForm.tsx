'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Modal } from "@/components/ui/Modal";
import { toast } from "sonner";

interface Member {
    id: string;
    name: string;
    role: string;
    department: string;
    email: string;
    phone: string;
    image: string;
}

interface CommitteeMemberFormProps {
    member: Member | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

export default function CommitteeMemberForm({ member, isOpen, onClose, onSave }: CommitteeMemberFormProps) {
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!member) return;

        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            role: formData.get('role'),
            department: formData.get('department'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            image: member.image
        };

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            const res = await fetch(`${API_URL}/api/committee/${member.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error('Backend Error:', errorData);
                throw new Error(errorData.error || 'Failed to update member');
            }

            toast.success('Member updated successfully');
            onSave();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Failed to update member');
        } finally {
            setLoading(false);
        }
    };

    if (!member) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Committee Member"
            footer={
                <>
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit" form="edit-member-form" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </>
            }
        >
            <form id="edit-member-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" defaultValue={member.name} required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" name="role" defaultValue={member.role} required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" name="department" defaultValue={member.department} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" defaultValue={member.email} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" defaultValue={member.phone} />
                </div>

                {/* Image upload removed per request */}
                {member.image && (
                    <div className="grid gap-2">
                        <Label>Current Photo</Label>
                        <img src={member.image} alt="Preview" className="w-12 h-12 rounded-full object-cover" />
                    </div>
                )}
            </form>
        </Modal>
    );
}
