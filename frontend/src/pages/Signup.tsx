import type React from "react"

import { APIBASEURL, AUTHPREFIX } from "../utilities/ApiEndpoint"
import axios from 'axios'
import { useState } from "react"
import { Link } from "react-router-dom"
import { UserPlus, Eye, EyeOff } from "lucide-react"
import { FcGoogle } from "react-icons/fc"

export default function SignupPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);
    const [disabled,setDisabled] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {

        e.preventDefault()

        try {

            if (!(name.trim().length > 0)) {
                throw new Error("Name cannot be empty.");
            }

            if(password !== confirmPassword){
                throw new Error("Password must match");
            }

            const response:any = await axios.post(`${APIBASEURL}${AUTHPREFIX}/signup`,{name,email,password});
            console.log(response)

            if(response.status !== 200){
                throw new Error(response.response.data.detail)
            }

            setError(null);
            setSent(true);
            setDisabled(true);

        } catch (err:any) {
            console.log(err)
            setError(err.message)
        }
      
    }

    const handleGoogleSignup = () => {
        console.log("Google signup attempt")
    }

    return (
        <div className="min-h-screen text-white">
            <main className="max-w-md mx-auto p-6">
                <h1 className="text-3xl font-bold text-[#F15A29] mb-8">Sign Up</h1>
                <form onSubmit={handleSignup} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                            Name
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 bg-[#2A2A2A] border border-[#404040] rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-[#F15A29] focus:border-transparent"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 bg-[#2A2A2A] border border-[#404040] rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-[#F15A29] focus:border-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 bg-[#2A2A2A] border border-[#404040] rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-[#F15A29] focus:border-transparent"
                                required
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
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 bg-[#2A2A2A] border border-[#404040] rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-[#F15A29] focus:border-transparent"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                                
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full px-6 py-2 bg-[#F15A29] hover:bg-[#D14918] 
                       rounded-md transition-colors font-medium flex items-center justify-center"
                       disabled={disabled}
                    >
                        <UserPlus className="h-5 w-5 mr-2" />
                        Sign Up
                    </button>
                </form>
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[#121212] text-gray-400">Or continue with</span>
                        </div>
                    </div>
                    <button
                        onClick={handleGoogleSignup}
                        className="mt-4 w-full px-6 py-2 bg-white hover:bg-gray-100 
                       text-black rounded-md transition-colors font-medium 
                       flex items-center justify-center"
                    >
                        <FcGoogle className="h-5 w-5 mr-2" />
                        Sign up with Google
                    </button>
                </div>
                <p className="mt-6 text-center text-gray-400">
                    Already have an account?
                    <Link to="/login" className="text-[#F15A29] hover:underline ml-1">
                        Login
                    </Link>
                </p>
                {error && <p className="text-center py-2 px-6 bg-red-500 text-white mt-5 rounded-md">{error}</p>}
                {sent && <p className="text-center py-2 px-6 bg-green-500 text-white mt-5 rounded-md">Thank you, now check you e-mail inbox to proceed!</p>}
            </main>
        </div>
    )
}

