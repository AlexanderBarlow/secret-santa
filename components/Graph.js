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

export default function Graph({ graphData, loading }) {
  return (
    <Card
      sx={{
        p: 3,
        mt: 4,
        borderRadius: 3,
        boxShadow: 3,
        backgroundColor: "white",
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}
      >
        Cumulative User Registrations Over Time
      </Typography>
      {loading ? (
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} domain={[0, "auto"]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="FOH" stroke="red" strokeWidth={3} />
            <Line type="monotone" dataKey="BOH" stroke="blue" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
