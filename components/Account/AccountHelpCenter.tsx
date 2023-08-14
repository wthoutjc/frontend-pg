import { Box, Typography, Divider } from "@mui/material";

// Interfaces
import { IUser } from "../../interfaces";

// Icons
import HelpCenterIcon from "@mui/icons-material/HelpCenter";

// Components
import { FAQ } from "../../components";

interface Props {
  user: IUser;
}

const AccountHelpCenter = ({ user }: Props) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        p: 2,
      }}
      className="animate__animated animate__fadeIn"
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <HelpCenterIcon
            sx={{
              mr: 2,
            }}
          />
          <Typography variant="h6" fontSize={20} fontWeight={600}>
            Centro de ayuda
          </Typography>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          fontSize={13}
          sx={{
            mt: 1,
          }}
        >
          Consulta nuestras guías de usuario que te ayudarán a resolver tus
          dudas, si no encuentras lo que buscas, puedes contactar a soporte.
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ mt: 2 }}>
        <FAQ user={user} />
      </Box>
    </Box>
  );
};

export { AccountHelpCenter };
