import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// --- Reusable Section Component for scroll animations ---
const Section = ({ children, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`py-20 px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </motion.section>
  );
};

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-sans overflow-x-hidden">
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col justify-center items-center text-center relative px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-green-800/20 via-blue-800/20 to-purple-800/20 animate-gradient-x opacity-30"></div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="z-10"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-blue-400 to-purple-400"
          >
            Nutri-Vision AI
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg sm:text-xl max-w-2xl mx-auto text-gray-300 mb-8">
            Effortlessly track your meals, understand your nutrition, and achieve your health goals with the power of AI.
          </motion.p>
          <motion.div variants={itemVariants} className="flex gap-4 justify-center">
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 25px rgba(110, 231, 183, 0.7)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-green-400 to-teal-500 text-white font-bold rounded-full transition-shadow"
              >
                Get Started Free
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 border border-gray-600 rounded-full hover:bg-gray-700/40 transition"
              >
                Login
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
        <div className="absolute bottom-10 animate-bounce">
          <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>

      {/* How It Works Section */}
      <Section className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-green-300">Effortless Tracking in 3 Steps</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <HowItWorksCard icon="📸" title="Scan Your Meal" description="Snap a photo or describe your food. Our AI instantly recognizes what you're eating." />
          <HowItWorksCard icon="🔬" title="Get Instant Analysis" description="Receive a detailed breakdown of calories, macros, and a simple nutrition score." />
          <HowItWorksCard icon="📈" title="Track Your Progress" description="Log your meals to monitor your daily intake, follow trends, and hit your goals." />
        </div>
      </Section>

      {/* Why Nutri-Vision AI Section */}
      <Section className="bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-teal-300">Go Beyond Simple Calorie Counting</h2>
          <p className="text-center text-gray-400 max-w-3xl mx-auto mb-12">Nutri-Vision AI is your personal nutrition assistant, designed to make healthy eating intuitive and sustainable.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard title="AI-Powered Recognition" description="Our advanced AI identifies multiple food items from a single image or text description, saving you time and effort." />
            <FeatureCard title="Holistic Nutrition Score" description="Understand your meal's healthiness at a glance with a simple A+ to D- grade, based on a balanced macro profile." />
            <FeatureCard title="Gamified Motivation" description="Stay engaged by unlocking achievements and maintaining streaks. Healthy habits should be rewarding!" />
            <FeatureCard title="Personalized Goals" description="Set your own calorie targets and watch your progress with our beautiful, animated dashboard widgets." />
            <FeatureCard title="Data-Driven Insights" description="Visualize your eating habits with interactive charts and get simple AI insights to help you improve." />
            <FeatureCard title="Trusted Data Sources" description="Our nutritional data is powered by comprehensive, science-backed databases like the USDA FoodData Central." />
          </div>
        </div>
      </Section>

      {/* Feature Deep Dive Sections */}
      <Section className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-4 text-green-300">From Plate to Pixels to Progress</h3>
            <p className="text-gray-300 mb-6">Forget tedious manual entry. Nutri-Vision's scanner intelligently identifies ingredients and serves up a comprehensive analysis in seconds.</p>
            <ul className="space-y-2 text-gray-400">
              <li>✓ Instant analysis from a single photo</li>
              <li>✓ Recognizes complex, multi-ingredient meals</li>
              <li>✓ Simple A+ score for immediate feedback</li>
            </ul>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
            <div className="bg-gradient-to-tr from-green-400 to-blue-400 rounded-2xl p-4 shadow-2xl h-64"></div>
          </motion.div>
        </div>
      </Section>

      <Section className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }} className="order-2 md:order-1">
            <div className="bg-gradient-to-tr from-purple-400 to-pink-400 rounded-2xl p-4 shadow-2xl h-64"></div>
          </motion.div>
          <div className="order-1 md:order-2">
            <h3 className="text-3xl font-bold mb-4 text-teal-300">Your Health, Visualized</h3>
            <p className="text-gray-300 mb-6">Your dashboard is your personal health command center with animated goal rings and interactive charts.</p>
            <ul className="space-y-2 text-gray-400">
              <li>✓ Interactive charts for weekly trends</li>
              <li>✓ Gamified achievements to build habits</li>
              <li>✓ Personalized calorie and macro goals</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Articles Section */}
      <Section className="bg-gray-900/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-green-300">Fuel Your Knowledge</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <ArticleCard title="Understanding Macronutrients" summary="Learn the vital roles of protein, carbs, and fats and how to balance them." />
            <ArticleCard title="Why Micronutrients Matter" summary="Calories aren't the whole story. Discover the importance of vitamins and minerals." />
            <ArticleCard title="The Mindful Eating Advantage" summary="Build a healthier relationship with food by learning simple mindful eating techniques." />
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-teal-300">Loved by Users Everywhere</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <TestimonialCard quote="Nutri-Vision AI has changed the game for me. I finally understand what I'm eating without the hassle of manual logging." author="Sarah J." />
          <TestimonialCard quote="The nutrition score is brilliant! I feel like I'm actually learning." author="Michael B." />
        </div>
      </Section>

      {/* Final CTA */}
      <Section className="text-center">
        <h2 className="text-4xl font-bold mb-4 text-green-300">Ready to Transform Your Health?</h2>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">Take the guesswork out of nutrition. Start your journey with Nutri-Vision AI today.</p>
        <Link to="/signup">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 25px rgba(110, 231, 183, 0.7)" }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 bg-gradient-to-r from-green-400 to-teal-500 text-white font-bold rounded-full text-lg transition-shadow"
          >
            Sign Up for Free
          </motion.button>
        </Link>
      </Section>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-gray-700 text-gray-500">
        <p>&copy; {new Date().getFullYear()} Nutri-Vision AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

// --- Child Components ---

const HowItWorksCard = ({ icon, title, description }) => (
  <motion.div whileHover={{ y: -5, scale: 1.02 }} className="bg-gray-800/40 p-8 rounded-2xl border border-white/10 backdrop-blur-sm transition">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-green-300">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </motion.div>
);

const FeatureCard = ({ title, description }) => (
  <motion.div whileHover={{ scale: 1.03, y: -5 }} className="bg-gray-800/40 p-6 rounded-xl border border-white/10 transition">
    <h3 className="font-semibold mb-2 text-teal-300">{title}</h3>
    <p className="text-sm text-gray-300">{description}</p>
  </motion.div>
);

const ArticleCard = ({ title, summary }) => (
  <motion.div whileHover={{y: -10, boxShadow: "0px 10px 30px rgba(0,0,0,0.3)"}} className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer transition">
    <div className="h-40 bg-gradient-to-tr from-green-500 to-blue-500 flex items-center justify-center text-white text-lg font-semibold">[Image]</div>
    <div className="p-6">
      <h3 className="font-semibold mb-2 text-teal-300">{title}</h3>
      <p className="text-sm text-gray-300 mb-4">{summary}</p>
      <span className="font-semibold text-green-400 text-sm">Read More &rarr;</span>
    </div>
  </motion.div>
);

const TestimonialCard = ({ quote, author }) => (
  <motion.div whileHover={{ scale: 1.02, y: -5 }} className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 transition">
    <p className="text-lg italic text-gray-300">"{quote}"</p>
    <p className="text-right font-semibold mt-4 text-green-300">- {author}</p>
  </motion.div>
);
