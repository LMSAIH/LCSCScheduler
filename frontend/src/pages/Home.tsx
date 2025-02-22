import Scheduler from "../components/Scheduler"
import AdminScheduler from "../components/AdminScheduler"
export default function Home() {

    return (

        <div className="min-h-screen text-white">
            <main className="mx-auto p-6">
                <Scheduler />
            
                <AdminScheduler />
                
            </main>
        </div>

    )
}