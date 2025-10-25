import { Card, Typography, Skeleton } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

export default function Graph({ graphData, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card
        sx={{
          p: 3,
          mt: 4,
          borderRadius: 4,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.25)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.25)",
          color: "#fff",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            mb: 2,
            textShadow: "0 0 10px rgba(255,255,255,0.4)",
          }}
        >
          🎁 Cumulative User Registrations Over Time
        </Typography>

        {loading ? (
          <Skeleton
            variant="rectangular"
            height={300}
            sx={{
              borderRadius: 3,
              bgcolor: "rgba(255,255,255,0.1)",
            }}
          />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={graphData}>
              <CartesianGrid stroke="rgba(255,255,255,0.15)" />
              <XAxis dataKey="date" stroke="#EAEAEA" />
              <YAxis stroke="#EAEAEA" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              />
              <Legend
                wrapperStyle={{
                  color: "#fff",
                  textShadow: "0 0 4px rgba(255,255,255,0.5)",
                }}
              />
              <Line
                type="monotone"
                dataKey="FOH"
                stroke="#FF3366"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{
                  r: 8,
                  fill: "#FF3366",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
              <Line
                type="monotone"
                dataKey="BOH"
                stroke="#4FC3F7"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{
                  r: 8,
                  fill: "#4FC3F7",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>
    </motion.div>
  );
}
