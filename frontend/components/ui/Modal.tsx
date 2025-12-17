"use client"

import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
}

export function Modal({ isOpen, onClose, title, children, footer, className }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className={`bg-white rounded-lg shadow-xl w-full overflow-hidden animate-in zoom-in-95 duration-200 ${className || 'max-w-md'}`}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-4">
                    {children}
                </div>
                {footer && (
                    <div className="p-4 bg-gray-50 border-t flex justify-end gap-2">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
