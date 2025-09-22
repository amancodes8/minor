import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

// --- Icon Components ---
const UserIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>);
const MailIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>);
const LockIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>);
const SpinnerIcon = () => (<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>);

export default function Signup() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    setFormError(null);
    try {
      await signup(data.email, data.password, data.name);
      navigate("/login");
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-gray-200 p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.05] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="w-full max-w-md z-10"
        >
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white">Create Your Account</h1>
                <p className="text-gray-400 mt-2">Start your journey to better nutrition.</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-700">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name Field */}
                    <div>
                        <label className="text-sm font-medium text-gray-400">Name</label>
                        <div className="relative mt-1">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3"><UserIcon /></span>
                            <input
                                {...register("name", { required: "Name is required" })}
                                placeholder="e.g., Jane Doe"
                                className={`input-field pl-10 ${errors.name ? 'border-red-500 ring-red-500' : 'border-gray-600'}`}
                            />
                        </div>
                        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="text-sm font-medium text-gray-400">Email</label>
                        <div className="relative mt-1">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3"><MailIcon /></span>
                            <input
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
                                })}
                                placeholder="you@example.com"
                                type="email"
                                className={`input-field pl-10 ${errors.email ? 'border-red-500 ring-red-500' : 'border-gray-600'}`}
                            />
                        </div>
                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="text-sm font-medium text-gray-400">Password</label>
                        <div className="relative mt-1">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3"><LockIcon /></span>
                            <input
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 8, message: "Password must be at least 8 characters" }
                                })}
                                placeholder="••••••••"
                                type="password"
                                className={`input-field pl-10 ${errors.password ? 'border-red-500 ring-red-500' : 'border-gray-600'}`}
                            />
                        </div>
                        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    {/* Form Submission Error */}
                    {formError && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg text-center">
                            {formError}
                        </motion.div>
                    )}

                    {/* Submit Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center py-3 px-4 font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <SpinnerIcon /> : 'Create Account'}
                    </motion.button>
                </form>

                <p className="text-center text-sm text-gray-400 mt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-indigo-400 hover:underline">
                        Log In
                    </Link>
                </p>
            </div>
        </motion.div>
    </div>
  );
}