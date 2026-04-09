'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as loginApi } from '@/api/api';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (credentials: any) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (credentials: any) => {
        try {
            setError(null);
            setLoading(true);
            const data = await loginApi(credentials);
            
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            localStorage.setItem('token', data.token);
            
            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
            throw err;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, logout }}>
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
