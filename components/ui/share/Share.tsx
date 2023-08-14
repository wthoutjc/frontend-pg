import NextImage from "next/image";
import {
  Box,
  TextField,
  Typography,
  Tooltip,
  IconButton,
  Button,
} from "@mui/material";

// Icons
import LinkIcon from "@mui/icons-material/Link";
import ShareIcon from "@mui/icons-material/Share";

// uuid
import { v4 as uuid } from "uuid";

// Redux
import { useAppDispatch } from "../../../hooks";
import { newNotification } from "../../../reducers";

interface Props {
  link: string;
  base64Img: string;
  loading: boolean;
  title: string;
  text: string;
  file?: string;
  handleClose: () => void;
  setLoading: (loading: boolean) => void;
}

const Share = ({ link, base64Img, title, text, handleClose, file }: Props) => {
  const dispatch = useAppDispatch();

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(link);
    const notification = {
      id: uuid(),
      title: "Éxito:",
      message: "Enlace copiado al portapapeles",
      type: "success" as "success" | "error",
      autoDismiss: 5000,
    };
    dispatch(newNotification(notification));
  };

  const handleShare = async () => {
    const parts = base64Img.split(";base64,");
    const contentType = parts[0].split(":")[1];
    const raw = window.atob(parts[1]);
    const uInt8Array = new Uint8Array(
      Array.from(raw).map((char) => char.charCodeAt(0))
    );
    const img = new File(
      [new Blob([uInt8Array], { type: contentType })],
      "image.jpg",
      { type: contentType }
    );

    if (file) {
      const parts2 = file.split(";base64,");
      const raw2 = window.atob(parts2[1]);
      const uInt8Array2 = new Uint8Array(
        Array.from(raw2).map((char) => char.charCodeAt(0))
      );
      const filePDF = new File(
        [new Blob([uInt8Array2], { type: "application/pdf" })],
        "pedido.pdf",
        { type: "application/pdf" }
      );

      const data = {
        title,
        text,
        files: [img, filePDF],
      };

      if (navigator.canShare && navigator.canShare(data)) {
        return navigator.share(data);
      } else {
        return alert("No se puede compartir");
      }
    } else {
      const data = {
        title,
        text,
        files: [img],
      };

      if (navigator.canShare && navigator.canShare(data)) {
        return navigator.share(data);
      } else {
        return alert("No se puede compartir");
      }
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "auto",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          mb: 2,
          mt: 2,
        }}
        color="text.secondary"
      >
        {text}
      </Typography>
      <Box
        sx={{
          width: "100%",
          mb: 2,
        }}
      >
        <TextField
          fullWidth
          size="small"
          id="link-read-only"
          label="Url"
          defaultValue={link}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <Tooltip
                title="Copiar enlace"
                sx={{
                  zIndex: 100000,
                  position: "relative",
                }}
              >
                <IconButton onClick={handleCopyToClipboard}>
                  <LinkIcon />
                </IconButton>
              </Tooltip>
            ),
          }}
          variant="filled"
        />
      </Box>
      <Box
        sx={{
          width: "100%",
          p: 2,
          display: "flex",
          backgroundColor: "background.paper",
          mb: 2,
          overflow: "auto",
        }}
      >
        <NextImage
          src={base64Img}
          alt="Company S.A.S"
          width={1000}
          height={600}
          style={{
            objectFit: "contain",
          }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "space-evenly",
        }}
      >
        <Button
          variant="contained"
          onClick={handleShare}
          color="success"
          startIcon={<ShareIcon />}
        >
          Compartir
        </Button>
        <Button variant="contained" onClick={handleClose} color="error">
          Cancelar
        </Button>
      </Box>
    </Box>
  );
};

export { Share };
