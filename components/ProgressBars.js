import {
  Card,
  Grid,
  Typography,
  LinearProgress,
  Skeleton,
} from "@mui/material";
import { motion } from "framer-motion";

export default function ProgressBars({ userData, loading }) {
  const progressData = loading
    ? [...Array(2)].map(() => ({ label: "", value: 0, color: "" }))
    : [
      {
        label: "🎁 Wishlist Completion",
        value:
          (userData.filter((user) => user.wishlist?.items.length > 0).length /
            userData.length) *
          100,
        color: "#FF6B81",
      },
      {
        label: "🎅 Matching Completion",
        value:
          (userData.filter((user) => user.matchedSanta).length /
            userData.length) *
          100,
        color: "#4FC3F7",
      },
    ];

  return (
    <Grid container spacing={2} justifyContent="center" sx={{ mt: 3 }}>
      {progressData.map((stat, index) => (
        <Grid item key={index} xs={12} sm={6} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              sx={{
                p: 3,
                borderRadius: 4,
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.18), rgba(255,255,255,0.05))",
                border: "1px solid rgba(255,255,255,0.25)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
                color: "#fff",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  mb: 1,
                  textShadow: "0 0 8px rgba(255,255,255,0.5)",
                }}
              >
                {loading ? <Skeleton width="80%" /> : stat.label}
              </Typography>

              <LinearProgress
                variant="determinate"
                value={loading ? 0 : stat.value}
                sx={{
                  height: 10,
                  mt: 2,
                  borderRadius: 5,
                  bgcolor: "rgba(255,255,255,0.1)",
                  "& .MuiLinearProgress-bar": {
                    background: `linear-gradient(90deg, ${stat.color}, #fff)`,
                    boxShadow: `0 0 12px ${stat.color}`,
                  },
                }}
              />

              <Typography
                variant="body1"
                sx={{
                  mt: 1.5,
                  fontWeight: "bold",
                  textAlign: "right",
                  color: "#E0E0E0",
                }}
              >
                {loading ? <Skeleton width="30%" /> : `${stat.value.toFixed(1)}%`}
              </Typography>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
}
