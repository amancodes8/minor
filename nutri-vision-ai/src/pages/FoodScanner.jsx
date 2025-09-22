// src/pages/FoodScanner.jsx
import { useState, useContext, useEffect, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, animate } from "framer-motion";
// --- NEW: Import speech recognition library ---
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";


/* --------------------------
   Icons / Small UI bits
   -------------------------- */
const UploadIcon = () => (
  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const CheckCircleIcon = () => (
  <motion.svg initial={{ scale: 0 }} animate={{ scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } }} xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </motion.svg>
);
const SpinnerIcon = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// --- NEW: Microphone Icon ---
const MicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>;

const FireIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45.385c-.345.675-.5 1.425-.5 2.182V11a1 1 0 11-2 0V5.12a1 1 0 00-1.45-.385c-.345.675-.5 1.425-.5 2.182V11a1 1 0 11-2 0v-1.737a1 1 0 00-1.45-.385C2.345 8.332 2 9.168 2 10c0 .351.028.695.083 1.034a8.053 8.053 0 003.442 5.922c.415.356.82.682 1.227.978a8.083 8.083 0 005.497 0c.407-.296.812-.622 1.227-.978A8.053 8.053 0 0018 11.034C18.056 10.695 18.083 10.351 18.083 10c0-.832-.345-1.668-.845-2.263a1 1 0 00-1.45.385V11a1 1 0 11-2 0v-1.737a1 1 0 00-1.45-.385c-.345.675-.5 1.425-.5 2.182V11a1 1 0 11-2 0V5.12a1 1 0 00-1.45-.385z" clipRule="evenodd" /></svg>;
const ProteinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v.25a.75.75 0 01-1.5 0V2.75A.75.75 0 0110 2zM5.23 4.77a.75.75 0 011.06 0l.708.707a.75.75 0 01-1.06 1.06l-.707-.707a.75.75 0 010-1.06zm9.54 0a.75.75 0 010 1.06l-.707.707a.75.75 0 11-1.06-1.06l.707-.707a.75.75 0 011.06 0zM10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" /></svg>;
const CarbsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.5a.75.75 0 001.5 0v-8.5z" /><path fillRule="evenodd" d="M10 1a9 9 0 100 18 9 9 0 000-18zM3.204 11.2a.75.75 0 01.13-1.052A6.965 6.965 0 0110 8.25a6.965 6.965 0 016.666 1.898.75.75 0 01-1.182.923A5.465 5.465 0 0010 9.75a5.465 5.465 0 00-5.485 1.498.75.75 0 01-1.296-.548z" clipRule="evenodd" /></svg>;
const FatsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 3.636a.75.75 0 011.06 0L10 7.586l3.89-3.95a.75.75 0 111.06 1.06L11.06 8.646l3.95 3.89a.75.75 0 11-1.06 1.06L10 9.707l-3.89 3.95a.75.75 0 11-1.06-1.06l3.95-3.89-3.95-3.89a.75.75 0 010-1.06z" clipRule="evenodd" /></svg>;

/* --------------------------
   Animated Counter
   -------------------------- */
const AnimatedCounter = ({ value = 0, className = "" }) => {
  const ref = useRef(null);

  useEffect(() => {
    const start = 0;
    const controls = animate(start, Number(value) || 0, {
      duration: 0.9,
      onUpdate(latest) {
        if (ref.current) ref.current.textContent = Math.round(latest);
      },
    });
    return () => controls.stop();
  }, [value]);

  return <span ref={ref} className={className} />;
};

/* --------------------------
   Helpers: robust parsing
   -------------------------- */
const safeNumber = (v) => {
  if (v === null || v === undefined) return 0;
  if (typeof v === "number") return Number(isFinite(v) ? v : 0);
  if (typeof v === "string") {
    const cleaned = v.replace(/[^\d.-]/g, "");
    const n = Number(cleaned);
    return isNaN(n) ? 0 : n;
  }
  return 0;
};

const macroKeysMap = {
  calories: ["calories", "energy", "kcal", "energy_kcal", "cal"],
  protein: ["protein", "protein_g"],
  carbs: ["carbs", "carbs_g", "carbohydrate", "carbohydrate_by_difference", "carbs_g"],
  fats: ["fats", "fat_g", "total_lipid", "total_lipid__fat"],
  fiber: ["fiber", "fiber_g", "fiber_total"],
  sugar: ["sugar", "sugar_g"],
};

