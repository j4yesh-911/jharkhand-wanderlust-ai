import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Sparkles,
  Loader2,
  DollarSign,
} from "lucide-react";

// Define TypeScript interfaces for the itinerary data
interface ItineraryActivity {
  name: string;
  time: "Morning" | "Afternoon" | "Evening";
  description: string;
  estimatedCost?: number; // INR estimated by AI
}

interface ItineraryDay {
  day: number;
  activities: ItineraryActivity[];
  dayTotal?: number; // INR
}

interface Preferences {
  duration: number;
  interests: string[];
  budget: number; // INR
  groupSize: number;
  startLocation: string;
  customStops: string[];
}

const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY || ""
);

// A simple skeleton loader component for a better UX
const ItinerarySkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="glass-card p-4 rounded-xl">
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-4/5"></div>
        </div>
      </div>
    ))}
  </div>
);

const Itinerary = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<ItineraryDay[]>([]);
  const [savedPlans, setSavedPlans] = useState<ItineraryDay[][]>([]);

  const [aiPreferences, setAiPreferences] = useState<Preferences>({
    duration: 3,
    interests: [],
    budget: 10000,
    groupSize: 2,
    startLocation: "Ranchi",
    customStops: [],
  });

  // removed unused filterDay state

  // Currency state & rates
  const [currency, setCurrency] = useState<"INR" | "USD" | "EUR">("INR");
  const [rates, setRates] = useState<{ USD: number; EUR: number }>({
    USD: 0.012,
    EUR: 0.011,
  });

  useEffect(() => {
    // load persisted preferences & savedPlans
    const savedPrefs = localStorage.getItem("aiPreferences");
    if (savedPrefs) setAiPreferences(JSON.parse(savedPrefs));

    const savedPlansLocal = localStorage.getItem("savedPlans");
    if (savedPlansLocal) setSavedPlans(JSON.parse(savedPlansLocal));

    fetchRates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem("aiPreferences", JSON.stringify(aiPreferences));
  }, [aiPreferences]);

  const interests = [
    "Waterfalls",
    "Culture",
    "Adventure",
    "Nature",
    "Heritage",
    "Food",
    "Photography",
  ];

  const toggleInterest = (interest: string) => {
    setAiPreferences((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  // Fetch exchange rates (INR base)
  const fetchRates = async () => {
    try {
      const res = await fetch(
        "https://api.exchangerate.host/latest?base=INR&symbols=USD,EUR"
      );
      const json = await res.json();
      if (json && json.rates)
        setRates({ USD: json.rates.USD, EUR: json.rates.EUR });
    } catch (err) {
      console.warn("Failed to fetch exchange rates, using fallback", err);
    }
  };

  // convert INR -> selected currency
  const convert = (inr: number) => {
    if (currency === "INR") return inr;
    if (currency === "USD") return inr * (rates.USD ?? 0.012);
    if (currency === "EUR") return inr * (rates.EUR ?? 0.011);
    return inr;
  };

  const formatCurrencyUI = (amount: number) => {
    const opts = { style: "currency", currency } as const;
    const locale = currency === "INR" ? "en-IN" : "en-US";
    return new Intl.NumberFormat(locale, opts).format(
      Number(amount.toFixed(2))
    );
  };

  const handleGenerateAI = async () => {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      toast({
        title: "Missing API Key",
        description: "Please set VITE_GEMINI_API_KEY in your environment.",
        variant: "destructive",
      });
      return;
    }

    setAiLoading(true);
    setAiSuggestions([]); // Clear previous suggestions on new generation
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
      Act as a professional travel planner for Jharkhand, India.
      Your task is to generate a detailed, day-wise travel itinerary in JSON.

      Return ONLY valid JSON. Valid format example:
      [
        {
          "day": 1,
          "dayTotal": 3500,
          "activities": [
            { "name": "Hundru Falls", "time": "Morning", "description": "A scenic waterfall", "estimatedCost": 500 }
          ]
        }
      ]

      Preferences:
      - Starting Location: ${aiPreferences.startLocation || "Ranchi"}
      - Duration: ${aiPreferences.duration} days
      - Budget: ${aiPreferences.budget} INR
      - Group Size: ${aiPreferences.groupSize}
      - Interests: ${aiPreferences.interests.join(", ") || "General sightseeing"}
      - Custom Stops: ${
        aiPreferences.customStops.length > 0
          ? aiPreferences.customStops.join(", ")
          : "None"
      }

      Rules:
      - Provide estimatedCost in INR as a number for each activity when possible. Provide dayTotal as the sum of that day's costs.
      - If you can't estimate exactly, provide a reasonable estimate (round to nearest 50).
      - Begin from the starting location and include custom stops if possible.
      - Group activities geographically to minimize travel.
      `;

      const result = await model.generateContent(prompt);
      const rawText = result.response.text();

      let parsed: ItineraryDay[] = [];
      try {
        // accept either array OR object
        const jsonMatch = rawText.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
        if (!jsonMatch) throw new Error("No JSON found in AI output");

        const cleanJson = jsonMatch[0]
          .replace(/,(\s*[\]}])/g, "$1")
          .replace(/\n/g, " ");
        const obj = JSON.parse(cleanJson);
        parsed = Array.isArray(obj) ? obj : obj.itinerary;
        if (!Array.isArray(parsed)) throw new Error("Invalid JSON schema");

        // normalize costs and compute day totals if missing
        parsed = parsed.map((d) => {
          const activities = d.activities.map((a) => {
            const cost =
              typeof a.estimatedCost === "number" && !isNaN(a.estimatedCost)
                ? a.estimatedCost
                : 0;
            return {
              ...a,
              estimatedCost: Math.round(cost),
            } as ItineraryActivity;
          });

          const dayTotal =
            typeof d.dayTotal === "number" && !isNaN(d.dayTotal)
              ? Math.round(d.dayTotal)
              : activities.reduce((s, x) => s + (x.estimatedCost || 0), 0);

          return { ...d, activities, dayTotal } as ItineraryDay;
        });
      } catch (err) {
        console.error("JSON parse error:", err, rawText);
        toast({
          title: "AI Generation Failed",
          description: "The AI returned an unexpected response. Try again.",
          variant: "destructive",
        });
        return;
      }

      setAiSuggestions(parsed);
      toast({
        title: "AI Plan Ready!",
        description: "Your itinerary was generated successfully.",
      });
    } catch (error) {
      console.error("Gemini API Error:", error);
      toast({
        title: "AI Generation Failed",
        description:
          "An error occurred with the Gemini API. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleSavePlan = () => {
    const newPlans = [...savedPlans, aiSuggestions];
    setSavedPlans(newPlans);
    localStorage.setItem("savedPlans", JSON.stringify(newPlans));
    toast({
      title: "Plan Saved",
      description: "This itinerary was added to your saved plans.",
    });
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(aiSuggestions, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "itinerary.json";
    a.click();
  };

  const openAllInMaps = () => {
    const allPlaces = aiSuggestions.flatMap((d) =>
      d.activities.map((a) => a.name + ", Jharkhand")
    );
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        allPlaces.join("; ")
      )}`,
      "_blank"
    );
  };

  // compute totals for budget display
  const totalEstimatedINR = aiSuggestions.reduce(
    (s, d) => s + (d.dayTotal || 0),
    0
  );
  const remainingINR = aiPreferences.budget - totalEstimatedINR;
  const percentUsed = Math.min(
    100,
    Math.round(
      (totalEstimatedINR / Math.max(1, aiPreferences.budget)) * 100
    )
  );

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <div className="bg-gradient-water py-20 text-white text-center">
          <div className="max-w-4xl mx-auto px-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-playfair font-bold mb-6"
            >
              Plan Your Jharkhand Journey
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl"
            >
              AI-powered itinerary planner with smart recommendations
            </motion.p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel - Preferences */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6 rounded-2xl space-y-6"
            >
              <h3 className="text-xl font-bold flex items-center gap-2 text-gradient-nature">
                <Sparkles className="w-5 h-5" /> Customize Your Trip
              </h3>

              {/* Interests */}
              <div>
                <p className="font-medium mb-2">Select Interests</p>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <Button
                      key={interest}
                      size="sm"
                      variant={
                        aiPreferences.interests.includes(interest)
                          ? "default"
                          : "outline"
                      }
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Budget in INR */}
              <div>
                <p className="font-medium mb-2 flex items-center gap-1">
                  <DollarSign className="w-4 h-4" /> Budget (₹)
                </p>
                <input
                  type="number"
                  className="w-full p-2 rounded-md border"
                  placeholder="Enter total budget in INR"
                  value={aiPreferences.budget}
                  onChange={(e) =>
                    setAiPreferences({
                      ...aiPreferences,
                      budget: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>

              {/* Duration */}
              <div>
                <p className="font-medium mb-2 flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Trip Duration (Days)
                </p>
                <input
                  type="number"
                  className="w-full p-2 rounded-md border"
                  min={1}
                  value={aiPreferences.duration}
                  onChange={(e) =>
                    setAiPreferences({
                      ...aiPreferences,
                      duration: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>

              {/* Group Size */}
              <div>
                <p className="font-medium mb-2 flex items-center gap-1">
                  <Users className="w-4 h-4" /> Group Size
                </p>
                <input
                  type="number"
                  className="w-full p-2 rounded-md border"
                  min={1}
                  value={aiPreferences.groupSize}
                  onChange={(e) =>
                    setAiPreferences({
                      ...aiPreferences,
                      groupSize: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>

              {/* Starting Location */}
              <div>
                <p className="font-medium mb-2 flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> Starting Location
                </p>
                <input
                  type="text"
                  className="w-full p-2 rounded-md border"
                  placeholder="e.g., Ranchi, Jamshedpur, Kolkata"
                  value={aiPreferences.startLocation}
                  onChange={(e) =>
                    setAiPreferences({
                      ...aiPreferences,
                      startLocation: e.target.value,
                    })
                  }
                />
              </div>

              {/* Custom Stops */}
              <div>
                <p className="font-medium mb-2 flex items-center gap-1">
                  <Sparkles className="w-4 h-4" /> Custom Stops
                </p>
                <div className="space-y-2">
                  {aiPreferences.customStops.map((stop, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 p-2 rounded-md border"
                        value={stop}
                        onChange={(e) => {
                          const newStops = [...aiPreferences.customStops];
                          newStops[i] = e.target.value;
                          setAiPreferences({
                            ...aiPreferences,
                            customStops: newStops,
                          });
                        }}
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          setAiPreferences({
                            ...aiPreferences,
                            customStops: aiPreferences.customStops.filter(
                              (_, idx) => idx !== i
                            ),
                          })
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setAiPreferences({
                        ...aiPreferences,
                        customStops: [...aiPreferences.customStops, ""],
                      })
                    }
                  >
                    + Add Stop
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleGenerateAI}
                className="btn-nature w-full"
                disabled={aiLoading}
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4 mr-2" /> Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" /> Generate AI Plan
                  </>
                )}
              </Button>
            </motion.div>

            {/* Right Panel - AI Suggestions */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 glass-card p-6 rounded-2xl space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gradient-water">
                  AI-Generated Itinerary
                </h3>
                <div className="flex gap-2 items-center">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as any)}
                    className="border rounded p-1"
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                  <Button size="sm" variant="outline" onClick={handleSavePlan}>
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleExport}>
                    Export
                  </Button>
                  <Button size="sm" variant="outline" onClick={openAllInMaps}>
                    Open All in Maps
                  </Button>
                </div>
              </div>

              {/* Budget summary & progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    Budget: {formatCurrencyUI(convert(aiPreferences.budget))} (
                    {aiPreferences.budget} INR)
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Estimated total: {formatCurrencyUI(convert(totalEstimatedINR))}
                  </div>
                </div>

                <div className="mt-2 bg-gray-200 rounded h-3 overflow-hidden">
                  <div
                    className="h-3"
                    style={{
                      width: percentUsed + "%",
                      background: percentUsed > 100 ? "#ef4444" : "#16a34a",
                    }}
                  />
                </div>
                <div className="text-xs mt-1">
                  {formatCurrencyUI(convert(Math.max(0, remainingINR)))} remaining
                </div>
              </div>

              {aiLoading && <ItinerarySkeleton />}

              {!aiLoading && aiSuggestions.length > 0 ? (
                aiSuggestions.map((day, index) => (
                  <Card key={index} className="p-4 bg-primary/5 border">
                    <h4 className="font-bold text-lg mb-3">Day {day.day}</h4>

                    <ul className="space-y-3">
                      {day.activities.map((activity, idx) => (
                        <li
                          key={idx}
                          className="flex justify-between items-center bg-white/50 rounded-lg p-3 shadow-sm"
                        >
                          <div className="flex-1">
                            <div className="flex items-center mb-1">
                              <Clock className="inline w-4 h-4 mr-2 text-primary" />
                              <span className="font-semibold">{activity.time}</span>
                              <span className="font-bold ml-2">
                                {activity.name}
                              </span>
                            </div>
                            {activity.description && (
                              <p className="text-sm text-muted-foreground ml-6">
                                {activity.description}
                              </p>
                            )}
                          </div>

                          <div className="ml-4 text-right">
                            <div className="text-sm font-medium">
                              {formatCurrencyUI(
                                convert(activity.estimatedCost || 0)
                              )}
                            </div>
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                activity.name + ", Jharkhand"
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <MapPin className="w-5 h-5 text-primary hover:text-primary/80" />
                            </a>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm font-semibold">
                        Day total: {formatCurrencyUI(convert(day.dayTotal || 0))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        INR {day.dayTotal ?? 0}
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                !aiLoading && (
                  <div className="text-sm text-muted-foreground">
                    No itinerary yet. Select your preferences and click{" "}
                    <strong>Generate AI Plan</strong>.
                  </div>
                )
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Itinerary;
