import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
} from "@mui/material";
import { useMediaQuery } from "@mui/material";

export default function UserTable({ filteredUsers, loading }) {
  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <TableContainer
      component={Paper}
      sx={{
        mt: 3,
        borderRadius: 3,
        boxShadow: 3,
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
            sx={{ mb: 1, borderRadius: 1 }}
          />
        ))
      ) : (
        <Table sx={{ minWidth: isMobile ? "600px" : "100%" }}>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              {["ID", "Email", "Created Date", "Role", "Accepted"].map(
                (header) => (
                  <TableCell
                    key={header}
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      fontSize: isMobile ? "0.75rem" : "1rem",
                      padding: isMobile ? "6px" : "12px",
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
              <TableRow
                key={index}
                sx={{
                  backgroundColor: index % 2 ? "#f9f9f9" : "white",
                }}
              >
                <TableCell sx={{ fontSize: isMobile ? "0.75rem" : "1rem" }}>
                  {user.id}
                </TableCell>
                <TableCell sx={{ fontSize: isMobile ? "0.75rem" : "1rem" }}>
                  {user.email}
                </TableCell>
                <TableCell sx={{ fontSize: isMobile ? "0.75rem" : "1rem" }}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell sx={{ fontSize: isMobile ? "0.75rem" : "1rem" }}>
                  {user.role}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: isMobile ? "0.75rem" : "1rem",
                    textAlign: "center",
                  }}
                >
                  {user.Accepted ? "✔️ Yes" : "❌ No"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
}
