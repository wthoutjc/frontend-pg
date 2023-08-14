import { useState } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";

// Icons
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";

interface Props {
  children: React.ReactNode;
}

const Minimizer = ({ children }: Props) => {
  const [minimize, setMinimize] = useState(false);

  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        height: minimize ? "18px" : "auto",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 1,
        }}
      >
        <Tooltip title={minimize ? "Expandir" : "Minimizar"}>
          <IconButton onClick={() => setMinimize(!minimize)} size="small">
            {minimize ? (
              <CloseFullscreenIcon fontSize={"small"} />
            ) : (
              <OpenInFullIcon fontSize={"small"} />
            )}
          </IconButton>
        </Tooltip>
      </Box>
      {minimize ? null : children}
    </Box>
  );
};

export { Minimizer };
