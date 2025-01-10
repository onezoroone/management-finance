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
        group_id?: string;
    };
    login: (token: string, user: User) => void;
    logout: () => void;
    setGroup: (group_id: string) => void;
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
                group_id: ''
            },
            logout: () => set({ isAuthenticated: false, token: '', user: { first_name: '', last_name: '', email: '', group_id: '' } }),
            login: (token: string, user: User) => set({ isAuthenticated: true, token, user }),
            setGroup: (group_id: string) => set((state) => ({ user: { ...state.user, group_id } })),
        }),
        {
            name: 'auth-storage',
        }
    )
);

export default useAuthStore;