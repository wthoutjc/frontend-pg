import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TextField,
  InputAdornment,
} from "@mui/material";

// Redux
import { useAppSelector } from "../../hooks";

// Icons
import BookIcon from "@mui/icons-material/Book";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BadgeIcon from "@mui/icons-material/Badge";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import StoreIcon from "@mui/icons-material/Store";

// React Hook Form
import { useForm } from "react-hook-form";

// Services
import { getBodegasBySeller, getClient } from "../../services";

// Components
import { NewPedidoSkeleton, RegistrarPedido } from "../../components";

// Interfaces
import { IBodega, IClient } from "../../interfaces";

// uuid
import { v4 as uuid } from "uuid";

// Redux
import { useAppDispatch } from "../../hooks";
import { newNotification } from "../../reducers";

type PanelOptions = "newPedido" | "newCotizacion" | "newBodega";

interface NewPedidoProps {
  idClient: string;
}

const NewPedido = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const { isMobile } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

  const [expanded, setExpanded] = useState<PanelOptions | false>("newPedido");
  const [loading, setLoading] = useState(false);

  const [bodegas, setBodegas] = useState<IBodega | null>(null);

  const [renderRP, setRenderRP] = useState<{
    render: boolean;
    client: IClient | null;
  }>({
    render: false,
    client: null,
  });

  const [renderRPB, setRenderRPB] = useState(false);

  const handleChange =
    (panel: PanelOptions) =>
    (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<NewPedidoProps>({
    defaultValues: {
      idClient: "",
    },
  });

  const handleNewPedido = (data: NewPedidoProps) => {
    setLoading(true);
    getClient(data.idClient).then(({ client, ok }) => {
      setLoading(false);
      if (!ok) {
        const notification = {
          id: uuid(),
          title: "Error:",
          message: `Cliente no encontrado, por favor registre el cliente.`,
          type: "error" as "error" | "success",
          autoDismiss: 15000,
        };
        dispatch(newNotification(notification));
        router.push("/clients/new-client");
      } else
        setRenderRP({
          render: true,
          client,
        });
    });
  };

  useEffect(() => {
    if (user.id && user.id !== 0) {
      setLoading(true);
      getBodegasBySeller(user.id).then((res) => {
        setLoading(false);

        if (res.ok) setBodegas(JSON.parse(res.bodegas[0]));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  if (renderRPB && bodegas)
    return (
      <RegistrarPedido
        isMobile={isMobile}
        user={user}
        bodegas={bodegas}
        client={null}
      />
    );

  if (renderRP.render && renderRP.client)
    return (
      <RegistrarPedido
        isMobile={isMobile}
        user={user}
        client={renderRP.client}
        bodegas={null}
      />
    );

  if (loading) return <NewPedidoSkeleton isMobile={isMobile} />;

  return (
    <Box
      sx={{ p: isMobile ? 0 : 1, pt: 0, overflow: "hidden", height: "100%" }}
    >
      <Box
        sx={{
          backgroundColor: "#112233",
          borderRadius: isMobile ? 0 : 3,
          overflow: "auto",
          height: "100%",
        }}
      >
        <Box
          sx={{
            p: 2,
            backgroundColor: "#001122",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h1"
            fontSize={isMobile ? 14 : 18}
            fontWeight={800}
          >
            {user.hierarchy}: Registrar pedido
          </Typography>
        </Box>
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h1"
            fontSize={isMobile ? 14 : 18}
            fontWeight={800}
          >
            Complete la información
          </Typography>
          <Button
            variant="contained"
            startIcon={<BookIcon />}
            size="small"
            onClick={() => router.push("/agenda")}
          >
            Ver agenda
          </Button>
        </Box>
        <Box
          sx={{
            p: 2,
            pt: 0,
          }}
        >
          <Divider />
        </Box>
        <Box
          sx={{
            width: "100%",
          }}
        >
          <Accordion
            expanded={expanded === "newPedido"}
            onChange={handleChange("newPedido")}
            sx={{
              backgroundImage: "none",
              backgroundColor: "#001122",
              p: 2,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="newPedidobh-content"
              id="newPedidobh-header"
            >
              <Typography
                sx={{ width: "33%", flexShrink: 0 }}
                fontSize={isMobile ? 12 : 16}
              >
                Pedido para cliente
              </Typography>
              <Typography
                sx={{ color: "text.secondary" }}
                fontSize={isMobile ? 12 : 16}
              >
                Inicia un nuevo pedido con la C.C. o NIT del cliente
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <form onSubmit={handleSubmit(handleNewPedido)}>
                <TextField
                  fullWidth
                  size={isMobile ? "small" : "medium"}
                  type="text"
                  autoComplete="id"
                  sx={{ marginBottom: "1em" }}
                  placeholder="Ej: 1001231235"
                  label="Cédula ó NIT"
                  error={!!errors.idClient}
                  helperText={
                    !!errors.idClient
                      ? errors.idClient.message
                      : "Escribe la cédula ó NIT del cliente"
                  }
                  {...register("idClient", {
                    required: "La cédula ó NIT del cliente es requerida",
                    minLength: {
                      value: 4,
                      message:
                        "La cédula ó NIT del cliente debe tener al menos 4 caracteres",
                    },
                  })}
                  value={watch("idClient")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  type="submit"
                  size={isMobile ? "small" : "medium"}
                  startIcon={<PointOfSaleIcon />}
                >
                  Iniciar pedido
                </Button>
              </form>
            </AccordionDetails>
          </Accordion>
          {bodegas && (
            <Accordion
              expanded={expanded === "newBodega"}
              onChange={handleChange("newBodega")}
              sx={{
                backgroundImage: "none",
                backgroundColor: "#001122",
                p: 2,
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="newPedidobh-content"
                id="newPedidobh-header"
              >
                <Typography
                  sx={{ width: "33%", flexShrink: 0 }}
                  fontSize={isMobile ? 12 : 16}
                >
                  Pedido para bodega
                </Typography>
                <Typography
                  sx={{ color: "text.secondary" }}
                  fontSize={isMobile ? 12 : 16}
                >
                  Inicia un nuevo pedido para la bodega asignada
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Button
                  variant="contained"
                  type="submit"
                  size={isMobile ? "small" : "medium"}
                  startIcon={<StoreIcon />}
                  onClick={() => setRenderRPB(true)}
                >
                  Iniciar pedido - bodega
                </Button>
              </AccordionDetails>
            </Accordion>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export { NewPedido };
