import { create } from 'zustand';

const useThemeStore = create((set) => ({
   theme: localStorage.getItem('bs-theme') || 'light',
   setTheme: (theme) => {
      localStorage.setItem('bs-theme', theme);
      set({ theme });
   },
}));

export default useThemeStore;
