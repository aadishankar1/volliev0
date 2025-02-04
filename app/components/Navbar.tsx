"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Globe, Bell, Trophy, User, Plus, Award, Users, MessageSquare, Menu } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import Image from "next/image"
import { motion } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const Navbar = () => {
  const pathname = usePathname()
  const { user, logout, loading } = useAuth()

  if (loading) {
    return (
      <nav className="bg-background border-b border-border fixed top-0 left-0 right-0 z-10 h-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-full">
            <span>Loading...</span>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        className="bg-background border-b border-border fixed top-0 left-0 right-0 z-10 h-16 hidden md:block"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-full">
            <Link href="/explore" className="flex items-center space-x-2">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Copy_of_Volunteen_Logo-removebg-preview-RiE6TyzfOc1innz0Iud7ZxghahIAY0.png"
                alt="Volunteen Logo"
                width={40}
                height={40}
                className="w-auto h-8"
              />
              <span className="text-2xl font-bold text-primary">Volunteen</span>
            </Link>
            <div className="hidden md:flex space-x-1">
              <NavLink href="/explore" current={pathname} icon={<Globe className="h-4 w-4" />}>
                Explore
              </NavLink>
              <NavLink href="/social" current={pathname} icon={<Users className="h-4 w-4" />}>
                Social
              </NavLink>
              <NavLink href="/notifications" current={pathname} icon={<Bell className="h-4 w-4" />}>
                Notifications
              </NavLink>
              {user && (
                <>
                  <NavLink href="/profile" current={pathname} icon={<User className="h-4 w-4" />}>
                    Profile
                  </NavLink>
                  <NavLink href="/achievements" current={pathname} icon={<Award className="h-4 w-4" />}>
                    Achievements
                  </NavLink>
                  {user.type === "organization" && (
                    <NavLink href="/add-initiative" current={pathname} icon={<Plus className="h-4 w-4" />}>
                      Add Initiative
                    </NavLink>
                  )}
                </>
              )}
            </div>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <motion.nav
        className="bg-background border-t border-border fixed bottom-0 left-0 right-0 z-10 h-16 md:hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="grid grid-cols-5 h-full">
          <MobileNavLink href="/explore" current={pathname} icon={<Globe className="h-6 w-6" />} label="Explore" />
          <MobileNavLink
            href="/social"
            current={pathname}
            icon={<MessageSquare className="h-6 w-6" />}
            label="Social"
          />
          <MobileNavLink
            href="/notifications"
            current={pathname}
            icon={<Bell className="h-6 w-6" />}
            label="Notifications"
          />
          {user ? (
            <MobileNavLink href="/profile" current={pathname} icon={<User className="h-6 w-6" />} label="Profile" />
          ) : (
            <MobileNavLink href="/login" current={pathname} icon={<User className="h-6 w-6" />} label="Login" />
          )}
          <MobileNavLink href="/menu" current={pathname} icon={<Menu className="h-6 w-6" />} label="Menu" />
        </div>
      </motion.nav>
    </>
  )
}

const NavLink = ({
  href,
  children,
  current,
  icon,
}: { href: string; children: React.ReactNode; current: string; icon: React.ReactNode }) => {
  const isActive = current === href
  return (
    <Link
      href={href}
      className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
        isActive ? "bg-accent text-accent-foreground" : "text-foreground"
      }`}
    >
      {icon}
      <span className="ml-2">{children}</span>
    </Link>
  )
}

const MobileNavLink = ({
  href,
  icon,
  label,
  current,
}: { href: string; icon: React.ReactNode; label: string; current: string }) => {
  const isActive = current === href
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center space-y-1 transition-colors hover:text-primary ${
        isActive ? "text-primary" : "text-muted-foreground"
      }`}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </Link>
  )
}

export default Navbar

