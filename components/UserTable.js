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

export default function UserTable({ filteredUsers, loading }) {
  return (
    <TableContainer
      component={Paper}
      sx={{ mt: 3, borderRadius: 3, boxShadow: 3 }}
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
        <Table>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              {["ID", "Email", "Created Date", "Role", "Accepted"].map(
                (header) => (
                  <TableCell
                    key={header}
                    sx={{ color: "white", fontWeight: "bold" }}
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
                sx={{ backgroundColor: index % 2 ? "#f9f9f9" : "white" }}
              >
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.Accepted ? "✔️ Yes" : "❌ No"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
}
