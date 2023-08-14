import NextImage from "next/image";
import { useRouter } from "next/router";
import { Box, Typography, Button } from "@mui/material";

interface Props {
  message: string;
}

const NotFound = ({ message }: Props) => {
  const router = useRouter();

  const handleExit = () => {
    router.push("/auth/login");
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#001122",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        borderRadius: 2,
      }}
    >
      <Box>
        <NextImage
          src="/images/no-results.png"
          alt="Company S.A.S"
          width={160}
          height={160}
        />
      </Box>
      <Typography variant="h1" fontWeight={800}>
        404
      </Typography>
      <Typography
        variant="h4"
        fontWeight={800}
        sx={{
          mb: 2,
        }}
      >
        {message}
      </Typography>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#112233",
          color: "white",
        }}
        onClick={handleExit}
      >
        Página principal
      </Button>
    </Box>
  );
};

export { NotFound };
