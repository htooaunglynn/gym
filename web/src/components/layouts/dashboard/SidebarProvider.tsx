import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { SidebarContext } from "./SidebarContext"

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar-collapsed")
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(isCollapsed))
  }, [isCollapsed])

  const toggleSidebar = () => setIsCollapsed((prev: boolean) => !prev)

  return (
    <SidebarContext.Provider
      value={{ isCollapsed, setIsCollapsed, toggleSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

