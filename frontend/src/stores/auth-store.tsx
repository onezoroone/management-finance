import { User } from '@/props/User';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    isAuthenticated: boolean;
    token: string;
    user: {
        first_name: string;
        last_name: string;
        email: string;
    };
    login: (token: string, user: User) => void;
    logout: () => void;
}

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            token: '',
            user: {
                first_name: '',
                last_name: '',
                email: '',
            },
            logout: () => set({ isAuthenticated: false, token: '', user: { first_name: '', last_name: '', email: '' } }),
            login: (token: string, user: User) => set({ isAuthenticated: true, token, user }),
        }),
        {
            name: 'auth-storage',
        }
    )
);

export default useAuthStore;