import { useState } from "react";
import {
  Box,
  Divider,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Skeleton,
} from "@mui/material";

// Icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface Props {
  isMobile: boolean;
}

type PanelOptions = "newPedido" | "newCotizacion" | "newBodega";

const NewPedidoSkeleton = ({ isMobile }: Props) => {
  const [expanded, setExpanded] = useState<PanelOptions | false>("newPedido");

  const handleChange =
    (panel: PanelOptions) =>
    (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
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
          <Skeleton variant="text" sx={{ width: "70%", fontSize: "1rem" }} />
        </Box>
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Skeleton variant="text" sx={{ width: "50%", fontSize: "1rem" }} />
          <Skeleton variant="text" sx={{ width: "30%", fontSize: "1rem" }} />
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
            disabled={true}
            expanded={expanded === "newPedido"}
            onChange={handleChange("newPedido")}
            sx={{
              backgroundImage: "none",
              backgroundColor: "#001122 !important",
              p: 2,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="newPedidobh-content"
              id="newPedidobh-header"
            >
              <Typography
                sx={{ width: "33%", flexShrink: 0, mr: 2 }}
                fontSize={isMobile ? 12 : 16}
              >
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              </Typography>
              <Typography
                sx={{ width: "100%", color: "text.secondary" }}
                fontSize={isMobile ? 12 : 16}
              >
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Skeleton
                variant="text"
                sx={{ width: "100%", fontSize: "2rem" }}
              />
              <Skeleton
                variant="text"
                sx={{ width: "90%", fontSize: "1rem" }}
              />
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                <Skeleton
                  variant="text"
                  sx={{ width: "150px", fontSize: "2rem" }}
                />
              </Box>
            </AccordionDetails>
          </Accordion>
          <Accordion
            disabled={true}
            expanded={expanded === "newCotizacion"}
            onChange={handleChange("newCotizacion")}
            sx={{
              backgroundImage: "none",
              backgroundColor: "#001122 !important",
              p: 2,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="newPedidobh-content"
              id="newPedidobh-header"
            >
              <Typography
                sx={{ width: "33%", flexShrink: 0, mr: 2 }}
                fontSize={isMobile ? 12 : 16}
              >
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              </Typography>
              <Typography
                sx={{ width: "100%", color: "text.secondary" }}
                fontSize={isMobile ? 12 : 16}
              >
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
            </AccordionDetails>
          </Accordion>
          <Accordion
            disabled={true}
            expanded={expanded === "newBodega"}
            onChange={handleChange("newBodega")}
            sx={{
              backgroundImage: "none",
              backgroundColor: "#001122 !important",
              p: 2,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="newPedidobh-content"
              id="newPedidobh-header"
            >
              <Typography
                sx={{ width: "33%", flexShrink: 0, mr: 2 }}
                fontSize={isMobile ? 12 : 16}
              >
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              </Typography>
              <Typography
                sx={{ width: "100%", color: "text.secondary" }}
                fontSize={isMobile ? 12 : 16}
              >
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    </Box>
  );
};

export { NewPedidoSkeleton };
