import { useState } from "react";
import { Box, Typography } from "@mui/material";

// Interfaces
import { IUser } from "../../interfaces";

// Components
import {
  RestorePasswordFAQ,
  VerifyEmailFAQ,
  RegisterLPFAQ,
  PresupuestoZonaFAQ,
  RegistrarPedidoFAQ,
  CleanCacheFAQ,
} from "../../components";

interface Props {
  user: IUser;
}

const FAQ = ({ user }: Props) => {
  const { hierarchy } = user;
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          mb: 1,
        }}
      >
        <Typography variant="h6" fontSize={20} fontWeight={400} sx={{ mr: 1 }}>
          FAQ - <strong> {hierarchy} </strong>
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Lista de preguntas frecuentes
      </Typography>
      <Box>
        <VerifyEmailFAQ
          callback={handleChange("verify-email")}
          expanded={expanded}
        />
        <RestorePasswordFAQ
          callback={handleChange("restore-password")}
          expanded={expanded}
        />
        <CleanCacheFAQ
          callback={handleChange("clean-cache")}
          expanded={expanded}
        />
        {hierarchy === "CEO" && (
          <>
            <RegisterLPFAQ
              callback={handleChange("register-lp")}
              expanded={expanded}
            />
            <PresupuestoZonaFAQ
              callback={handleChange("presupuesto-zona")}
              expanded={expanded}
            />
          </>
        )}
        {hierarchy === "Vendedor" ||
          (hierarchy === "CEO" && (
            <>
              <RegistrarPedidoFAQ
                callback={handleChange("registrar-pedido")}
                expanded={expanded}
              />
            </>
          ))}
      </Box>
    </Box>
  );
};

export { FAQ };
