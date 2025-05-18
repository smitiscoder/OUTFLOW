import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { db } from "../../components/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { ArrowLeft } from "lucide-react"; // Import ArrowLeft
import {
  requestNotificationPermission,
  onMessageListener,
} from "../../utils/notifications";

const NotificationsPage = () => {
  const currentUser = getAuth().currentUser;
  const userId = currentUser?.uid;
  const navigate = useNavigate(); // Initialize navigate

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState([]);

  const tabs = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
    { id: "payments", label: "Payments" },
    { id: "alerts", label: "Alerts" },
  ];

  useEffect(() => {
    if (!userId || !notificationsEnabled) return;

    // Request notification permission
    requestNotificationPermission();

    // Listen for Firestore notifications
    const q = query(
      collection(db, "users", userId, "notifications"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(fetched);
      },
      (error) => {
        console.error("Error fetching notifications:", error);
      }
    );

    // Listen for FCM foreground notifications
    onMessageListener()
      .then((payload) => {
        const { notification } = payload;
        if (notification) {
          addDoc(collection(db, "users", userId, "notifications"), {
            title: notification.title || "New Notification",
            message: notification.body || "No message provided",
            type: "system",
            read: false,
            createdAt: new Date(),
          });
        }
      })
      .catch((error) => {
        console.error("Error receiving FCM message:", error);
      });

    return () => unsubscribe();
  }, [userId, notificationsEnabled]);

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    if (activeTab === "payments") return notification.type === "payment";
    if (activeTab === "alerts") return notification.type === "alert";
    return true;
  });

  const getTypeColor = (type) => {
    switch (type) {
      case "payment":
        return "bg-purple-500";
      case "reminder":
        return "bg-yellow-500";
      case "alert":
        return "bg-red-500";
      case "system":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const markAsRead = async (id) => {
    try {
      const docRef = doc(db, "users", userId, "notifications", id);
      await updateDoc(docRef, { read: true });
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#DFDFDF] p-4">
      {/* Header with Back Button */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-[#1A1A1A] mr-2"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Notifications</h1>
      </div>

      <div className="container mx-auto px-4 pb-20 max-w-md">
        {/* Toggle */}
        <div className="bg-[#1A1A1A] rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Notifications</h2>
              <p className="text-sm text-[#DFDFDF]/60">
                {notificationsEnabled ? "Enabled" : "Disabled"}
              </p>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                notificationsEnabled
                  ? "bg-gradient-to-r from-purple-500 to-[#9333EA]"
                  : "bg-gray-600"
              }`}
              aria-label={`Toggle notifications ${notificationsEnabled ? "off" : "on"}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationsEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {!notificationsEnabled ? (
          <div className="text-center py-8 text-[#DFDFDF]/60">
            Turn on to get notifications
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex flex-wrap justify-between gap-2 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[23%] px-2 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-purple-500 to-[#9333EA] text-[#DFDFDF]"
                      : "bg-[#1A1A1A] text-[#DFDFDF]/60"
                  }`}
                  aria-label={`View ${tab.label} notifications`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {/* List */}
            <div className="bg-[#1A1A1A] rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-6">Recent Notifications</h2>
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8 text-[#DFDFDF]/60">
                  No notifications found
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg cursor-pointer transition-colors ${
                        notification.read ? "bg-[#1A1A1A]" : "bg-[#252525]"
                      }`}
                      onClick={() => markAsRead(notification.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && markAsRead(notification.id)}
                    >
                      <div className="flex items-start">
                        <div
                          className={`w-3 h-3 rounded-full mt-1 mr-3 ${getTypeColor(
                            notification.type
                          )}`}
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium">{notification.title}</h3>
                            <span className="text-xs text-[#DFDFDF]/60">
                              {notification.createdAt?.seconds
                                ? new Date(
                                    notification.createdAt.seconds * 1000
                                  ).toLocaleString("en-US", {
                                    dateStyle: "short",
                                    timeStyle: "short",
                                  })
                                : ""}
                            </span>
                          </div>
                          <p className="text-sm text-[#DFDFDF]/80 mt-1">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
