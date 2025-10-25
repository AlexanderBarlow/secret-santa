"use client";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { RefreshCcw, Sparkles, Users, Gift, AlertCircle } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import confetti from "canvas-confetti";

const COLORS = [
  "#60a5fa",
  "#a78bfa",
  "#f59e0b",
  "#22c55e",
  "#ef4444",
  "#e879f9",
];

/* ---------- Radial KPI ---------- */
function RadialKpi({ label, value, color, sub, threshold = 100 }) {
  const pct = Number(value) || 0;
  const complete = pct >= threshold;
  if (complete) confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });

  return (
    <motion.div whileHover={{ scale: 1.05 }} className="text-center">
      <div className="flex justify-center mb-2">
        <div style={{ width: 90, height: 90 }}>
          <CircularProgressbar
            value={pct}
            text={`${pct}%`}
            styles={buildStyles({
              pathColor: complete ? "#22c55e" : color,
              textColor: "#fff",
              trailColor: "rgba(255,255,255,0.1)",
            })}
          />
        </div>
      </div>
      <div className="font-semibold text-sm">{label}</div>
      {sub && <div className="text-xs opacity-70">{sub}</div>}
    </motion.div>
  );
}

/* ---------- Empty State ---------- */
function EmptyState({ children }) {
  return (
    <div className="w-full rounded-2xl p-4 border border-white/20 bg-white/10 text-white/80 text-sm flex items-center gap-2">
      <AlertCircle className="w-4 h-4" />
      <span>{children}</span>
    </div>
  );
}

/* ---------- Main Component ---------- */
export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState([]);
  const [wishlists, setWishlists] = useState(null);
  const [activity, setActivity] = useState(null);
  const [error, setError] = useState("");

  const fetchAll = async () => {
    try {
      setError("");
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const [usersRes, wlRes, actRes] = await Promise.allSettled([
        axios.get("/api/admin/users", { headers }),
        axios.get("/api/admin/wishlists", { headers }),
        axios.get("/api/admin/activity", { headers }),
      ]);

      if (usersRes.status === "fulfilled") setUsers(usersRes.value.data);
      if (wlRes.status === "fulfilled") setWishlists(wlRes.value.data);
      if (actRes.status === "fulfilled") setActivity(actRes.value.data);
      else setActivity(null);
    } catch (e) {
      console.error(e);
      setError("Failed to load analytics data.");
      setUsers([]);
      setWishlists(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAll();
    setRefreshing(false);
  };

  /* ---------- Derived Metrics ---------- */
  const totalUsers = users.length;
  const accepted = users.filter((u) => u.Accepted).length;
  const matched = users.filter((u) => u.matchedSantaId != null).length;
  const matchedPct = totalUsers ? Math.round((matched / totalUsers) * 100) : 0;
  const acceptedPct = totalUsers
    ? Math.round((accepted / totalUsers) * 100)
    : 0;

  const wishlistCompletion = useMemo(() => {
    if (!wishlists?.summary) return 0;
    return wishlists.summary.completionRate || 0;
  }, [wishlists]);

  const topItems = useMemo(() => {
    if (!wishlists?.topItems?.length) return [];
    return wishlists.topItems.map((t) => ({ name: t.item, count: t.count }));
  }, [wishlists]);

  // === Transform activity for cumulative wishlist growth ===
  const cumulativeActivity = useMemo(() => {
    if (!activity?.activity) return [];
    let wishlistTotal = 0;
    return activity.activity.map((d) => {
      wishlistTotal += d.wishlists || 0;
      return { ...d, wishlist: wishlistTotal };
    });
  }, [activity]);

  const leaderboard = [
    {
      role: "Front of House",
      value: users.filter((u) => u.role === "FRONT_OF_HOUSE").length,
    },
    {
      role: "Back of House",
      value: users.filter((u) => u.role === "BACK_OF_HOUSE").length,
    },
  ];

  const activityData = cumulativeActivity;
  const actSummary = activity?.summary || {};

  /* ---------- UI ---------- */
  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-[#0b1437] via-[#122359] to-[#1b3f9d] text-white overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              Admin Analytics
            </h1>
            <p className="text-white/80 text-sm mt-1">
              Live insights into signups, matches, and wishlist engagement.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={onRefresh}
            disabled={refreshing}
            className="px-4 py-2 rounded-full bg-white/20 border border-white/30 backdrop-blur-md 
                       text-white font-semibold shadow-md hover:bg-white/30 transition flex items-center gap-2 self-start sm:self-auto"
          >
            <RefreshCcw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </motion.button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
          {error && <EmptyState>{error}</EmptyState>}

          {/* KPI Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <RadialKpi
              label="Accepted Users"
              value={acceptedPct}
              color="#22c55e"
              sub={`${accepted}/${totalUsers}`}
            />
            <RadialKpi
              label="Matched Users"
              value={matchedPct}
              color="#a78bfa"
              sub={`${matched}/${totalUsers}`}
            />
            <RadialKpi
              label="Wishlist Completion"
              value={wishlistCompletion}
              color="#f59e0b"
              sub={`${wishlistCompletion}%`}
            />
            <RadialKpi
              label="Total Users"
              value={100}
              color="#60a5fa"
              sub={`${totalUsers}`}
            />
          </div>

          {/* Activity Trend */}
          <div className="rounded-2xl p-4 border border-white/20 bg-white/10 backdrop-blur-lg shadow-xl">
            <div className="font-semibold mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" /> Activity (Past 7 Days)
            </div>
            {!activityData.length ? (
              <EmptyState>No recent activity recorded.</EmptyState>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="gradSignup" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.9} />
                      <stop
                        offset="100%"
                        stopColor="#60a5fa"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="gradMatch" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.9} />
                      <stop
                        offset="100%"
                        stopColor="#a78bfa"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient
                      id="gradWishlist"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9} />
                      <stop
                        offset="100%"
                        stopColor="#f59e0b"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="signups"
                    stroke="#60a5fa"
                    fill="url(#gradSignup)"
                  />
                  <Area
                    type="monotone"
                    dataKey="matches"
                    stroke="#a78bfa"
                    fill="url(#gradMatch)"
                  />
                  <Area
                    type="monotone"
                    dataKey="wishlist"
                    stroke="#f59e0b"
                    fill="url(#gradWishlist)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </main>

      <AdminNavbar />
    </div>
  );
}
