import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatCategory(category: string | null | undefined): string {
    if (!category) return "";

    // Normalize string: replace underscores/hyphens with spaces
    const formatted = category.replace(/[_-]/g, ' ');

    // Handle specific cases or general capitalization
    if (formatted.toLowerCase() === 'sub junior') {
        return 'Sub Junior';
    }

    // Capitalize first letter of each word
    return formatted.replace(/\b\w/g, l => l.toUpperCase());
}

export function formatEventType(type: string | null | undefined): string {
    if (!type) return "";
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export const getCategoryColor = (category: string) => {
    if (category === 'Senior') return 'bg-blue-100 text-blue-700';
    if (category === 'Junior') return 'bg-green-100 text-green-700';
    if (category === 'Sub Junior') return 'bg-purple-100 text-purple-700';
    if (category === 'Group') return 'bg-orange-100 text-orange-700';
    return 'bg-gray-100 text-gray-700';
};