function extractMacros(obj = {}) {
  const macros = { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0 };
  if (!obj || typeof obj !== "object") return macros;

  if (Array.isArray(obj)) {
    obj.forEach((n) => {
      const name = (n?.nutrient?.name || "").toLowerCase();
      const amount = safeNumber(n?.amount);
      if (name.includes("energy") || name.includes("kcal")) macros.calories += amount;
      if (name.includes("protein")) macros.protein += amount;
      if (name.includes("carbohydrate")) macros.carbs += amount;
      if (name.includes("fat")) macros.fats += amount;
      if (name.includes("fiber")) macros.fiber += amount;
      if (name.includes("sugar")) macros.sugar += amount;
    });
    return macros;
  }

  const flat = obj;
  for (const [k, candidates] of Object.entries(macroKeysMap)) {
    for (const cand of candidates) {
      if (flat[cand] !== undefined) {
        macros[k] = safeNumber(flat[cand]);
        break;
      }
    }
  }

  if (Object.values(macros).every((v) => v === 0)) {
    if (obj.macros && typeof obj.macros === "object") {
      return extractMacros(obj.macros);
    }
    if (obj.nutrition && typeof obj.nutrition === "object") {
      return extractMacros(obj.nutrition);
    }
  }

  return macros;
}

function normalizeApiResponse(responseData = {}) {
  const out = {
    success: !!responseData.success,
    items: [],
    totals: { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0 },
    warnings: Array.isArray(responseData.warnings) ? responseData.warnings : [],
    raw: responseData,
  };

  const rawItems = Array.isArray(responseData.items) ? responseData.items : [];

  rawItems.forEach((it) => {
    const name = it.name || it.ingredient || it.foodName || it.food_name || it.label || "Unknown";
    const quantity = safeNumber(it.quantity ?? it.qty ?? 1);
    const macros = extractMacros(it.macros ?? it);
    out.items.push({ name, quantity, macros });
  });

  if (responseData.totals && typeof responseData.totals === "object") {
    const t = responseData.totals;
    const mapped = {
      calories: macroKeysMap.calories.some((k) => t[k] !== undefined) ? extractMacros(t).calories : (t.calories ?? t.calories_kcal ?? t.energy ?? 0),
      protein: extractMacros(t).protein || t.protein || t.protein_g || 0,
      carbs: extractMacros(t).carbs || t.carbs || t.carbs_g || t.carbohydrate || 0,
      fats: extractMacros(t).fats || t.fats || t.fat_g || t.total_fat || 0,
      fiber: extractMacros(t).fiber || t.fiber || t.fiber_g || 0,
      sugar: extractMacros(t).sugar || t.sugar || t.sugar_g || 0,
    };

    out.totals = {
      calories: safeNumber(mapped.calories),
      protein: safeNumber(mapped.protein),
      carbs: safeNumber(mapped.carbs),
      fats: safeNumber(mapped.fats),
      fiber: safeNumber(mapped.fiber),
      sugar: safeNumber(mapped.sugar),
    };
  }

  if (out.items.length > 0 && (!out.totals || Object.values(out.totals).every((v) => v === 0))) {
    const totals = { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0 };
    out.items.forEach((it) => {
      totals.calories += safeNumber(it.macros?.calories) * safeNumber(it.quantity);
      totals.protein += safeNumber(it.macros?.protein) * safeNumber(it.quantity);
      totals.carbs += safeNumber(it.macros?.carbs) * safeNumber(it.quantity);
      totals.fats += safeNumber(it.macros?.fats) * safeNumber(it.quantity);
      totals.fiber += safeNumber(it.macros?.fiber) * safeNumber(it.quantity);
      totals.sugar += safeNumber(it.macros?.sugar) * safeNumber(it.quantity);
    });
    out.totals = Object.fromEntries(Object.entries(totals).map(([k, v]) => [k, Math.round(v * 10) / 10]));
  }

  if (out.items.length === 0 && responseData.items && Array.isArray(responseData.items)) {
    out.items.push({ name: responseData.input || "Logged Meal", quantity: 1, macros: out.totals });
  }

  return out;
}

/* --------------------------
   Component
   -------------------------- */
