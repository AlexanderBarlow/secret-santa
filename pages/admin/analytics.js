"use client";
import { useEffect, useState, useMemo } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import AdminNavbar from "../../components/AdminNavbar";
import ProgressBars from "../../components/ProgressBars";
import Graph from "../../components/Graph";
import Filters from "../../components/Filters";
import UserTable from "../../components/UserTable";
import { Loader2 } from "lucide-react";

export default function AdminAnalytics() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [acceptedFilter, setAcceptedFilter] = useState("");

  const isMobile = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, usersRes] = await Promise.all([
          axios.get("/api/analytics"),
          axios.get("/api/admin/userdata"),
        ]);

        if (analyticsRes.status !== 200 || usersRes.status !== 200) {
          throw new Error("Failed to fetch data");
        }

        setAnalyticsData(analyticsRes.data);
        setUserData(usersRes.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const processedGraphData = useMemo(() => {
    if (!userData.length) return [];
    let cumulativeFOH = 0;
    let cumulativeBOH = 0;
    let earliestDate = new Date(
      Math.min(...userData.map((user) => new Date(user.createdAt)))
    );
    earliestDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const userCountsByDate = new Map();
    let currentDate = new Date(earliestDate);
    while (currentDate <= today) {
      const formattedDate = currentDate.toISOString().split("T")[0];
      userCountsByDate.set(formattedDate, { date: formattedDate, FOH: 0, BOH: 0 });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    userData.forEach((user) => {
      const formattedDate = new Date(user.createdAt).toISOString().split("T")[0];
      if (userCountsByDate.has(formattedDate)) {
        if (user.role === "FRONT_OF_HOUSE") userCountsByDate.get(formattedDate).FOH += 1;
        else if (user.role === "BACK_OF_HOUSE") userCountsByDate.get(formattedDate).BOH += 1;
      }
    });

    const dateArray = [{ date: "Day 0", FOH: 0, BOH: 0 }];
    userCountsByDate.forEach((value) => {
      cumulativeFOH += value.FOH;
      cumulativeBOH += value.BOH;
      dateArray.push({ date: value.date, FOH: cumulativeFOH, BOH: cumulativeBOH });
    });
    return dateArray;
  }, [userData]);

  const filteredUsers = useMemo(() => {
    let filtered = userData;
    if (search)
      filtered = filtered.filter((user) =>
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    if (roleFilter) filtered = filtered.filter((user) => user.role === roleFilter);
    if (acceptedFilter)
      filtered = filtered.filter(
        (user) => user.Accepted.toString() === acceptedFilter
      );
    return filtered;
  }, [search, roleFilter, acceptedFilter, userData]);

  if (error)
    return (
      <Box className="flex items-center justify-center min-h-screen text-red-400 text-lg">
        Error: {error}
      </Box>
    );

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-[#1a1a40] via-[#4054b2] to-[#1b1b2f] text-white overflow-hidden">
      {/* ❄️ Soft Snow Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-50 blur-[1px]"
            initial={{ y: -10, x: Math.random() * window.innerWidth }}
            animate={{
              y: "110vh",
              x: `+=${(Math.random() - 0.5) * 50}`,
              opacity: [0.8, 0.3, 0.8],
            }}
            transition={{
              duration: 10 + Math.random() * 8,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>

      {/* 🎅 Header */}
      <header className="relative z-10 text-center mt-6 sm:mt-10 px-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-red-400 via-pink-300 to-green-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
          Secret Santa Analytics 🎄
        </h1>
        <p className="mt-3 text-sm sm:text-lg text-white/80 max-w-xl mx-auto backdrop-blur-md bg-white/10 border border-white/20 px-4 py-2 rounded-full shadow-inner">
          Gain insights into participation, roles, and event engagement.
        </p>
        <div className="w-16 sm:w-24 h-1 mt-4 mx-auto bg-gradient-to-r from-red-500 via-white to-green-500 rounded-full shadow-lg"></div>
      </header>

      {/* 📊 Content */}
      <Box className="relative z-10 flex flex-col items-center justify-start px-4 sm:px-8 mt-10 w-full max-w-6xl mx-auto pb-32">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin w-8 h-8 text-white/80" />
          </div>
        ) : (
          <>
            {/* Progress Bars */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full mb-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-4 sm:p-6"
            >
              <ProgressBars userData={userData} loading={loading} />
            </motion.div>

            {/* Graph */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="w-full mb-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-4 sm:p-6"
            >
              <Graph graphData={processedGraphData} loading={loading} />
            </motion.div>

            {/* Filters + Table */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-4 sm:p-6"
            >
              <Filters
                search={search}
                setSearch={setSearch}
                roleFilter={roleFilter}
                setRoleFilter={setRoleFilter}
                acceptedFilter={acceptedFilter}
                setAcceptedFilter={setAcceptedFilter}
              />
              <div className="mt-4">
                <UserTable filteredUsers={filteredUsers} loading={loading} />
              </div>
            </motion.div>
          </>
        )}
      </Box>

      <AdminNavbar />
    </div>
  );
}
