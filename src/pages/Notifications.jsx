import { useEffect, useState } from "react";
import Header from "../components/Header";
import { db } from "../components/firebase"; 
import {collection,query,orderBy,onSnapshot,updateDoc,doc,} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const NotificationsPage = () => {
  const currentUser = getAuth().currentUser;
  const userId = currentUser?.uid;

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
    if (!userId) return;

    const q = query(
      collection(db, "users", userId, "notifications"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(fetched);
    });

    return () => unsubscribe();
  }, [userId]);

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
    <div className="min-h-screen bg-[#0D0D0D] text-[#DFDFDF]">
      <Header title="Notifications" />

      <div className="container mx-auto px-4 pb-20 max-w-md">
        {/* Toggle */}
        <div className="bg-[#1A1A1A] rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Notifications</h2>
              <p className="text-sm text-[#DFDFDF] text-opacity-60">
                {notificationsEnabled ? "Enabled" : "Disabled"}
              </p>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                notificationsEnabled
                  ? "bg-gradient-to-r from-purple-500 to-pink-500"
                  : "bg-gray-600"
              }`}
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
          <div className="text-center py-8 text-[#DFDFDF] text-opacity-60">
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
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-[#DFDFDF]"
                      : "bg-[#1A1A1A] text-[#DFDFDF] text-opacity-60"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="bg-[#1A1A1A] rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-6">
                Recent Notifications
              </h2>

              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8 text-[#DFDFDF] text-opacity-60">
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
                    >
                      <div className="flex items-start">
                        <div
                          className={`w-3 h-3 rounded-full mt-1 mr-3 ${getTypeColor(
                            notification.type
                          )}`}
                        ></div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium">
                              {notification.title}
                            </h3>
                            <span className="text-xs text-[#DFDFDF] text-opacity-60">
                              {notification.createdAt?.seconds
                                ? new Date(
                                    notification.createdAt.seconds * 1000
                                  ).toLocaleString()
                                : ""}
                            </span>
                          </div>
                          <p className="text-sm text-[#DFDFDF] text-opacity-80 mt-1">
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

