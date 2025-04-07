import { HomeIcon, Settings2, LogOut, Calendar, Menu, X } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { motion } from "framer-motion"

export default function NavBar() {
  const { logout, user } = useAuthContext();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  return (
    <nav className="relative z-10 bg-gradient-to-r from-[#0D1216] to-[#131D25] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and title */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-semibold bg-gradient-to-r from-white to-[#C1C1BD] bg-clip-text text-transparent">
                LCSC Scheduler
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/"
              className="relative px-4 py-2 text-[#C1C1BD] hover:text-white group"
            >
              <span className="relative z-10 flex items-center">
                <HomeIcon className="h-4 w-4 mr-2" /> Home
              </span>
              <span className="absolute inset-0 rounded-md bg-gradient-to-r from-[#59001C]/80 to-[#30332F]/80 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></span>
            </Link>
            <Link 
              to="/settings"
              className="relative px-4 py-2 text-[#C1C1BD] hover:text-white group"
            >
              <span className="relative z-10 flex items-center">
                <Settings2 className="h-4 w-4 mr-2" /> Settings
              </span>
              <span className="absolute inset-0 rounded-md bg-gradient-to-r from-[#59001C]/80 to-[#30332F]/80 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></span>
            </Link>
            <button 
              onClick={handleLogout}
              className="relative px-4 py-2 text-[#C1C1BD] hover:text-white group"
            >
              <span className="relative z-10 flex items-center hover:cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </span>
              <span className="absolute inset-0 rounded-md bg-gradient-to-r from-[#59001C]/80 to-[#30332F]/80 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></span>
            </button>

            {user && (
              <div className="ml-3 px-3 py-1 bg-[#30332F]/30 border border-[#30332F] rounded-full flex items-center">
                <div className="w-6 h-6 rounded-full bg-[#59001C] flex items-center justify-center text-white text-xs font-bold mr-2">
                  {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                </div>
                <span className="text-sm text-[#C1C1BD]">
                  {user.name || 'User'}
                </span>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-[#C1C1BD] hover:text-white hover:bg-[#30332F] transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div 
          className="md:hidden bg-[#0F171E] border-t border-[#30332F]"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.2 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="flex items-center px-3 py-2 rounded-md text-[#C1C1BD] hover:text-white hover:bg-[#30332F] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <HomeIcon className="h-5 w-5 mr-3" /> Home
            </Link>
            <Link 
              to="/settings" 
              className="flex items-center px-3 py-2 rounded-md text-[#C1C1BD] hover:text-white hover:bg-[#30332F] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Settings2 className="h-5 w-5 mr-3" /> Settings
            </Link>
            <button 
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center px-3 py-2 rounded-md text-[#C1C1BD] hover:text-white hover:bg-[#30332F] transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" /> Logout
            </button>

            {user && (
              <div className="mt-3 px-3 py-2 border-t border-[#30332F]">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#59001C] flex items-center justify-center text-white font-bold mr-3">
                    {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div>
                    <p className="text-white">{user.name || 'User'}</p>
                    <p className="text-sm text-[#C1C1BD]">{user.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  )
}