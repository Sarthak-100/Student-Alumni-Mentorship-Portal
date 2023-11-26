import { React, useState, useEffect } from "react";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import Notification from "../components/Notification";
import { format } from "timeago.js";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useUserContext();

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
            setNotifications(response.data);
          })
          .catch((error) => {
            console.error("API Error:", error);
          });
      } catch (error) {
        console.error(error);
      }
    };
    getNotifications();
  }, []);
  return (
    <div>
      <h1>Notifications</h1>
      {notifications.map((notification) => (
        <Notification
          from={notification.senderName}
          message={notification.message}
          time={format(notification.createdAt)}
        />
      ))}
    </div>
  );
};

export default Notifications;
