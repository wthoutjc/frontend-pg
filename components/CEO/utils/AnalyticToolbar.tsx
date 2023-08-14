import { ToggleButton, ToggleButtonGroup } from "@mui/material";

// Icons
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import TableViewIcon from "@mui/icons-material/TableView";

interface Props {
  isMobile: boolean;
  view: "list" | "table";
  setView: (view: "list" | "table") => void;
}

const AnalyticToolbar = ({ isMobile, view, setView }: Props) => {
  return (
    <ToggleButtonGroup
      value={view}
      sx={{
        mr: isMobile ? 1 : 2,
      }}
      exclusive
      size="small"
    >
      <ToggleButton
        size="small"
        value="list"
        aria-label="list"
        onClick={() => setView("list")}
      >
        <ViewAgendaIcon fontSize="small" />
      </ToggleButton>
      <ToggleButton
        size="small"
        value="table"
        aria-label="table"
        onClick={() => setView("table")}
      >
        <TableViewIcon fontSize={isMobile ? "small" : "medium"} />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export { AnalyticToolbar };
