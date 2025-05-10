import Scheduler from "../components/Scheduler"
import AdminScheduler from "../components/AdminScheduler"
import { Lightbulb, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDarkMode } from "../context/DarkModeContext"

export default function Home() {
    const [guideOpen, setGuideOpen] = useState(true);
    const {darkMode} = useDarkMode();

    return (
        <div className={`min-h-screen ${darkMode 
            ? "bg-gradient-to-br from-[#0D1216] to-[#131D25] text-white" 
            : "bg-gradient-to-br from-[#F8F9FA] to-[#EDF2F7] text-[#1A1F23]"}`}>
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none"></div>
            
            <main className="max-w-7xl mx-auto p-4 md:p-6">
                <h1 className={`text-2xl md:text-3xl font-bold mb-6 ${darkMode ? "text-white" : "text-[#1A1F23]"}`}>
                    Scheduler Dashboard
                </h1>
                
                <motion.div 
                    className={`mb-8 overflow-hidden rounded-xl shadow-lg ${darkMode 
                        ? "border border-[#30332F]/50 bg-[#0F171E]" 
                        : "border border-[#E2E8F0] bg-white"}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div 
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-[#59001C] to-[#7A0026] cursor-pointer"
                        onClick={() => setGuideOpen(!guideOpen)}
                    >
                        <div className="flex items-center">
                            <Lightbulb className="h-6 w-6 mr-3 text-white" />
                            <h2 className="text-xl font-semibold text-white">Usage Guide</h2>
                        </div>
                        <button className="text-white hover:bg-white/10 p-1 rounded-full">
                            {guideOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </button>
                    </div>
                    
                    <AnimatePresence>
                        {guideOpen && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className={`p-5 ${darkMode ? "text-[#C1C1BD]" : "text-[#4A5568]"}`}>
                                    <p className="mb-4">Before registering your availability, go to  
                                        <span className={`font-medium ${darkMode ? "text-white" : "text-[#1A1F23]"}`}>
                                            Settings
                                        </span> 
                                         and select your role(s). Then, return to the homepage to enter your schedule.
                                    </p>
                                    <p className={`mb-4 ${darkMode ? "text-white" : "text-[#1A1F23]"}`}>
                                        <strong>Please mark the hours when you are busy, not when you are free.</strong>
                                    </p>
                                    
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-start">
                                            <div className="h-6 w-6 rounded-full bg-[#59001C]/20 border border-[#59001C] flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 text-sm">1</div>
                                            <p>Recurrent events for regular commitments (e.g., class schedule).</p>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="h-6 w-6 rounded-full bg-[#59001C]/20 border border-[#59001C] flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 text-sm">2</div>
                                            <p>Temporary events for one-time commitments.</p>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="h-6 w-6 rounded-full bg-[#59001C]/20 border border-[#59001C] flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 text-sm">3</div>
                                            <p>On mobile: Hold a box to select a single hour or multiple boxes for a range.</p>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="h-6 w-6 rounded-full bg-[#59001C]/20 border border-[#59001C] flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 text-sm">4</div>
                                            <p>On computer: Click to select one hour or drag to select a range.</p>
                                        </div>
                                    </div>
                                    
                                    <div className={`flex p-3 rounded-lg items-center mt-4 ${darkMode 
                                        ? "bg-[#30332F]/20 border border-[#30332F]" 
                                        : "bg-[#EDF2F7] border border-[#E2E8F0]"}`}>
                                        <Lightbulb className={`h-5 w-5 mr-3 ${darkMode ? "text-[#59001C]" : "text-[#59001C]"}`} />
                                        <p>To delete a timeslot click on it. Remember to save your changes before leaving!</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
                
                <div className="space-y-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h2 className={`text-xl md:text-2xl font-semibold mb-4 ${darkMode ? "text-white" : "text-[#1A1F23]"}`}>
                            Your Schedule
                        </h2>
                        <div className={`rounded-xl shadow-lg p-4 md:p-6 ${darkMode 
                            ? "bg-[#0F171E] border border-[#30332F]/50" 
                            : "bg-white border border-[#E2E8F0]"}`}>
                            <Scheduler />
                        </div>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <h2 className={`text-xl md:text-2xl font-semibold mb-4 ${darkMode ? "text-white" : "text-[#1A1F23]"}`}>
                            Admin View
                        </h2>
                        <div className={`rounded-xl shadow-lg p-4 md:p-6 ${darkMode 
                            ? "bg-[#0F171E] border border-[#30332F]/50"
                            : "bg-white border border-[#E2E8F0]"}`}>
                            <AdminScheduler />
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    )
}