import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useAuthContext } from "../context/AuthContext";
import axios from 'axios';
import { APIBASEURL } from "../utilities/ApiEndpoint";
import { motion } from "framer-motion";
import { UsersIcon, AlertCircleIcon, CheckCircleIcon } from "lucide-react";
import { useDarkMode } from "../context/DarkModeContext"

type Event = {
    id: string;
    start: string;
    end: string;
    title: string;
    color: string;
    role: string;
};

type AvailabilitySlot = {
    startDate: string;
    endDate: string;
    numberOfPeople: number;
    maxPeopleAvailable: number;
    role: string;
};

const generateColor = (numberOfPeople: number, maxPeopleAvailable: number): string => {
    const percentage = maxPeopleAvailable > 0 ? (numberOfPeople / maxPeopleAvailable) * 100 : 0;

    if (percentage < 40) {
        return "#C01F1F"; // Dark red for low availability
    } else if (percentage < 70) {
        return "#D4A72C"; // Amber for medium availability
    } else {
        return "#2E7D32"; // Dark green for good availability
    }
};

export default function AdminScheduler() {
    const [events, setEvents] = useState<Event[] | []>([]);
    const [filterRole, setFilterRole] = useState<string>("All");
    const { user, token } = useAuthContext();
    const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { darkMode } = useDarkMode();

    if (!user.user_roles || !(user.user_roles.length > 0) || !user.user_roles[0].roles?.includes("Admin")) {
        return null;
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${APIBASEURL}/admin${filterRole != "All" ? `?role=${filterRole}` : "/"}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log(response.data);
                setAvailabilitySlots(response.data);
            } catch (err) {
                console.log(err);
            }
            setLoading(false);
        };

        fetchData();
        
    }, [token, filterRole]);

    useEffect(() => {
        const newEvents: Event[] = availabilitySlots.map((slot, i) => {
            return {
                id: i.toString(),
                start: slot.startDate,
                end: slot.endDate,
                title: `${slot.numberOfPeople}/${slot.maxPeopleAvailable}`,
                color: generateColor(slot.numberOfPeople, slot.maxPeopleAvailable),
                role: slot.role,
            };
        });
        setEvents(newEvents);
    }, [availabilitySlots]);

    const filteredEvents =
        filterRole === "All" ? events : events.filter((event: Event) => event.role === filterRole);

    const roles = ["All", "Media", "Developer", "Volunteer", "President", "Events"];

    return (
        <div className="w-full lg:w-4/5 mx-auto">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className={`text-xl font-semibold flex items-center ${
                        darkMode ? "text-white" : "text-[#1A1F23]"
                    }`}>
                        <UsersIcon className="h-5 w-5 mr-2 text-[#59001C]" />
                        Availability Overview
                    </h2>
                    
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <span className="h-3 w-3 rounded-full bg-[#C01F1F] mr-1.5"></span>
                            <span className="text-sm text-[#C1C1BD]">Low</span>
                        </div>
                        <div className="flex items-center">
                            <span className="h-3 w-3 rounded-full bg-[#D4A72C] mr-1.5"></span>
                            <span className="text-sm text-[#C1C1BD]">Medium</span>
                        </div>
                        <div className="flex items-center">
                            <span className="h-3 w-3 rounded-full bg-[#2E7D32] mr-1.5"></span>
                            <span className="text-sm text-[#C1C1BD]">Good</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-start mb-6">
                    {roles.map((role) => (
                        <motion.button
                            key={role}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setFilterRole(role)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                            ${filterRole === role 
                                ? "bg-gradient-to-r from-[#59001C] to-[#7A0026] text-white shadow-lg shadow-[#59001C]/20" 
                                : darkMode
                                    ? "bg-[#1A1F23] border border-[#30332F] text-[#C1C1BD] hover:bg-[#30332F]/50"
                                    : "bg-white border border-[#E2E8F0] text-[#4A5568] hover:bg-[#F0F2F5]"
                            }`}
                        >
                            {role}
                        </motion.button>
                    ))}
                </div>
            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`rounded-xl p-2 shadow-lg overflow-hidden `}
            >
                {loading && (
                    <div className={`absolute inset-0 z-10 flex items-center justify-center ${
                        darkMode ? "bg-[#0D1216]/60" : "bg-[#F8F9FA]/60"
                    } backdrop-blur-sm`}>
                        <div className={`p-4 rounded-lg shadow-lg flex items-center space-x-3 ${
                            darkMode 
                                ? "bg-[#1A1F23] border border-[#30332F]" 
                                : "bg-white border border-[#E2E8F0]"
                        }`}>
                            <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin border-[#59001C]"></div>
                            <span className={darkMode ? "text-[#C1C1BD]" : "text-[#4A5568]"}>
                                Loading availability data...
                            </span>
                        </div>
                    </div>
                )}
                
                {events.length === 0 && !loading && (
                    <div className="py-20 flex flex-col items-center justify-center text-center">
                        <AlertCircleIcon className="h-12 w-12 text-[#59001C] mb-4" />
                        <h3 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-[#1A1F23]"}`}>
                            No availability data
                        </h3>
                        <p className={`max-w-md ${darkMode ? "text-[#C1C1BD]" : "text-[#4A5568]"}`}>
                            There is no availability data for the selected role. Try selecting a different role or check if users have submitted their schedules.
                        </p>
                    </div>
                )}
                
                <FullCalendar
                    timeZone="America/Vancouver"
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    events={filteredEvents}
                    slotMinTime="07:00:00"
                    slotMaxTime="19:00:00"
                    slotDuration="01:00:00"
                    slotLabelInterval="01:00:00"
                    eventMaxStack={1}
                    slotEventOverlap={false}
                    eventOverlap={false}
                    selectOverlap={false}
                    dayMaxEvents={1}
                    allDaySlot={false}
                    validRange={{
                        start: new Date(new Date().setUTCMonth(new Date().getUTCMonth() - 1)),
                        end: new Date(new Date().setUTCFullYear(new Date().getUTCFullYear() + 1))
                    }}
                    eventClassNames="admin-event"
                    eventContent={(info) => {
                        const [available, total] = info.event.title.split('/');
                        const percentage = parseInt(available) / parseInt(total) * 100;
                        
                        return (
                            <div className="w-full h-full flex items-center justify-center px-1">
                                <div className="flex items-center">
                                    {percentage >= 70 ? (
                                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                                    ) : null}
                                    <span className="text-white font-medium">{info.event.title}</span>
                                </div>
                            </div>
                        );
                    }}
                />
            </motion.div>
            
            <div className={`mt-6 px-4 py-3 rounded-lg ${
                darkMode 
                    ? "bg-[#1A1F23]/50 border border-[#30332F]" 
                    : "bg-[#F0F2F5]/50 border border-[#E2E8F0]"
            }`}>
                <p className={`text-sm ${darkMode ? "text-[#C1C1BD]" : "text-[#4A5568]"}`}>
                    <strong className={darkMode ? "text-white" : "text-[#1A1F23]"}>Note:</strong> The numbers represent the ratio of available people to the total number of people in the role.
                </p>
            </div>
        </div>
    );
};