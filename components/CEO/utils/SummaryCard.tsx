import { Card, CardContent, Typography } from "@mui/material";

interface Props {
  title: string;
  value: string;
  isMobile: boolean;
}

const SummaryCard = ({ title, value, isMobile }: Props) => {
  return (
    <Card
      sx={{
        maxWidth: isMobile ? "100%" : 275,
        backgroundColor: "#112233",
        mr: isMobile ? 0 : 1,
        mb: isMobile ? 1 : 0,
        backgroundImage: "none",
        boxShadow: "2px 1px 5px 1px #bdc3c7",
      }}
    >
      <CardContent
        sx={{
          pb: isMobile ? "0 !important" : 1,
          p: isMobile ? 0.5 : 2,
        }}
      >
        <Typography
          variant="h5"
          component="div"
          fontSize={isMobile ? 13 : 18}
          fontWeight={600}
        >
          {title}
        </Typography>
        <Typography
          sx={{ mb: 1.5 }}
          color="text.secondary"
          fontSize={isMobile ? 11 : 15}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export { SummaryCard };
