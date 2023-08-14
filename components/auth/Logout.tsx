import { useEffect } from "react";
import { Box } from "@mui/material";

// Service Logout
import { useAuth } from "../../hooks";

const Logout = () => {
  const { LogOut } = useAuth();

  useEffect(() => {
    LogOut();
  }, [LogOut]);

  return <Box sx={{ p: 2 }}>Cerrando sesión</Box>;
};

export { Logout };
