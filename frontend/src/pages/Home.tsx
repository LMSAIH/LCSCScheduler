import Scheduler from "../components/Scheduler"
import AdminScheduler from "../components/AdminScheduler"
export default function Home() {

    return (

        <div className="min-h-screen bg-[#121212] text-white">
            <main className="mx-auto p-6">
                <Scheduler />
                <div className="mt-8 flex justify-center">
                    <button
                        className="px-6 py-2 bg-[#F15A29] hover:bg-[#D14918] 
                       rounded-md transition-colors font-medium"
                    >
                        Send Schedule
                    </button>
                </div>

                <AdminScheduler />
                
            </main>
        </div>

    )
}