import { React, useState, useEffect } from "react";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import Notification from "../components/Notification";
import { useNotificationsNoContext } from "../context/NotificationsNoContext";
import { useNavigate } from "react-router-dom";
import { useClearNotificationContext } from "../context/ClearNotificationContext";
import IconButton from "@mui/material/IconButton";

const Notifications = ({ reloadNotificationPage }) => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useUserContext();
  const { setNotificationsNoValue } = useNotificationsNoContext();
  const { clearNotification, setClearNotificationValue } =
    useClearNotificationContext();

  useEffect(() => {
    const getNotifications = async () => {
      try {
        await axios
          .get(
            `http://localhost:4000/api/v1/notifications/getNotifications?userId=${user._id}`,
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            console.log(response);
            const notificationsTemp = response.data;
            notificationsTemp.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setNotifications(notificationsTemp);
          })
          .catch((error) => {
            console.error("API Error:", error);
          });
        setNotificationsNoValue(0);
        setClearNotificationValue(1);
      } catch (error) {
        console.error(error);
      }
    };
    getNotifications();
  }, [reloadNotificationPage]);

  return (
    <div>
      <h1>Notifications</h1>
      {notifications.length !== 0 ? (
        <>
          {notifications.map((notification) => (
            <Notification notification={notification} />
          ))}
        </>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "10vh",
          }}
        >
          <p
            style={{
              fontStyle: "italic",
              color: "#808080",
              fontSize: "24px",
            }}
          >
            No unseen notifications!
          </p>
        </div>
      )}
    </div>
  );
};

export default Notifications;