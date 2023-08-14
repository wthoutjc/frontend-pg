import { useRouter } from "next/router";
import {
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
} from "@mui/material";

// Icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface Props {
  expanded: string | false;
  value: string;
  callback: (event: React.SyntheticEvent, isExpanded: boolean) => void;
  title: string;
  subtitle: string;
  videoLink?: string;
  guiaLink?: string;
}

const FAQLayout = ({
  expanded,
  value,
  callback,
  title,
  subtitle,
  videoLink,
  guiaLink,
}: Props) => {
  const router = useRouter();

  return (
    <Accordion expanded={expanded === value} onChange={callback}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="restore-passwordbh-content"
        id="restore-passwordbh-header"
      >
        <Typography sx={{ width: "33%", flexShrink: 0 }}>{title}</Typography>
        <Typography sx={{ color: "text.secondary" }}>{subtitle}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {videoLink && (
          <Box
            sx={{
              display: "flex",
              mb: 1,
              alignItems: "center",
            }}
          >
            <Typography variant="body1" color="text.secondary" sx={{ mr: 3 }}>
              Video:
            </Typography>
            <Button
              variant="contained"
              size="small"
              color="success"
              onClick={() => router.push(videoLink)}
            >
              Ver video
            </Button>
          </Box>
        )}
        {guiaLink && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography variant="body1" color="text.secondary" sx={{ mr: 3 }}>
              Guía:
            </Typography>
            <Button
              variant="contained"
              size="small"
              color="success"
              onClick={() => router.push(guiaLink)}
            >
              Ver guía
            </Button>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export { FAQLayout };
