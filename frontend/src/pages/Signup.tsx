import type React from "react"
import { APIBASEURL, AUTHPREFIX } from "../utilities/ApiEndpoint"
import axios from 'axios'
import { useState } from "react"
import { Link } from "react-router-dom"
import { UserPlus, Eye, EyeOff, UserIcon } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import { motion } from "framer-motion"

export default function SignupPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPasswords, setShowPasswords] = useState(false)
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const isStrongPassword = (password: string) => {
        if (password.length < 8) return false;
        if (!/[a-z]/.test(password)) return false;
        if (!/[A-Z]/.test(password)) return false;
        if (!/\d/.test(password)) return false;
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
        return true;
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            if (!(name.trim().length > 0)) {
                throw new Error("Name cannot be empty.");
            }

            if (password !== confirmPassword) {
                throw new Error("Passwords must match");
            }

            if (!isStrongPassword(password)) {
                throw new Error("Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.");
            }

            const response: any = await axios.post(`${APIBASEURL}${AUTHPREFIX}/signup`, { name, email, password });
            console.log("res", response)

            if (response.status !== 200) {
                throw new Error(response.response.data.detail)
            }

            setError(null);
            setSent(true);
            setDisabled(true);
        } catch (err: any) {
            console.log("err", err)

            if (err.response?.data?.detail) {
                setError(err.response.data.detail)
            }
            else {
                setError(err.message)
            }
        }
    }

    const handleGoogleSignup = () => {
        console.log("Google signup attempt")
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
                            <UserIcon size={40} className="text-white" />
                        </div>
                    </motion.div>
                    <h1 className="text-3xl font-bold text-white">Create Account</h1>
                    <p className="text-[#C1C1BD] mt-2">Create your account and access the scheduler</p>
                </div>
                
                <div className="bg-[#0F171E] border border-[#30332F]/30 rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-8">
                        <form onSubmit={handleSignup} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-[#C1C1BD] mb-2">
                                    Name
                                </label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 bg-[#1A1F23] border border-[#30332F] rounded-md 
                                        text-white focus:outline-none focus:ring-2 focus:ring-[#59001C] focus:border-transparent
                                        transition-all duration-200"
                                        required
                                    />
                                    <div className="absolute inset-0 rounded-md bg-gradient-to-r from-[#59001C]/40 to-[#30332F]/40 opacity-0 group-hover:opacity-100 -z-10 blur-lg transition-opacity pointer-events-none"></div>
                                </div>
                            </div>
                            
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
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords(!showPasswords)}
                                        className="text-xs text-white hover:cursor-pointer duration-300 hover:text-[#7A0026] font-medium flex items-center"
                                    >
                                        {showPasswords ? (
                                            <>
                                                <EyeOff className="h-3 w-3 mr-1" /> Hide
                                            </>
                                        ) : (
                                            <>
                                                <Eye className="h-3 w-3 mr-1" /> Show
                                            </>
                                        )}
                                    </button>
                                </div>
                                <div className="relative group">
                                    <input
                                        type={showPasswords ? "text" : "password"}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-[#1A1F23] border border-[#30332F] rounded-md 
                                        text-white focus:outline-none focus:ring-2 focus:ring-[#59001C] focus:border-transparent
                                        transition-all duration-200"
                                        required
                                    />
                                    <div className="absolute inset-0 rounded-md bg-gradient-to-r from-[#59001C]/40 to-[#30332F]/40 opacity-0 group-hover:opacity-100 -z-10 blur-lg transition-opacity pointer-events-none"></div>
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#C1C1BD] mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative group">
                                    <input
                                        type={showPasswords ? "text" : "password"}
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-[#1A1F23] border border-[#30332F] rounded-md 
                                        text-white focus:outline-none focus:ring-2 focus:ring-[#59001C] focus:border-transparent
                                        transition-all duration-200"
                                        required
                                    />
                                    <div className="absolute inset-0 rounded-md bg-gradient-to-r from-[#59001C]/40 to-[#30332F]/40 opacity-0 group-hover:opacity-100 -z-10 blur-lg transition-opacity pointer-events-none"></div>
                                </div>
                            </div>
                            
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={disabled}
                                className="w-full px-6 py-3 bg-gradient-to-r from-[#59001C] to-[#7A0026] 
                                text-white rounded-md font-medium flex items-center justify-center
                                shadow-lg shadow-[#59001C]/20 transition-all duration-200 
                                disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer "

                            >
                                <UserPlus className="h-5 w-5 mr-2" />
                                Create Account
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
                            
                            <motion.button
                                onClick={handleGoogleSignup}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="mt-4 w-full px-6 py-3 bg-white hover:bg-[#F8F8F8] 
                                text-[#0D1216] rounded-md font-medium 
                                flex items-center justify-center shadow-lg transition-all duration-200 hover:cursor-pointer "
                            >
                                <FcGoogle className="h-5 w-5 mr-2" />
                                Sign up with Google
                            </motion.button>
                        </div>
                    </div>
                    
                    <div className="p-6 bg-[#0A1218] border-t border-[#30332F]/30 text-center">
                        <p className="text-[#C1C1BD]">
                            Already have an account?{" "}
                            <Link to="/login" className="text-white font-medium hover:text-[#59001C] transition-colors">
                                Sign in
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
                
                {sent && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 rounded-md bg-[#2E4F3A]/20 border border-[#2E4F3A] text-white text-center"
                    >
                        <p>Thank you! Please check your email inbox to proceed.</p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}