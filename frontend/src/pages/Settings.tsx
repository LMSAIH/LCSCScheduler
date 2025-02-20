import { useState, useEffect } from "react"
import { Save, Eye, EyeOff, Moon, Sun } from "lucide-react"
import { useDarkMode } from "../context/DarkModeContext"
const roles = ["Club Directives", "Marketing Team", "Social Media Team", "Developer Team", "Volunteers", "Admin"]

export default function SettingsPage() {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [adminPassword, setAdminPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { toggleDarkMode, darkMode } = useDarkMode();

  useEffect(() => {
    if (!selectedRoles.includes("Admin")) {
      setAdminPassword("")
    }
  }, [selectedRoles])

  const handleRoleChange = (role: string) => {
    setSelectedRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]))
  }

  const handleSave = () => {

    console.log("Roles saved:", selectedRoles)
    if (selectedRoles.includes("Admin")) {
      console.log("Admin password:", adminPassword)
    }
  }

  return (
    <div className="min-h-screen text-white">
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-[#F15A29] mb-8">Settings</h1>

        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Change Your Roles</h2>
          <p className="text-gray-400 mb-4">Select your roles in the Langara Computer Science Club</p>
          <div className="space-y-2">
            {roles.map((role) => (
              <label
                key={role}
                className="flex items-center space-x-3 p-3 rounded-md 
                           hover:bg-[#2A2A2A] transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(role)}
                  onChange={() => handleRoleChange(role)}
                  className="form-checkbox h-5 w-5 text-[#F15A29] 
                             rounded focus:ring-[#F15A29] focus:ring-offset-[#1A1A1A]"
                />
                <span>{role}</span>
              </label>
            ))}
          </div>

          {selectedRoles.includes("Admin") && (
            <div className="mt-4">
              <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-400 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="adminPassword"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-[#2A2A2A] border border-[#404040] rounded-md 
                             focus:outline-none focus:ring-2 focus:ring-[#F15A29] focus:border-transparent"
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Dark Mode</h3>
            <button
              onClick={() => toggleDarkMode()}
              className={`px-4 py-2 ${darkMode ? "bg-[#2A2A2A] hover:bg-[#404040]" : "bg-[#2A2A2A] hover:bg-[#404040]"} rounded-md transition-colors flex items-center`}
            >
              {darkMode ? <Sun className="h-5 w-5 mr-2" /> : <Moon className="h-5 w-5 mr-2" />}
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Selected Roles:</h3>
            <p className="text-gray-400">{selectedRoles.length > 0 ? selectedRoles.join(", ") : "No roles selected"}</p>
          </div>

          <button
            onClick={handleSave}
            className="mt-6 px-6 py-2 bg-[#F15A29] hover:bg-[#D14918] 
                       rounded-md transition-colors font-medium flex items-center"
          >
            <Save className="h-5 w-5 mr-2" />
            Save Changes
          </button>
        </div>
      </main>
    </div>
  )
}

