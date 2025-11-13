import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  apiKey: string;
  model: string;
  setApiKey: (key: string) => void;
  setModel: (model: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      apiKey: '',
      model: 'gpt-4o-mini',
      setApiKey: (key) => {
        console.log('Impostazione API Key:', key ? '***' + key.slice(-4) : 'vuota');
        set({ apiKey: key });
      },
      setModel: (model) => {
        console.log('Impostazione modello:', model);
        set({ model });
      },
    }),
    {
      name: 'zanichelli-settings',
    }
  )
);
