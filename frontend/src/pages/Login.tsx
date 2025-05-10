import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { LogIn, Eye, EyeOff, Key } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuthContext } from "../context/AuthContext"
import { motion } from "framer-motion"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { login } = useAuthContext()
    
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null);

        try {
            await login(email, password)
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.detail || "Login failed")
        }
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0D1216] to-[#131D25] text-white flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none"></div>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="mb-8 text-center">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#59001C] to-[#7A0026] rounded-xl flex items-center justify-center mb-6 shadow-lg">
                            <Key size={40} className="text-white" />
                        </div>
                    </motion.div>
                    <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                    <p className="text-[#C1C1BD] mt-2">Sign in to your account</p>
                </div>
                
                <div className="bg-[#0F171E] border border-[#30332F]/30 rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-8">
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[#C1C1BD] mb-2">
                                    Email
                                </label>
                                <div className="relative group">
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 bg-[#1A1F23] border border-[#30332F] rounded-md 
                                        text-white focus:outline-none focus:ring-2 focus:ring-[#59001C] focus:border-transparent
                                        transition-all duration-200"
                                        required
                                    />
                                    <div className="absolute inset-0 rounded-md bg-gradient-to-r from-[#59001C]/40 to-[#30332F]/40 opacity-0 group-hover:opacity-100 -z-10 blur-lg transition-opacity pointer-events-none"></div>
                                </div>
                            </div>
                            
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label htmlFor="password" className="block text-sm font-medium text-[#C1C1BD]">
                                        Password
                                    </label>
                                 
                                </div>
                                <div className="relative group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-[#1A1F23] border border-[#30332F] rounded-md 
                                        text-white focus:outline-none focus:ring-2 focus:ring-[#59001C] focus:border-transparent
                                        transition-all duration-200"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#C1C1BD] hover:text-white hover:cursor-pointer transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                    <div className="absolute inset-0 rounded-md bg-gradient-to-r from-[#59001C]/40 to-[#30332F]/40 opacity-0 group-hover:opacity-100 -z-10 blur-lg transition-opacity pointer-events-none"></div>
                                </div>
                            </div>
                            
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full px-6 py-3 bg-gradient-to-r from-[#59001C] to-[#7A0026] 
                                text-white rounded-md font-medium flex items-center justify-center
                                shadow-lg shadow-[#59001C]/20 transition-all duration-200 hover:cursor-pointer" 
                            >
                                <LogIn className="h-5 w-5 mr-2" />
                                Sign in
                            </motion.button>
                        </form>
                        
                        <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-[#30332F]/50"></div>
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="px-4 bg-[#0F171E] text-[#C1C1BD]">or continue with</span>
                                </div>
                            </div>
                         
                        </div>
                    </div>
                    
                    <div className="p-6 bg-[#0A1218] border-t border-[#30332F]/30 text-center">
                        <p className="text-[#C1C1BD]">
                            Don't have an account?{" "}
                            <Link to="/signup" className="text-white font-medium hover:text-[#59001C] transition-colors">
                                Sign up now
                            </Link>
                        </p>
                    </div>
                </div>
                
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 rounded-md bg-[#59001C]/20 border border-[#59001C] text-white text-center"
                    >
                        <p>{error}</p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    )
}