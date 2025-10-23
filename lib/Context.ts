import { createContext, Dispatch, SetStateAction, useContext } from 'react';

export const MyAppContext = createContext<{ customTheme: "light" | "dark", customBorderRadius: number, setOpen: Dispatch<SetStateAction<boolean>> } | null>(null);

export const useMyAppContext = () => {
  const ctx = useContext(MyAppContext);
  if (!ctx) throw new Error("useMyAppContext must be used inside provider");
  return ctx;
};