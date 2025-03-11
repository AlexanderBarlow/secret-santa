import { useEffect, useState, useMemo } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";
import ProgressBars from "../../components/ProgressBars";
import Graph from "../../components/Graph";
import Filters from "../../components/Filters";
import UserTable from "../../components/UserTable";

export default function AdminAnalytics() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [acceptedFilter, setAcceptedFilter] = useState("");

  const isMobile = useMediaQuery("(max-width: 600px)");

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
        setLoading(false);
      } catch (error) {
        setError(error.message);
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
      userCountsByDate.set(formattedDate, {
        date: formattedDate,
        FOH: 0,
        BOH: 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    userData.forEach((user) => {
      const formattedDate = new Date(user.createdAt)
        .toISOString()
        .split("T")[0];
      if (userCountsByDate.has(formattedDate)) {
        if (user.role === "FRONT_OF_HOUSE") {
          userCountsByDate.get(formattedDate).FOH += 1;
        } else if (user.role === "BACK_OF_HOUSE") {
          userCountsByDate.get(formattedDate).BOH += 1;
        }
      }
    });

    const dateArray = [{ date: "Day 0", FOH: 0, BOH: 0 }];
    userCountsByDate.forEach((value) => {
      cumulativeFOH += value.FOH;
      cumulativeBOH += value.BOH;
      dateArray.push({
        date: value.date,
        FOH: cumulativeFOH,
        BOH: cumulativeBOH,
      });
    });

    return dateArray;
  }, [userData]);

  const filteredUsers = useMemo(() => {
    let filtered = userData;

    if (search) {
      filtered = filtered.filter((user) =>
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (roleFilter) {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    if (acceptedFilter) {
      filtered = filtered.filter(
        (user) => user.Accepted.toString() === acceptedFilter
      );
    }

    return filtered;
  }, [search, roleFilter, acceptedFilter, userData]);

  if (error) return <div>Error: {error}</div>;

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: "#f4f6f8",
        minHeight: "100vh",
        paddingBottom: 20,
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 3, textAlign: "center", fontWeight: "bold", color: "#333" }}
      >
        🎅 Secret Santa Admin Dashboard
      </Typography>

      {/* ✅ Progress Bars */}
      <ProgressBars userData={userData} loading={loading} />

      {/* 📈 Graph */}
      <Graph graphData={processedGraphData} loading={loading} />

      {/* ✅ Filters & Table */}
      <Filters
        search={search}
        setSearch={setSearch}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        acceptedFilter={acceptedFilter}
        setAcceptedFilter={setAcceptedFilter}
      />

      <div style={{ paddingBottom: 120 }}>
        <UserTable filteredUsers={filteredUsers} loading={loading} />
      </div>

      <AdminNavbar />
    </Box>
  );
}
