import { useMyAppContext } from "./Context";

export const themes = {
  light: {
    colours: {
      text: '#000',
      inverseText: '#fff',
      placeholderText: '#888',
      background: '#fff',
      inverseBackground: '#000',
      overlay: 'rgba(0,0,0,0.7)',
      badge: '#999',
    },
    spacing: {
      borderRadius: 8
    }
  },
  dark: {
    colours: {
      text: '#fff',
      inverseText: '#000',
      placeholderText: '#888',
      background: '#000',
      inverseBackground: '#fff',
      overlay: 'rgba(0, 0, 0, 0.9)',
      badge: '#333',
    },
    spacing: {
      borderRadius: 8
    }
  },
};

export const useTheme = () => {
  const { customTheme } = useMyAppContext();
  return themes[customTheme];
};