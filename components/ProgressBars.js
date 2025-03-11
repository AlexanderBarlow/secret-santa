import {
  Card,
  Grid,
  Typography,
  LinearProgress,
  Skeleton,
} from "@mui/material";

export default function ProgressBars({ userData, loading }) {
  const progressData = loading
    ? [...Array(2)].map(() => ({ label: "", value: 0, color: "" }))
    : [
        {
          label: "Wishlist Completion",
          value:
            (userData.filter((user) => user.wishlist?.items.length > 0).length /
              userData.length) *
            100,
          color: "#FFC107",
        },
        {
          label: "Matching Completion",
          value:
            (userData.filter((user) => user.matchedSanta).length /
              userData.length) *
            100,
          color: "#4CAF50",
        },
      ];

  return (
    <Grid container spacing={2} justifyContent="center">
      {progressData.map((stat, index) => (
        <Grid item key={index} xs={12} sm={6} md={4}>
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: 3,
              backgroundColor: "white",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
              {loading ? <Skeleton width="80%" /> : stat.label}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={loading ? 0 : stat.value}
              sx={{
                height: 10,
                mt: 2,
                borderRadius: 5,
                "& .MuiLinearProgress-bar": { backgroundColor: stat.color },
              }}
            />
            <Typography
              variant="body1"
              sx={{ mt: 1, fontWeight: "bold", textAlign: "right" }}
            >
              {loading ? <Skeleton width="30%" /> : `${stat.value.toFixed(2)}%`}
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
