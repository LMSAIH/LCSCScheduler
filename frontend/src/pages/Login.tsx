import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { LogIn, Eye, EyeOff } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import { useNavigate } from "react-router-dom"
import { useAuthContext } from "../context/AuthContext"

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
            setError(err.message)
        }

    }

    const handleGoogleLogin = () => {

        console.log("Google login attempt")
    }

    return (
        <div className="min-h-screen text-white">
            <main className="max-w-md mx-auto p-6">
                <h1 className="text-3xl font-bold text-[#F15A29] mb-8">Login</h1>
                <form onSubmit={handleLogin} className="space-y-6">
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
                    <button
                        type="submit"
                        className="w-full px-6 py-2 bg-[#F15A29] hover:bg-[#D14918] 
                       rounded-md transition-colors font-medium flex items-center justify-center"
                    >
                        <LogIn className="h-5 w-5 mr-2" />
                        Login
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
                        onClick={handleGoogleLogin}
                        className="mt-4 w-full px-6 py-2 bg-white hover:bg-gray-100 
                       text-black rounded-md transition-colors font-medium 
                       flex items-center justify-center"
                    >
                        <FcGoogle className="h-5 w-5 mr-2" />
                        Sign in with Google
                    </button>
                </div>
                <p className="mt-6 text-center text-gray-400">
                    Don't have an account?
                    <Link to="/signup" className="text-[#F15A29] hover:underline ml-1">
                        Sign up
                    </Link>
                </p>
                {error && <p className="text-center py-2 px-6 bg-red-500 text-white mt-5 rounded-md">{error}</p>}
            </main>
        </div>
    )
}

