"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { ExitIcon } from "@radix-ui/react-icons";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    signOut()
  }

  return (
    <nav className="flex items-center justify-between p-4 bg-black border-b-[1px] border-gray-800">
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-bold">
          Eventify
        </Link>
      </div>

      {/* Desktop menu */}
      <div className="hidden lg:flex items-center space-x-4">
        <Link href="/dashboard" className="text-foreground hover:text-primary">
          Dashboard
        </Link>
        <Link href="/profile" className="text-foreground hover:text-primary">
          Profile
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleLogout} className="text-red-500">
              <ExitIcon className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile menu */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <nav className="flex flex-col h-full">
            <div className="flex-grow space-y-4 py-4">
              <Link 
                href="/dashboard" 
                className="block text-foreground hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                href="/profile" 
                className="block text-foreground hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
            </div>
            <div className="border-t py-4 text-red-500">
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => {
                  handleLogout()
                  setIsOpen(false)
                }}
              >
                <ExitIcon className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </Button>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </nav>
  )
}