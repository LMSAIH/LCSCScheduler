import { useState, useEffect } from "react";
import axios from 'axios'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { APIBASEURL, SCHEDULEPREFIX } from "../utilities/ApiEndpoint";
import { useAuthContext } from "../context/AuthContext";
import { v4 as uuidv4 } from 'uuid'
import { TrashIcon, LoaderCircleIcon, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useDarkMode } from "../context/DarkModeContext"

type Event = {
    id: string;
    title: string;
    start?: Date;
    end?: Date;
    daysOfWeek?: number[];
    startTime?: string;
    endTime?: string;
    color: string;
    type: string;
};

export default function Scheduler() {
    const [events, setEvents] = useState<Event[]>([]);
    const [objectState, setObjectState] = useState<"Permanent" | "Temporary">("Permanent");
    const { token } = useAuthContext();
    const [loading, setIsLoading] = useState(false);
    const { darkMode } = useDarkMode();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            try {
                const response = await axios.get(`${APIBASEURL}${SCHEDULEPREFIX}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log(response.data)
                setEvents(response.data);

            } catch (err) {
                console.log(err);
            }

            setIsLoading(false);
        };

        fetchData();
    }, [token]);

    const handleSend = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(
                `${APIBASEURL}${SCHEDULEPREFIX}/`,
                events,
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err) {
            console.log(err);
        }
        setIsLoading(false);
    };

    const handleReset = async () => {
        setIsLoading(true);

        try {
            const response = await axios.post(
                `${APIBASEURL}${SCHEDULEPREFIX}/`,
                [],
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEvents([]);
        } catch (err) {
            console.log(err);
        }
        setIsLoading(false);
    };

    const handleEventClick = (info: any) => {
        setEvents(events.filter(event => event.id !== info.event.id));
    };

    const handleDateSelect = (info: any) => {
        if (!info) {
            return;
        }

        let eventStart: Date, eventEnd: Date;

        if (info.allDay && objectState !== "Permanent") {
            eventStart = new Date(info.end);
            eventStart.setHours(7, 0, 0, 0);
            eventEnd = new Date(info.end);
            eventEnd.setHours(19, 0, 0, 0);
        } else {
            eventStart = new Date(info.startStr);
            eventEnd = new Date(info.endStr);

            if (eventStart.getDay() !== eventEnd.getDay()) {
                document.body.style.cursor = "not-allowed";
                setTimeout(() => {
                    document.body.style.cursor = "";
                }, 300);
                return;
            }
            console.log(eventStart, eventEnd);
        }

        let newEvent: Event;
        if (objectState === "Permanent") {
            newEvent = {
                id: uuidv4(),
                title: "Permanent",
                daysOfWeek: [eventStart.getDay()],
                startTime: eventStart.toTimeString().slice(0, 8),
                endTime: eventEnd.toTimeString().slice(0, 8),
                color: "#AB0033", // Updated to match design
                type: objectState,
            };
        } else {
            newEvent = {
                id: uuidv4(),
                title: "Temporary",
                start: info.start,
                end: info.end,
                color: "#3B5F8A", // Updated to match design
                type: objectState,
            };
        }

        setEvents((prevEvents) => [...prevEvents, newEvent]);
        console.log(events)
    };

    const handleEventDrop = (info: any) => {
        if (info.event.allDay) {
            info.revert();
            return;
        }

        const updatedEvents = events.map((event) => {
            if (event.id === info.event.id) {
                if (event.type === "Temporary") {
                    return {
                        ...event,
                        start: info.event.start,
                        end: info.event.end,
                    };
                } else {
                    info.revert();
                    document.body.style.cursor = "not-allowed";
                    setTimeout(() => {
                        document.body.style.cursor = "";
                    }, 300);
                    return event;
                }
            }
            return event;
        });
        setEvents(updatedEvents);
    };

    return (
        <div className="w-full lg:w-4/5 mx-auto">
            {/* Toggle buttons with new design */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setObjectState("Permanent")}
                    className={`px-6 py-3 rounded-lg flex items-center justify-center transition-all duration-200
                      ${objectState === "Permanent"
                        ? "bg-gradient-to-r from-[#59001C] to-[#7A0026] text-white shadow-lg shadow-[#59001C]/20" 
                        : darkMode
                            ? "bg-[#1A1F23] border border-[#30332F] text-[#C1C1BD]"
                            : "bg-white border border-[#E2E8F0] text-[#4A5568]"
                      }`}
                >
                    <Calendar className="h-4 w-4 mr-2" />
                    Permanent Schedule
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setObjectState("Temporary")}
                    className={`px-6 py-3 rounded-lg flex items-center justify-center transition-all duration-200
                      ${objectState === "Temporary"
                        ? "bg-gradient-to-r from-[#59001C] to-[#7A0026] text-white shadow-lg shadow-[#59001C]/20" 
                        : darkMode
                            ? "bg-[#1A1F23] border border-[#30332F] text-[#C1C1BD]"
                            : "bg-white border border-[#E2E8F0] text-[#4A5568]"
                      }`}
                >
                    <Clock className="h-4 w-4 mr-2" />
                    Temporary Schedule
                </motion.button>
            </div>
            
            {/* Calendar wrapper with styling */}
            <div className={`bg-[${darkMode ? '#0F171E' : 'white'}] rounded-xl p-2 shadow-lg`}>
                <FullCalendar
                    timeZone="America/Vancouver"
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    eventDidMount={(info) => {
                        if (info.event.extendedProps.type === "Permanent") {
                            info.el.classList.add('permanent-event');
                            if (!darkMode) info.el.classList.add('light-mode-permanent');
                        } else {
                            info.el.classList.add('temporary-event');
                            if (!darkMode) info.el.classList.add('light-mode-temporary');
                        }
                    }}
                    editable
                    selectable
                    events={events}
                    select={handleDateSelect}
                    eventClick={handleEventClick}
                    eventDrop={handleEventDrop}
                    slotMinTime="07:00:00"
                    slotMaxTime="19:00:00"
                    slotDuration="01:00:00"
                    slotLabelInterval="01:00:00"
                    eventMaxStack={1}
                    slotEventOverlap={false}
                    eventOverlap={false}
                    selectOverlap={false}
                    dayMaxEvents={1}
                    allDaySlot={true}
                    allDayText="All day"
                    businessHours={{
                        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
                        startTime: "07:00",
                        endTime: "19:00",
                    }}
                    eventConstraint="businessHours"
                    validRange={{
                        start: new Date(new Date().setUTCMonth(new Date().getUTCMonth() - 1)),
                        end: new Date(new Date().setUTCFullYear(new Date().getUTCFullYear() + 1))
                    }}
                    longPressDelay={100}
                    eventLongPressDelay={100}
                    selectLongPressDelay={100}
                    aspectRatio={1}
                    scrollTimeReset={false}
                />
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                <motion.button 
                    onClick={handleSend}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-3 bg-gradient-to-r from-[#59001C] to-[#7A0026] 
                        text-white rounded-lg font-medium flex items-center justify-center
                        shadow-lg shadow-[#59001C]/20 transition-all duration-200"
                    disabled={loading}
                >
                    {loading ? (
                        <LoaderCircleIcon className="h-5 w-5 animate-spin mr-2" />
                    ) : (
                        "Save Schedule"
                    )}
                </motion.button>
                
                <motion.button
                    onClick={handleReset}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 rounded-lg flex items-center justify-center transition-all duration-200 ${
                        darkMode 
                          ? "bg-[#1A1F23] border border-[#30332F] hover:bg-[#30332F]/50 text-[#C1C1BD] hover:text-white" 
                          : "bg-white border border-[#E2E8F0] hover:bg-[#F0F2F5] text-[#4A5568] hover:text-[#1A1F23]"
                    }`}
                >
                    <TrashIcon className="h-5 w-5" />
                </motion.button>
            </div>
        </div>
    );
};