export default function FoodScanner() {
  const { user } = useContext(AuthContext);

  const [scanMode, setScanMode] = useState("image");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [textQuery, setTextQuery] = useState("");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);

  // --- NEW: Speech Recognition Hooks ---
  const {
    transcript,
    listening,
    finalTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const BASE_API_URL = "https://nv-food-logging-api.onrender.com";

  // --- NEW: Effect to update text query from voice transcript ---
  useEffect(() => {
    if (finalTranscript) {
      setTextQuery(finalTranscript);
    }
  }, [finalTranscript]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]); // Corrected dependency array


  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }
    setError(null);
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setSavedSuccessfully(false);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview("");
    }
  };

  const buildFoodName = (items = []) => {
    if (!items || items.length === 0) return "Logged Meal";
    return items.map((i) => i.name).slice(0, 3).join(", ");
  };

  const handleScan = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setSavedSuccessfully(false);
    // --- NEW: Stop listening if active ---
    SpeechRecognition.stopListening();

    try {
      let apiResponse;
      if (scanMode === "image") {
        if (!imageFile) throw new Error("Please upload an image first.");
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("include_nutrition", "true");
        apiResponse = await axios.post(`${BASE_API_URL}/analyze/image`, formData, { timeout: 30000 });
      } else {
        if (!textQuery || textQuery.trim().length === 0) throw new Error("Please enter a description to analyze.");
        const payload = { text: textQuery.trim(), include_usda: true };
        apiResponse = await axios.post(`${BASE_API_URL}/analyze/text`, payload, { timeout: 20000 });
      }

      const normalized = normalizeApiResponse(apiResponse.data || {});

      if (!normalized.success && (!normalized.items || normalized.items.length === 0)) {
        const msg = (apiResponse.data && (apiResponse.data.warnings || apiResponse.data.message || apiResponse.data.detail)) || "Analysis returned no usable data.";
        throw new Error(Array.isArray(msg) ? msg.join(", ") : msg);
      }

      const foodName = buildFoodName(normalized.items);
      const totals = normalized.totals || { calories: 0, protein: 0, carbs: 0, fats: 0 };

      const record = {
        user_id: user?.id,
        foodName,
        calories: Math.round((totals.calories || 0) * 10) / 10,
        protein: Math.round((totals.protein || 0) * 10) / 10,
        carbs: Math.round((totals.carbs || 0) * 10) / 10,
        fats: Math.round((totals.fats || 0) * 10) / 10,
        date: new Date().toISOString(),
        raw: JSON.stringify(normalized.raw || {}),
      };

      const { error: insertError } = await supabase.from("foodlogs").insert([record]);
      if (insertError) {
        console.error("Supabase insert error:", insertError);
        setError("Analysis succeeded but saving to database failed. See console for details.");
      } else {
        setSavedSuccessfully(true);
      }

      setResult(normalized);
    } catch (err) {
      console.error(err);
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to analyze food. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setResult(null);
    setError(null);
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview("");
    }
    setTextQuery("");
    setSavedSuccessfully(false);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-4">
          <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-800 transition-colors font-medium text-sm">
            &larr; Back to Dashboard
          </Link>
        </div>

        <AnimatePresence mode="wait">
          {result ? (
            // --- Result View ---
            <motion.div key="result" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
              <div className="text-center">
                <CheckCircleIcon />
                <h2 className="text-3xl font-bold text-gray-800 mt-4">Log {savedSuccessfully ? "Saved" : "Processed"}</h2>
                <p className="text-gray-500 mt-1">Here's the nutritional summary.</p>

                <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                  <MacroStatCard value={result.totals.calories} unit="kcal" label="Calories" color="text-orange-500" Icon={FireIcon} />
                  <MacroStatCard value={result.totals.protein} unit="g" label="Protein" color="text-red-500" Icon={ProteinIcon} />
                  <MacroStatCard value={result.totals.carbs} unit="g" label="Carbs" color="text-yellow-500" Icon={CarbsIcon} />
                  <MacroStatCard value={result.totals.fats} unit="g" label="Fats" color="text-blue-500" Icon={FatsIcon} />
                </div>

                <div className="mt-6 text-left">
                  {result.items?.length > 0 && <h3 className="font-semibold text-gray-700 mb-2">Detected Items</h3>}
                  <motion.ul className="space-y-1">
                    {result.items.map((item, index) => (
                      <motion.li
                        key={`${item.name}-${index}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0, transition: { delay: 0.3 + index * 0.05 } }}
                        className="text-sm text-gray-600 bg-slate-50 p-2 rounded-md"
                      >
                        <div className="flex justify-between">
                          <div>{item.name}</div>
                          <div className="text-xs text-gray-500">{item.quantity}x</div>
                        </div>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>

                {result.warnings?.length > 0 && (
                  <div className="mt-4 text-left bg-yellow-50 border-l-4 border-yellow-400 p-3">
                    <h4 className="font-semibold text-yellow-800">Please Note:</h4>
                    <ul className="text-sm text-yellow-700 list-disc list-inside">{result.warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
                  </div>
                )}

                {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

                <motion.div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={resetScanner} className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform">
                    Scan Another Item
                  </motion.button>
                  <Link to="/dashboard" className="w-full sm:w-auto">
                    <motion.button whileHover={{ scale: 1.03 }} className="w-full sm:w-auto border border-gray-200 bg-white text-gray-700 font-semibold py-3 px-6 rounded-lg shadow-sm">
                      View Logs
                    </motion.button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            // --- Scanner View ---
            <motion.div key="scanner" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
              <h1 className="text-center text-3xl font-bold text-gray-800">Log Your Food</h1>
              <p className="text-center text-gray-500 mt-2 mb-6">Analyze a meal from an image or text.</p>

              <div className="relative flex bg-slate-100 p-1 rounded-full mb-6">
                <div className={`absolute top-1 bottom-1 w-1/2 bg-indigo-600 rounded-full shadow-lg transition-transform duration-300 ease-in-out ${scanMode === "text" ? "translate-x-full" : "translate-x-0"}`}></div>
                <button onClick={() => setScanMode("image")} className={`relative z-10 w-1/2 py-2 rounded-full font-semibold transition-colors ${scanMode === "image" ? "text-white" : "text-gray-600"}`}>Image</button>
                <button onClick={() => setScanMode("text")} className={`relative z-10 w-1/2 py-2 rounded-full font-semibold transition-colors ${scanMode === "text" ? "text-white" : "text-gray-600"}`}>Text</button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={scanMode} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  {scanMode === "image" ? (
                    <div>
                      {!imagePreview ? (
                        <label htmlFor="file-upload" className="relative mt-1 flex justify-center w-full px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors">
                          <div className="space-y-1 text-center">
                            <UploadIcon />
                            <div className="flex text-sm text-gray-600"><p className="pl-1">Click to upload or drag and drop</p></div>
                            <p className="text-xs text-gray-500">PNG, JPG, up to 10MB</p>
                          </div>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                        </label>
                      ) : (
                        <div className="relative w-full max-w-sm mx-auto">
                          <img src={imagePreview} alt="Selected food" className="w-full h-auto rounded-lg shadow-md" />
                          <button onClick={handleRemoveImage} className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1.5 hover:bg-opacity-75 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    // --- NEW: Text input area with voice button ---
                    <div className="relative">
                      <textarea
                        value={textQuery}
                        onChange={(e) => setTextQuery(e.target.value)}
                        placeholder={listening ? "Listening..." : "e.g., '1 large apple and 2 slices of whole wheat toast with peanut butter'"}
                        className="w-full h-24 p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                      />
                      {browserSupportsSpeechRecognition && (
                        <button
                          type="button"
                          onClick={() => listening ? SpeechRecognition.stopListening() : SpeechRecognition.startListening({ continuous: true })}
                          className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${listening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                        >
                          <MicIcon />
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {error && <p className="text-red-600 bg-red-50 p-3 rounded-lg text-sm text-center mt-4">{error}</p>}
              {savedSuccessfully && <p className="text-green-700 bg-green-50 p-2 rounded-md text-sm text-center mt-4">Saved to your logs ✅</p>}

              <div className="mt-6">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleScan} className="w-full flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={loading || (scanMode === "image" && !imageFile) || (scanMode === "text" && !textQuery)}>
                  {loading ? (<><SpinnerIcon />Analyzing...</>) : `Analyze ${scanMode === "image" ? "Image" : "Text"}`}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* --------------------------
   Small Reusable UI pieces
   -------------------------- */
const MacroStatCard = ({ value, unit, label, color, Icon }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }} className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl shadow-sm">
    <div className={`p-2 bg-white rounded-full shadow-inner ${color}`}>
      <Icon />
    </div>
    <div className="mt-2 flex items-baseline">
      <AnimatedCounter value={value || 0} className="text-2xl font-bold text-slate-800" />
      <span className="text-sm text-slate-500 ml-1">{unit}</span>
    </div>
    <span className="text-xs text-slate-500 mt-1">{label}</span>
  </motion.div>
);