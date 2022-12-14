import { useEffect, useState } from 'react';

const useThemeDetector = () => {
  const getCurrentTheme = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [isDarkTheme, setIsDarkTheme] = useState(getCurrentTheme());

  useEffect(() => {
    const unsub = window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        setIsDarkTheme(e.matches);
      });
    // darkThemeMq.addEventListener(mqListener);
    return () => unsub();
  }, []);
  return { isDarkTheme };
};

export default useThemeDetector;
