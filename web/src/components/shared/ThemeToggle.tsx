import { Moon, Sun } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "./ThemeContext"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative size-9 rounded-full"
      title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {resolvedTheme === "dark" ? (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <Moon className="size-4" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <Sun className="size-4" />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
