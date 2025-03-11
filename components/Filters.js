import {
  Grid,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  useMediaQuery,
} from "@mui/material";

export default function Filters({
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
  acceptedFilter,
  setAcceptedFilter,
}) {
  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <Grid
      container
      spacing={isMobile ? 1.5 : 2}
      sx={{
        mb: 3,
        pt: 4,
        px: isMobile ? 2 : 0,
      }}
    >
      {/* Search by Email */}
      <Grid item xs={12} sm={4}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: "bold",
            mb: 1,
            color: "black",
            fontSize: isMobile ? "0.9rem" : "1rem",
          }}
        >
          Search by Name
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              height: isMobile ? "44px" : "48px",
              borderRadius: "8px",
              color: "black",
              "& fieldset": { borderColor: "black" },
              "&:hover fieldset": { borderColor: "black" },
              "&.Mui-focused fieldset": { borderColor: "black" },
            },
            "& input": {
              color: "black",
              fontSize: isMobile ? "0.85rem" : "1rem",
            },
          }}
        />
      </Grid>

      {/* Filter by Role */}
      <Grid item xs={12} sm={4}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: "bold",
            mb: 1,
            color: "black",
            fontSize: isMobile ? "0.9rem" : "1rem",
          }}
        >
          Filter by Role
        </Typography>
        <FormControl fullWidth>
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            displayEmpty
            sx={{
              height: isMobile ? "44px" : "48px",
              borderRadius: "8px",
              fontSize: isMobile ? "0.85rem" : "1rem",
            }}
          >
            <MenuItem value="">All Roles</MenuItem>
            <MenuItem value="FRONT_OF_HOUSE">Front of House</MenuItem>
            <MenuItem value="BACK_OF_HOUSE">Back of House</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Filter by Accepted Status */}
      <Grid item xs={12} sm={4}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: "bold",
            mb: 1,
            color: "black",
            fontSize: isMobile ? "0.9rem" : "1rem",
          }}
        >
          Accepted Status
        </Typography>
        <FormControl fullWidth>
          <Select
            value={acceptedFilter}
            onChange={(e) => setAcceptedFilter(e.target.value)}
            displayEmpty
            sx={{
              height: isMobile ? "44px" : "48px",
              borderRadius: "8px",
              fontSize: isMobile ? "0.85rem" : "1rem",
            }}
          >
            <MenuItem value="">All Users</MenuItem>
            <MenuItem value="true">Accepted</MenuItem>
            <MenuItem value="false">Not Accepted</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}
