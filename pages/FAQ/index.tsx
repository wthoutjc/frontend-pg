import { Box } from "@mui/material";

// Components
import { FAQ, ConnectedLayout } from "../../components";

// Redux
import { useAppSelector } from "../../hooks";

const FAQPage = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <ConnectedLayout title={"FAQ - Company S.A.S"}>
      <Box
        sx={{
          p: 2,
          width: "100%",
          backgroundColor: "#112233",
        }}
      >
        <FAQ user={user} />
      </Box>
    </ConnectedLayout>
  );
};

export default FAQPage;
