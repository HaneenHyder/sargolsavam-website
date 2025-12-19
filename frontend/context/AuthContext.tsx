'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name: string;
    role: 'admin' | 'candidate' | 'team';
    chest_no?: string;
    team_code?: string;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User, token?: string) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        }
        return null;
    });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            try {
                // We need an endpoint to get the current user.
                // If it fails, we are not logged in.
                // For now, let's just set loading to false.
                // Ideally, we should hit /api/auth/me
                setLoading(false);
            } catch {
                setLoading(false);
            }
        };

        checkUser();
    }, []);

    const login = (userData: User, token?: string) => {
        setUser(userData);
        // Persist user data if needed (e.g. localStorage for non-sensitive info)
        localStorage.setItem('user', JSON.stringify(userData));
        if (token) {
            localStorage.setItem('token', token);
        }
    };

    const logout = async () => {
        try {
            // Force relative path
            await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            router.push('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };



    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
