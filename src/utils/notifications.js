// src/utils/notifications.js
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { messaging } from "../components/firebase";

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");
      const messagingInstance = getMessaging();
      const token = await getToken(messagingInstance, {
        vapidKey: "BB31_rnK5mA3RL5I1erinOSkiPHU6OKCjBUoHPbSaGJGCGigsyR-X9FAhZ8irYCGabtuCtHCT7wHUfO9Xh7DgCY",
      });
      if (token) {
        console.log("FCM Token:", token);
        return token;
      } else {
        console.warn("No registration token available.");
      }
    } else {
      console.warn("Notification permission denied.");
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    const messagingInstance = getMessaging();
    onMessage(messagingInstance, (payload) => {
      console.log("Foreground message received:", payload);
      resolve(payload);
    });
  });