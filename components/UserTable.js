import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";

export default function UserTable({ filteredUsers, loading }) {
  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <TableContainer
        component={Paper}
        sx={{
          mt: 4,
          borderRadius: 4,
          boxShadow: "0 8px 40px rgba(0,0,0,0.25)",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.25)",
          overflowX: "auto",
          maxWidth: "100%",
        }}
      >
        {loading ? (
          [...Array(5)].map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              height={40}
              sx={{
                mb: 1,
                borderRadius: 1,
                bgcolor: "rgba(255,255,255,0.1)",
              }}
            />
          ))
        ) : (
          <Table sx={{ minWidth: isMobile ? "600px" : "100%" }}>
            <TableHead>
              <TableRow
                sx={{
                  background:
                    "linear-gradient(90deg, rgba(255,99,132,0.3), rgba(79,195,247,0.25))",
                }}
              >
                {["ID", "Email", "Created Date", "Role", "Accepted"].map(
                  (header) => (
                    <TableCell
                      key={header}
                      sx={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: isMobile ? "0.8rem" : "1rem",
                        textShadow: "0 0 10px rgba(255,255,255,0.4)",
                        borderBottom: "1px solid rgba(255,255,255,0.15)",
                        whiteSpace: "nowrap",
                        py: isMobile ? 0.5 : 1.5,
                      }}
                    >
                      {header}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={index}
                  whileHover={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    scale: 1.005,
                  }}
                  transition={{ duration: 0.2 }}
                  style={{
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <TableCell
                    sx={{
                      color: "#EAEAEA",
                      fontSize: isMobile ? "0.8rem" : "1rem",
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {user.id}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#EAEAEA",
                      fontSize: isMobile ? "0.8rem" : "1rem",
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {user.email}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#EAEAEA",
                      fontSize: isMobile ? "0.8rem" : "1rem",
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#EAEAEA",
                      fontSize: isMobile ? "0.8rem" : "1rem",
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {user.role}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: user.Accepted ? "#4CAF50" : "#FF6B81",
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: isMobile ? "0.8rem" : "1rem",
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {user.Accepted ? "✔️ Yes" : "❌ No"}
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </motion.div>
  );
}
