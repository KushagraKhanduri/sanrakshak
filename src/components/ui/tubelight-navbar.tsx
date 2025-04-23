"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/context/ThemeProvider"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
  onNavChange?: (url: string) => void
}

export function NavBar({ items, className, onNavChange }: NavBarProps) {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('')
  const { theme } = useTheme()
  const isLight = theme === 'light'

  useEffect(() => {
    const currentPath = location.pathname
    
    const exactMatch = items.find(item => item.url === currentPath)
    if (exactMatch) {
      setActiveTab(exactMatch.name)
      return
    }
    
    if (currentPath.includes('/resources') || 
        currentPath.includes('/volunteer-resources') || 
        currentPath.includes('/victim-resources')) {
      const resourceItem = items.find(item => item.name === 'Resources')
      if (resourceItem) {
        setActiveTab(resourceItem.name)
        return
      }
    }
    
    for (const item of items) {
      if (item.url !== '/' && currentPath.startsWith(item.url)) {
        setActiveTab(item.name)
        return
      }
    }
    
    setActiveTab(items[0]?.name || '')
  }, [location.pathname, items])

  const handleNavClick = (item: NavItem) => {
    setActiveTab(item.name)
    onNavChange?.(item.url)
  }

  return (
    <div className={cn("z-50 ", className)}>
      <div className={cn(
        "flex items-center w-full justify-center gap-4 md:gap-2 py-2 px-3 rounded-full shadow-xl transition-all duration-300",
        isLight 
          ? "bg-white/70 border border-gray-200/50 backdrop-blur-md" 
          : "bg-gray-900/50 border border-gray-800/50 backdrop-blur-lg"
      )}>
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <Link
              key={item.name}
              to={item.url}
              onClick={() => handleNavClick(item)}
              className={cn(
                "relative cursor-pointer text-sm font-medium px-4 py-2 rounded-full transition-all duration-200",
                isLight
                  ? isActive 
                    ? "text-primary" 
                    : "text-gray-600 hover:text-primary"
                  : isActive 
                    ? "text-primary" 
                    : "text-gray-300 hover:text-primary",
                "hover:scale-110"
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className={cn(
                    "absolute inset-0 w-full rounded-full -z-10",
                    isLight ? "bg-white/80" : "bg-gray-800/80"
                  )}
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  {isLight && (
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-t-full opacity-70" />
                  )}
                </motion.div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}