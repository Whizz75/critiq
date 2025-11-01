import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import ThemeToggle from "@/components/ThemeToggle"
import { Button } from "@/components/ui/button"
import { Menu, LogOut, Home, Info, CircleUserRound, Film } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <nav className="w-full bg-card border-b border-border shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2"
        >
          <img src="/src/assets/logo.png" alt="logo" className="w-12"/>
          <p className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Critiq</p>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-indigo-600">
            <Home className="w-6 h-6 inline-block mr-1" />
            Home
          </Link>
          <Link to="/about" className="text-sm text-muted-foreground hover:text-indigo-600">
            <Info className="w-6 h-6 inline-block mr-1" />
            About
          </Link>
          <Link to="/profile" className="text-sm text-muted-foreground hover:text-indigo-600">
            <CircleUserRound className="w-6 h-6 inline-block mr-1" />
            Profile
          </Link>
          <Link to="/movies" className="text-sm text-muted-foreground hover:text-indigo-600">
            <Film className="w-6 h-6 inline-block mr-1" />
            More Movies
          </Link>

          <ThemeToggle />

          {user && (
            <div className="flex items-center space-x-3">
              <img
                src="/src/assets/avatar.png"
                alt="avatar"
                className="w-8 h-8 rounded-full border border-border"
              />
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-slate-800"
              >
                <LogOut className="w-4 h-4" /> Logout
              </Button>
            </div>
          )}
        </div>

        <button
          className="md:hidden text-foreground hover:text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-border bg-card text-center py-4 space-y-3">
          <Link
            to="/"
            className="block text-muted-foreground hover:text-indigo-600"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block text-muted-foreground hover:text-indigo-600"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            to="/profile"
            className="block text-muted-foreground hover:text-indigo-600"
            onClick={() => setIsOpen(false)}
          >
            Profile
          </Link>

          <ThemeToggle />

          {user && (
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-red-400 hover:text-red-500 w-full"
            >
              Logout
            </Button>
          )}
        </div>
      )}
    </nav>
  )
}
