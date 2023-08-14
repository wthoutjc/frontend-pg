import { Box } from "@mui/material";

// Redux
import { useAppSelector } from "../../hooks";

// Components
import { GeneralDashboard } from "../ui";

const Admin = () => {
  const { isMobile } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

  return (
    <Box
      sx={{
        width: "100%",
        p: isMobile ? 0 : 1,
        pt: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <GeneralDashboard isMobile={isMobile} user={user} />
    </Box>
  );
};

export { Admin };
