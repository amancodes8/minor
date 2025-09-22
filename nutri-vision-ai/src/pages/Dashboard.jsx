import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";

// --- Icon Components ---
const CameraIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
const FireIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45.385c-.345.675-.5 1.425-.5 2.182V11a1 1 0 11-2 0V5.12a1 1 0 00-1.45-.385c-.345.675-.5 1.425-.5 2.182V11a1 1 0 11-2 0v-1.737a1 1 0 00-1.45-.385C2.345 8.332 2 9.168 2 10c0 .351.028.695.083 1.034a8.053 8.053 0 003.442 5.922c.415.356.82.682 1.227.978a8.083 8.083 0 005.497 0c.407-.296.812-.622 1.227-.978A8.053 8.053 0 0018 11.034C18.056 10.695 18.083 10.351 18.083 10c0-.832-.345-1.668-.845-2.263a1 1 0 00-1.45.385V11a1 1 0 11-2 0v-1.737a1 1 0 00-1.45-.385c-.345.675-.5 1.425-.5 2.182V11a1 1 0 11-2 0V5.12a1 1 0 00-1.45-.385z" clipRule="evenodd" /></svg>);
const ChartBarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>);
const CalendarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>);
const LogoutIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>);
const SpinnerIcon = () => (<svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>);
const TrophyIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" /></svg>);

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [foodLogs, setFoodLogs] = useState([]);
  const [stats, setStats] = useState({ today: 0, avg: 0, week_count: 0 });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [activeTooltip, setActiveTooltip] = useState(null);

  useEffect(() => {
    if (user) fetchData();
    const savedGoal = localStorage.getItem('calorieGoal');
    if (savedGoal) setCalorieGoal(parseInt(savedGoal, 10));
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    let { data, error } = await supabase
      .from("foodlogs")
      .select("*")
      .eq("user_id", user.id)
      .gte("date", sevenDaysAgo.toISOString())
      .order("date", { ascending: false });
      
    if (!error) {
        processData(data);
    } else {
        console.error("Error fetching logs:", error);
    }
    setLoading(false);
  };

  const processData = (logs) => {
    setFoodLogs(logs.slice(0, 5));

    const today = new Date().toDateString();
    const todayLogs = logs.filter(log => new Date(log.date).toDateString() === today);
    const todayCalories = todayLogs.reduce((sum, log) => sum + log.calories, 0);

    const totalCaloriesLast7Days = logs.reduce((sum, log) => sum + log.calories, 0);
    const uniqueDays = new Set(logs.map(log => new Date(log.date).toDateString())).size;
    const avgCalories = uniqueDays > 0 ? totalCaloriesLast7Days / uniqueDays : 0;

    setStats({
      today: todayCalories,
      avg: Math.round(avgCalories),
      week_count: logs.length,
    });
    
    const dailyData = {};
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toLocaleDateString("en-US", { weekday: 'short' });
        dailyData[key] = 0;
    }
    logs.forEach(log => {
        const key = new Date(log.date).toLocaleDateString("en-US", { weekday: 'short' });
        if(key in dailyData) dailyData[key] += log.calories;
    });

    const maxCal = Math.max(...Object.values(dailyData), 1000);
    setChartData(Object.entries(dailyData).map(([day, cals]) => ({ day, cals, height: (cals / maxCal) * 100 })));
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
        logout();
    }, 1000);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  
  const handleGoalChange = (e) => {
    const newGoal = parseInt(e.target.value, 10);
    setCalorieGoal(newGoal);
    localStorage.setItem('calorieGoal', newGoal);
  };

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen font-sans">
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">{getGreeting()}, {user?.user_metadata.name}!</h1>
                <p className="text-gray-400 mt-1">Ready to conquer your health goals today?</p>
            </div>
            <Link to="/scanner" className="mt-4 sm:mt-0 inline-flex items-center justify-center px-6 py-3 font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 transform hover:-translate-y-1">
                <CameraIcon /> Log a Meal
            </Link>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
                <GoalProgress stats={stats} calorieGoal={calorieGoal} handleGoalChange={handleGoalChange} />
                <div>
                    <h2 className="text-2xl font-semibold text-white mb-4">Recent Activity</h2>
                    {loading ? <p className="text-gray-400">Loading your logs...</p> : (
                        foodLogs.length > 0 ? (
                            <div className="space-y-4">
                                {foodLogs.map((log, index) => <LogCard key={log.id} log={log} index={index} />)}
                            </div>
                        ) : (
                            <div className="text-center bg-gray-800/50 p-12 rounded-lg border-2 border-dashed border-gray-700"><h3 className="text-xl font-medium text-white">No activity this week</h3><p className="mt-1 text-sm text-gray-400">Scan your first item to get started!</p></div>
                        )
                    )}
                </div>
                <Achievements foodLogs={foodLogs} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 mt-8 lg:mt-0 space-y-8">
                <div>
                    <h2 className="text-2xl font-semibold text-white mb-4">Weekly Snapshot</h2>
                    <div className="space-y-4">
                        <StatCard icon={<ChartBarIcon />} color="text-indigo-400" title="Daily Average" value={`${stats.avg} kcal`} loading={loading} />
                        <StatCard icon={<CalendarIcon />} color="text-green-400" title="Logs This Week" value={stats.week_count} loading={loading} />
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-semibold text-white mb-4">Daily Intake Chart</h2>
                    <div className="bg-gray-800/50 rounded-xl shadow-lg p-5 h-64 flex justify-between items-end space-x-2 relative">
                        <AnimatePresence>
                            {chartData.map((d, i) => (
                                <motion.div key={d.day} onHoverStart={() => setActiveTooltip(d)} onHoverEnd={() => setActiveTooltip(null)} className="w-full flex flex-col items-center justify-end h-full cursor-pointer">
                                    <motion.div initial={{ height: 0 }} animate={{ height: `${d.height}%` }} transition={{ duration: 0.8, delay: i * 0.1, type: "spring", stiffness: 80 }} className="w-3/4 bg-gradient-to-t from-purple-600 to-indigo-500 rounded-t-md"></motion.div>
                                    <p className="text-xs font-medium text-gray-400 mt-2">{d.day}</p>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {activeTooltip && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg">{`${activeTooltip.cals.toFixed(0)} kcal`}</div>}
                    </div>
                </div>
                 <div className="bg-gray-800/50 rounded-xl shadow-lg p-5">
                    <h3 className="font-semibold text-white mb-2 flex items-center"><TrophyIcon className="mr-2 text-yellow-400"/> AI Insight</h3>
                    <p className="text-sm text-gray-400">{stats.avg > 2500 ? "Your average weekly intake is a bit high. Consider incorporating more leafy greens." : "You're doing great with your weekly average. Keep up the balanced diet!"}</p>
                </div>
                <div className="pt-4">
                    <button onClick={handleLogout} disabled={isLoggingOut} className="w-full flex items-center justify-center px-4 py-2 bg-gray-700/50 text-gray-300 border border-gray-600 rounded-lg shadow-sm hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoggingOut ? <><SpinnerIcon /><span className="ml-2">Logging out...</span></> : <><LogoutIcon /><span className="ml-2">Logout</span></>}
                    </button>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}

// --- Reusable Sub-components ---
const GoalProgress = ({ stats, calorieGoal, handleGoalChange }) => {
    const progress = Math.min((stats.today / calorieGoal) * 100, 100);
    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="bg-gray-800/50 rounded-xl shadow-lg p-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="relative w-36 h-36">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle className="text-gray-700" strokeWidth="8" stroke="currentColor" fill="transparent" r="42" cx="50" cy="50"/>
                        <motion.circle 
                            className={progress < 80 ? "text-indigo-500" : progress < 100 ? "text-green-500" : "text-orange-500"} 
                            strokeWidth="8" strokeLinecap="round" stroke="currentColor" fill="transparent" r="42" cx="50" cy="50"
                            initial={{ strokeDashoffset: 264 }}
                            animate={{ strokeDashoffset: 264 - (progress / 100) * 264 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            style={{ strokeDasharray: 264 }}
                            transform="rotate(-90 50 50)"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-white">{Math.round(stats.today)}</span>
                        <span className="text-gray-400 text-sm">kcal</span>
                    </div>
                </div>
                <div className="text-center sm:text-left mt-4 sm:mt-0 sm:ml-6">
                    <h2 className="text-2xl font-bold text-white">Today's Progress</h2>
                    <p className="text-gray-400">Your Goal: <span className="font-semibold text-indigo-400">{calorieGoal} kcal</span></p>
                    <div className="mt-2">
                        <label htmlFor="goal" className="text-xs text-gray-500">Adjust Goal:</label>
                        <input type="range" id="goal" min="1000" max="4000" step="100" value={calorieGoal} onChange={handleGoalChange} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"/>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const LogCard = ({ log, index }) => (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} className="bg-gray-800/50 rounded-xl shadow-lg p-5 transition-all duration-300 hover:bg-gray-800 hover:scale-[1.02]">
        <div className="flex justify-between items-start mb-3"><h3 className="font-bold text-lg text-white w-3/4">{log.foodName}</h3><p className="text-xs text-gray-400 whitespace-nowrap">{new Date(log.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}</p></div>
        <div className="flex items-center space-x-4 text-sm text-gray-300">
            <div className="flex items-center bg-orange-500/10 text-orange-400 font-medium px-3 py-1 rounded-full"><FireIcon /><span>{Math.round(log.calories)} kcal</span></div>
            <div className="hidden sm:block text-gray-400"><strong>P:</strong> {log.protein?.toFixed(1) || 'N/A'}g</div>
            <div className="hidden sm:block text-gray-400"><strong>C:</strong> {log.carbs?.toFixed(1) || 'N/A'}g</div>
            <div className="hidden sm:block text-gray-400"><strong>F:</strong> {log.fats?.toFixed(1) || 'N/A'}g</div>
        </div>
    </motion.div>
);

const StatCard = ({ icon, color, title, value, loading }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    return(
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="bg-gray-800/50 rounded-xl shadow-lg p-4 flex items-center relative overflow-hidden">
            <motion.div initial={{ scale: 3, opacity: 0 }} animate={isInView ? { scale: 1, opacity: 0.05 } : {}} transition={{ duration: 0.7 }} className={`absolute -right-4 -bottom-4 text-gray-600`}>{icon}</motion.div>
            <div className={`p-3 bg-gray-900 rounded-lg ${color} z-10`}>{icon}</div>
            <div className="ml-4 z-10">
                <p className="text-sm text-gray-400">{title}</p>
                {loading ? <div className="h-6 w-24 bg-gray-700 rounded animate-pulse mt-1"></div> : <p className="text-xl font-bold text-white">{value}</p>}
            </div>
        </motion.div>
    )
};

const Achievements = ({ foodLogs }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    
    const achievementsList = [
        { id: 'first_log', title: 'First Log', unlocked: foodLogs.length >= 1, icon: '🥇' },
        { id: '3_day_streak', title: '3 Day Streak', unlocked: new Set(foodLogs.map(log => new Date(log.date).toDateString())).size >= 3, icon: '🔥' },
        { id: 'healthy_day', title: 'Healthy Day', unlocked: foodLogs.some(log => log.calories < 500 && new Date(log.date).toDateString() === new Date().toDateString()), icon: '🥗' },
        { id: '5_logs', title: '5 Logs', unlocked: foodLogs.length >= 5, icon: '🍽️' },
    ];

    return (
        <motion.div ref={ref} initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}>
            <h2 className="text-2xl font-semibold text-white mb-4">Achievements</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {achievementsList.map((ach, index) => (
                    <motion.div key={ach.id} initial={{ opacity: 0, scale: 0.8 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.3 + index * 0.1 }} className={`p-4 rounded-xl text-center transition-all ${ach.unlocked ? 'bg-gray-700/80' : 'bg-gray-800/50'}`}>
                        <div className={`text-4xl transition-transform duration-500 ${ach.unlocked ? 'scale-100' : 'scale-75 grayscale'}`}>{ach.icon}</div>
                        <p className={`mt-2 text-xs font-semibold ${ach.unlocked ? 'text-white' : 'text-gray-500'}`}>{ach.title}</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};