import { useThemeStore } from '@/store'

export function useTheme() {
  const { theme, setTheme, toggleTheme } = useThemeStore()
  return { theme, setTheme, toggleTheme }
}
