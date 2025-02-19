import { HomeIcon, Settings2, LogOut } from "lucide-react"
import { Link } from "react-router-dom"

export default function NavBar() {
  return (
    <nav className="flex h-16 items-center justify-between bg-[#121212] px-6 text-white border-b border-[#2A2A2A]">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-xl font-bold text-[#F15A29]">
          LCSC Scheduler
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/" className="p-2 hover:bg-[#2A2A2A] rounded-md transition-colors">
          <HomeIcon className="h-5 w-5" />
        </Link>
        <Link to="/settings" className="p-2 hover:bg-[#2A2A2A] rounded-md transition-colors">
          <Settings2 className="h-5 w-5" />
        </Link>
        <button className="p-2 hover:bg-[#2A2A2A] rounded-md transition-colors text-[#F15A29]">
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </nav>
  )
}

