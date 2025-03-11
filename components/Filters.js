import {
  Grid2,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";

export default function Filters({
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
  acceptedFilter,
  setAcceptedFilter,
}) {
  return (
    <Grid2 container spacing={2} sx={{ mb: 3, pt: 5 }}>
      {/* Search by Email */}
      <Grid2 xs={12} sm={4}>
        <Typography
          variant="body1"
          sx={{ fontWeight: "bold", mb: 1, color: "black" }}
        >
          Search by Email
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              height: "48px",
              borderRadius: "50px",
              color: "black",
              "& fieldset": { borderColor: "black" },
              "&:hover fieldset": { borderColor: "black" },
              "&.Mui-focused fieldset": { borderColor: "black" },
            },
            "& input": { color: "black" },
          }}
        />
      </Grid2>

      {/* Filter by Role */}
      <Grid2 xs={12} sm={4}>
        <Typography
          variant="body1"
          sx={{ fontWeight: "bold", mb: 1, color: "black" }}
        >
          Filter by Role
        </Typography>
        <FormControl fullWidth>
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">All Roles</MenuItem>
            <MenuItem value="FRONT_OF_HOUSE">Front of House</MenuItem>
            <MenuItem value="BACK_OF_HOUSE">Back of House</MenuItem>
          </Select>
        </FormControl>
      </Grid2>

      {/* Filter by Accepted Status */}
      <Grid2 xs={12} sm={4}>
        <Typography
          variant="body1"
          sx={{ fontWeight: "bold", mb: 1, color: "black" }}
        >
          Accepted Status
        </Typography>
        <FormControl fullWidth>
          <Select
            value={acceptedFilter}
            onChange={(e) => setAcceptedFilter(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">All Users</MenuItem>
            <MenuItem value="true">Accepted</MenuItem>
            <MenuItem value="false">Not Accepted</MenuItem>
          </Select>
        </FormControl>
      </Grid2>
    </Grid2>
  );
}
