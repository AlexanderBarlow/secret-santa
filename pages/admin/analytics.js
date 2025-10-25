"use client";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Loader2, RefreshCcw, AlertCircle } from "lucide-react";

/** ---------------- Helpers ---------------- **/
const COLORS = [
  "#22c55e",
  "#60a5fa",
  "#f59e0b",
  "#ef4444",
  "#a78bfa",
  "#10b981",
  "#e879f9",
];
const fmtDate = (iso) => new Date(iso).toLocaleDateString();

/** Group by date (YYYY-MM-DD) */
const byDay = (items, getterISO) => {
  const map = new Map();
  items.forEach((it) => {
    const d = new Date(getterISO(it));
    const key = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
      .toISOString()
      .slice(0, 10);
    map.set(key, (map.get(key) || 0) + 1);
  });
  return Array.from(map.entries())
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([date, count]) => ({ date, count }));
};

const sum = (arr) => arr.reduce((a, b) => a + b, 0);

/** ---------------- KPI Card ---------------- **/
function KpiCard({ label, value, sub, color = "#60a5fa" }) {
  return (
    <motion.div whileHover={{ y: -3 }} className="w-full">
      <div
        className="rounded-2xl p-4 sm:p-5 border border-white/20 shadow-lg text-white"
        style={{
          background: `linear-gradient(135deg, ${color}33, rgba(255,255,255,0.08))`,
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="text-sm opacity-80">{label}</div>
        <div className="mt-1 text-3xl sm:text-4xl font-extrabold">{value}</div>
        {sub ? <div className="mt-1 text-xs opacity-80">{sub}</div> : null}
      </div>
    </motion.div>
  );
}

/** ---------------- Empty State ---------------- **/
function EmptyState({ icon = <AlertCircle className="w-4 h-4" />, children }) {
  return (
    <div className="w-full rounded-2xl p-4 sm:p-5 border border-white/20 bg-white/10 text-white/80 text-sm flex items-center gap-2">
      {icon}
      <span>{children}</span>
    </div>
  );
}

/** ---------------- Main Page ---------------- **/
export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState([]);
  const [wishlists, setWishlists] = useState(null); // null = not loaded/doesn't exist, [] = loaded empty
  const [error, setError] = useState("");

  const fetchAll = async () => {
    setError("");
    try {
      // token optional; include if you gate APIs
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const auth = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : undefined;

      const [usersRes, wlRes] = await Promise.allSettled([
        axios.get("/api/admin/users", auth),
        axios.get("/api/admin/wishlists", auth), // if you don't have this route yet, UI will fall back gracefully
      ]);

      if (
        usersRes.status === "fulfilled" &&
        Array.isArray(usersRes.value.data)
      ) {
        setUsers(usersRes.value.data);
      } else {
        setUsers([]);
      }

      if (wlRes.status === "fulfilled") {
        // Expecting: [{ userId, items: [{id, item}, ...] }, ...]
        setWishlists(Array.isArray(wlRes.value.data) ? wlRes.value.data : []);
      } else {
        setWishlists(null); // endpoint missing → show empty state for wishlist-based widgets
      }
    } catch (e) {
      setError("Failed to load analytics. Please try again.");
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

  /** ---------------- Derived Metrics ---------------- **/
  const totalUsers = users.length;
  const acceptedCount = users.filter((u) => u.Accepted).length;
  const matchedCount = users.filter((u) => u.matchedSantaId != null).length;
  const foh = users.filter((u) => u.role === "FRONT_OF_HOUSE").length;
  const boh = users.filter((u) => u.role === "BACK_OF_HOUSE").length;

  // Signup trend
  const signupsPerDay = useMemo(
    () => byDay(users, (u) => u.createdAt),
    [users]
  );

  // Wishlist metrics (if endpoint exists)
  const wishlistUsers = useMemo(() => {
    if (!Array.isArray(wishlists)) return [];
    return wishlists;
  }, [wishlists]);

  const wishlistCompletion = useMemo(() => {
    if (!Array.isArray(wishlists) || totalUsers === 0) return null;
    const withItems = wishlists.filter(
      (w) => Array.isArray(w.items) && w.items.length > 0
    ).length;
    return Math.round((withItems / totalUsers) * 100);
  }, [wishlists, totalUsers]);

  const avgWishlistItems = useMemo(() => {
    if (!Array.isArray(wishlists) || wishlists.length === 0) return null;
    const counts = wishlists.map((w) =>
      Array.isArray(w.items) ? w.items.length : 0
    );
    return (sum(counts) / Math.max(counts.length, 1)).toFixed(2);
  }, [wishlists]);

  const topWishlistItems = useMemo(() => {
    if (!Array.isArray(wishlists) || wishlists.length === 0) return [];
    const counter = new Map();
    wishlists.forEach((w) =>
      (w.items || []).forEach((it) => {
        const key = (it.item || "").trim();
        if (!key) return;
        counter.set(key, (counter.get(key) || 0) + 1);
      })
    );
    const arr = Array.from(counter.entries()).map(([name, count]) => ({
      name,
      count,
    }));
    return arr.sort((a, b) => b.count - a.count).slice(0, 7);
  }, [wishlists]);

  /** ---------------- UI ---------------- **/
  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-[#1a1a40] via-[#4054b2] to-[#1b1b2f] text-white overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              🎄 Admin Analytics
            </h1>
            <p className="text-white/80 text-sm mt-1">
              Real-time insights into participation, matching, and wishlist
              activity.
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
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-6">
          {/* Errors */}
          {error && <EmptyState>{error}</EmptyState>}

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            <KpiCard
              label="Total Users"
              value={loading ? "—" : totalUsers}
              color="#60a5fa"
            />
            <KpiCard
              label="Accepted %"
              value={
                loading || totalUsers === 0
                  ? "—"
                  : `${Math.round((acceptedCount / totalUsers) * 100)}%`
              }
              sub={`${acceptedCount}/${totalUsers}`}
              color="#22c55e"
            />
            <KpiCard
              label="Matched %"
              value={
                loading || totalUsers === 0
                  ? "—"
                  : `${Math.round((matchedCount / totalUsers) * 100)}%`
              }
              sub={`${matchedCount}/${totalUsers}`}
              color="#a78bfa"
            />
            <KpiCard
              label="Wishlist Completion"
              value={
                loading
                  ? "—"
                  : wishlistCompletion == null
                  ? "No data"
                  : `${wishlistCompletion}%`
              }
              sub={
                !Array.isArray(wishlists)
                  ? "Add /api/admin/wishlists to enable"
                  : undefined
              }
              color="#f59e0b"
            />
          </div>

          {/* Role Distribution + Avg Wishlist Items */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Role Pie */}
            <div className="rounded-2xl p-4 sm:p-5 border border-white/20 bg-white/10 backdrop-blur-lg shadow-xl">
              <div className="mb-3 font-semibold">Role Distribution</div>
              {loading ? (
                <EmptyState>Loading users…</EmptyState>
              ) : totalUsers === 0 ? (
                <EmptyState>No users yet.</EmptyState>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Front of House", value: foh },
                        { name: "Back of House", value: boh },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      blendStroke
                      stroke="rgba(255,255,255,0.4)"
                    >
                      {[foh, boh].map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Avg Wishlist + Top Items */}
            <div className="lg:col-span-2 rounded-2xl p-4 sm:p-5 border border-white/20 bg-white/10 backdrop-blur-lg shadow-xl">
              <div className="mb-3 font-semibold">Wishlists Overview</div>
              {!Array.isArray(wishlists) ? (
                <EmptyState>
                  No wishlist endpoint found. Create{" "}
                  <code className="opacity-90">/api/admin/wishlists</code>{" "}
                  returning
                  <code className="opacity-90">
                    {" "}
                    [{`{ userId, items: [{ id, item }] }`}]
                  </code>{" "}
                  to enable these metrics.
                </EmptyState>
              ) : wishlists.length === 0 ? (
                <EmptyState>No wishlists have been created yet.</EmptyState>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <KpiCard
                      label="Average Items per User"
                      value={avgWishlistItems ?? "—"}
                      color="#f59e0b"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <div className="rounded-xl p-3 border border-white/20 bg-white/5">
                      <div className="text-sm opacity-80 mb-2">
                        Top Wishlist Items
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {topWishlistItems.length === 0 ? (
                          <span className="text-white/70 text-sm">
                            No items yet.
                          </span>
                        ) : (
                          topWishlistItems.map((it, idx) => (
                            <span
                              key={it.name + idx}
                              className="px-3 py-1.5 rounded-full text-xs border border-white/20"
                              style={{
                                background: `${COLORS[idx % COLORS.length]}22`,
                              }}
                            >
                              {it.name}{" "}
                              <span className="opacity-70">×{it.count}</span>
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Signup Trend */}
          <div className="rounded-2xl p-4 sm:p-5 border border-white/20 bg-white/10 backdrop-blur-lg shadow-xl">
            <div className="mb-3 font-semibold">User Sign-ups Over Time</div>
            {loading ? (
              <EmptyState>Loading trend…</EmptyState>
            ) : signupsPerDay.length === 0 ? (
              <EmptyState>No signups yet.</EmptyState>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={signupsPerDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Signups"
                    stroke="#60a5fa"
                    strokeWidth={3}
                    dot={{ r: 2 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Matches Progress */}
          <div className="rounded-2xl p-4 sm:p-5 border border-white/20 bg-white/10 backdrop-blur-lg shadow-xl">
            <div className="mb-3 font-semibold">Matching Progress</div>
            {loading ? (
              <EmptyState>Loading matches…</EmptyState>
            ) : totalUsers === 0 ? (
              <EmptyState>No users yet.</EmptyState>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={[
                    { name: "Matched", value: matchedCount },
                    {
                      name: "Unmatched",
                      value: Math.max(totalUsers - matchedCount, 0),
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    <Cell fill="#22c55e" />
                    <Cell fill="#ef4444" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </main>

      <AdminNavbar />
    </div>
  );
}
