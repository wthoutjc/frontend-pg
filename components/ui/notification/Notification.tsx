import { useRef, useEffect, useCallback } from "react";
import {
  Alert,
  IconButton,
  Typography,
  AlertTitle,
  Divider,
} from "@mui/material";

// Icons
import CloseIcon from "@mui/icons-material/Close";

// Interfaces
import { INotification } from "../../../interfaces";

// Redux
import { useAppDispatch } from "../../../hooks";
import { removeNotification } from "../../../reducers";

const Notification = ({
  id,
  message,
  type,
  title,
  autoDismiss,
}: INotification) => {
  const alertDom = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();

  const handleClose = useCallback(() => {
    dispatch(removeNotification(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (autoDismiss) {
      setTimeout(() => {
        handleClose();
      }, 5000);
    }
  }, [autoDismiss, handleClose]);

  return (
    <Alert
      ref={alertDom}
      className="notification__alert animate__animated animate__bounceInRight"
      variant="filled"
      severity={type}
      action={
        <IconButton aria-label="close" size="small" onClick={handleClose}>
          <CloseIcon fontSize="inherit" />
        </IconButton>
      }
    >
      <AlertTitle>{title}</AlertTitle>
      <Divider />
      <Typography
        sx={{
          width: "100%",
          fontSize: "100%",
          textAlign: "justify",
          textOverflow: "ellipsis",
          overflow: "hidden",
          textTransform: "inherit",
        }}
        variant="body1"
      >
        {message}
      </Typography>
    </Alert>
  );
};

export { Notification };
