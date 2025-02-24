import { useState, useEffect } from "react"
import { Save, Eye, EyeOff, Moon, Sun, LoaderCircleIcon } from "lucide-react"
import { useDarkMode } from "../context/DarkModeContext"
import { APIBASEURL, ROLESPREFIX } from "../utilities/ApiEndpoint"
import { useAuthContext } from "../context/AuthContext"
import axios from 'axios'

const roles = ["Media", "Volunteer", "Developer", "President", "Events", "Admin"]

export default function SettingsPage() {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [adminPassword, setAdminPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { toggleDarkMode, darkMode } = useDarkMode();
  const { token } = useAuthContext();
  const [error, setError] = useState<String | null>(null);
  const [loading, setLoading] = useState(false);
  const [existingRoles, setExistingRoles] = useState<string[]>([]);

  useEffect(() => {

    const fetchRoles = async () => {
      setLoading(true);
      try {

        const response = await axios.get(
          `${APIBASEURL}${ROLESPREFIX}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log(response.data)

        setExistingRoles(response.data.roles);

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }

    }

    fetchRoles();

  }, [])

  useEffect(() => {
    if (!selectedRoles.includes("Admin")) {
      setAdminPassword("")
    }
  }, [selectedRoles])

  const handleRoleChange = (role: string) => {
    setSelectedRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]))
  }

  const handleSave = async () => {

    setLoading(true);

    try {

      const updateResponse = await axios.post(
        `${APIBASEURL}${ROLESPREFIX}/`,
        {
          roles: selectedRoles,
          ...(selectedRoles.includes("Admin") && { password: adminPassword })
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(updateResponse.data)
      setExistingRoles(updateResponse.data.roles);
      setError(null);

    } catch (err: any) {
      console.log(err)
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen text-white">
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-[#F15A29] mb-8">Settings</h1>

        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your Roles</h2>
          <div className="text-gray-400 mb-4 flex flex-row flex-wrap gap-y-2">{existingRoles.length == 0 ? "No roles assigned yet" :
            existingRoles.map((role) => <div className="py-1 px-2 bg-[#F15A29] rounded-md text-white mr-2 font-semibold" key={role}>{role}</div>)} </div>
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
            {loading ? <LoaderCircleIcon className="h-5 w-5 mr-2 animate-spin" /> : <Save className="h-5 w-5 mr-2" />}
            Save Changes
          </button>

          {error && <p className="text-white text-center">{error}</p>}
        </div>
      </main>
    </div>
  )
}

