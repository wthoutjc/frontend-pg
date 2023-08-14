import { Box } from "@mui/material";

// Components
import { Notification } from "./";

// Redux
import { useAppSelector } from "../../../hooks";

const Notifications = () => {
  const { notifications } = useAppSelector((state) => state.ui);

  return (
    <Box className={"notification__container"}>
      {notifications.map((notification) => (
        <Notification key={notification.id} {...notification} />
      ))}
    </Box>
  );
};

export { Notifications };
