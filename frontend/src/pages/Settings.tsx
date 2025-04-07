import { useState, useEffect } from "react"
import { Save, Eye, EyeOff, Moon, Sun, LoaderCircleIcon, Settings2Icon, CheckCircle, User } from "lucide-react"
import { useDarkMode } from "../context/DarkModeContext"
import { APIBASEURL, ROLESPREFIX } from "../utilities/ApiEndpoint"
import { useAuthContext } from "../context/AuthContext"
import axios from 'axios'
import { motion } from "framer-motion"

const roles = ["Media", "Volunteer", "Developer", "President", "Events", "Admin"]

export default function SettingsPage() {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [adminPassword, setAdminPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { toggleDarkMode, darkMode } = useDarkMode();
  const { token, verifyAuth } = useAuthContext();
  const [error, setError] = useState<String | null>(null);
  const [loading, setLoading] = useState(false);
  const [existingRoles, setExistingRoles] = useState<string[]>([]);  
  const [initialLoad, setInitialLoad] = useState(true);
  const [success, setSuccess] = useState(false);

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

        console.log("here", response.data)

        setExistingRoles(response.data.roles);
        setSelectedRoles(response.data.roles);
        setInitialLoad(false);

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
    setSuccess(false);

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
      verifyAuth();
      setError(null);
      setSuccess(true);

    } catch (err: any) {
      console.log(err)
      setError(err.response.data.detail);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`min-h-screen ${darkMode 
      ? "bg-gradient-to-br from-[#0D1216] to-[#131D25] text-white" 
      : "bg-gradient-to-br from-[#F8F9FA] to-[#EDF2F7] text-[#1A1F23]"}`}>
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none"></div>
      
      <main className="max-w-3xl mx-auto p-4 md:p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={`text-2xl md:text-3xl font-bold mb-6 flex items-center ${darkMode ? "text-white" : "text-[#1A1F23]"}`}>
            <Settings2Icon className="h-6 w-6 mr-3 text-[#59001C]" />
            Settings
          </h1>
  
          <div className={`rounded-xl overflow-hidden shadow-2xl ${darkMode 
            ? "bg-[#0F171E] border border-[#30332F]/50" 
            : "bg-white border border-[#E2E8F0]"}`}>
            <div className="p-6 md:p-8">
              
              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-[#1A1F23]"}`}>
                  Your Current Roles
                </h2>
                <div className="flex flex-wrap gap-2">
                  {existingRoles.length === 0 ? (
                    <p className={darkMode ? "text-[#C1C1BD] italic" : "text-[#4A5568] italic"}>
                      No roles assigned yet
                    </p>
                  ) : (
                    existingRoles.map((role) => (
                      <span 
                        key={role} 
                        className="py-1.5 px-3 bg-gradient-to-r from-[#59001C] to-[#7A0026] rounded-full text-white text-sm font-medium"
                      >
                        {role}
                      </span>
                    ))
                  )}
                </div>
              </section>
              
              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-[#1A1F23]"}`}>
                  Change Your Roles
                </h2>
                <p className={darkMode ? "text-[#C1C1BD] mb-4" : "text-[#4A5568] mb-4"}>
                  Select your roles in the Langara Computer Science Club
                </p>
                <div className="space-y-1">
                  {roles.map((role) => (
                    <label
                      key={role}
                      className={`flex items-center space-x-3 p-3 rounded-md transition-colors cursor-pointer ${
                        darkMode 
                          ? "hover:bg-[#1A1F23]" 
                          : "hover:bg-[#F0F2F5]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={initialLoad ? existingRoles.includes(role) : selectedRoles.includes(role)}
                        onChange={() => handleRoleChange(role)}
                        className={`form-checkbox h-5 w-5 text-[#59001C] rounded ${
                          darkMode 
                            ? "border-[#30332F] bg-[#1A1F23] focus:ring-offset-[#0F171E]" 
                            : "border-[#E2E8F0] bg-white focus:ring-offset-white"
                        } focus:ring-[#59001C]`}
                      />
                      <span className={darkMode ? "text-white" : "text-[#1A1F23]"}>{role}</span>
                    </label>
                  ))}
                </div>
              </section>
  
              {selectedRoles.includes("Admin") && (
                <section className="mb-8">
                  <h2 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-[#1A1F23]"}`}>
                    Admin Access
                  </h2>
                  <p className={darkMode ? "text-[#C1C1BD] mb-4" : "text-[#4A5568] mb-4"}>
                    Enter the administrator password to confirm access
                  </p>
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="adminPassword"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter admin password"
                      className={`w-full px-4 py-3 rounded-md transition-all duration-200 ${
                        darkMode 
                          ? "bg-[#1A1F23] border border-[#30332F] text-white" 
                          : "bg-[#F0F2F5] border border-[#E2E8F0] text-[#1A1F23]"
                      } focus:outline-none focus:ring-2 focus:ring-[#59001C] focus:border-transparent`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute inset-y-0 right-0 pr-4 flex items-center transition-colors ${
                        darkMode 
                          ? "text-[#C1C1BD] hover:text-white" 
                          : "text-[#4A5568] hover:text-[#1A1F23]"
                      } hover:cursor-pointer`}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    <div className={`absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 -z-10 blur-lg transition-opacity pointer-events-none ${
                      darkMode 
                        ? "bg-gradient-to-r from-[#59001C]/40 to-[#30332F]/40" 
                        : "bg-gradient-to-r from-[#59001C]/20 to-[#E2E8F0]/40"
                    }`}></div>
                  </div>
                </section>
              )}
  
              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-[#1A1F23]"}`}>
                  Display Theme
                </h2>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleDarkMode()}
                  className={`px-6 py-3 rounded-md transition-all duration-200 flex items-center shadow-md ${
                    darkMode 
                      ? "bg-[#1A1F23] border border-[#30332F] hover:bg-[#30332F]/70 text-white" 
                      : "bg-white border border-[#E2E8F0] hover:bg-[#F0F2F5] text-[#1A1F23]"
                  }`}
                >
                  {darkMode ? (
                    <>
                      <Sun className="h-5 w-5 mr-2 text-amber-400" />
                      <span>Switch to Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-5 w-5 mr-2 text-[#4A5568]" />
                      <span>Switch to Dark Mode</span>
                    </>
                  )}
                </motion.button>
              </section>
  
              <section className="mb-6">
                <h2 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-[#1A1F23]"}`}>
                  Selected Roles
                </h2>
                <div className={`p-4 rounded-lg border ${
                  darkMode 
                    ? "bg-[#1A1F23]/50 border-[#30332F]/50" 
                    : "bg-[#F0F2F5]/50 border-[#E2E8F0]"
                }`}>
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-[#59001C]" />
                    <p className={darkMode ? "text-[#C1C1BD]" : "text-[#4A5568]"}>
                      {selectedRoles.length > 0 ? selectedRoles.join(", ") : "No roles selected"}
                    </p>
                  </div>
                </div>
              </section>
              
              <div className="flex justify-between items-center mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-[#59001C] to-[#7A0026] 
                           text-white rounded-md font-medium flex items-center justify-center
                           shadow-lg shadow-[#59001C]/20 transition-all duration-200 
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <LoaderCircleIcon className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-5 w-5 mr-2" />
                  )}
                  Save Changes
                </motion.button>
                
                {success && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center text-[#2E7D32]"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span>Changes saved</span>
                  </motion.div>
                )}
              </div>
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-6 p-4 rounded-md text-center ${
                    darkMode 
                      ? "bg-[#59001C]/20 border border-[#59001C] text-white" 
                      : "bg-[#59001C]/10 border border-[#59001C] text-[#59001C]"
                  }`}
                >
                  <p>{error}</p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}