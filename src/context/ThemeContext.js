import { createContext } from 'react';

export const ThemeContext = createContext({
  themeData: [],
  theme: {},
  setTheme: () => null,
});
