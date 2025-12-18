import { useState, useEffect } from "react";
import PageHeading from "../../shared/PageHeading";
import {
  useGetNotificationQuery,
  useMarkReadNotificationMutation,
} from "../redux/api/metaDataApi";

export default function Notification() {
  const { data: notificationData, refetch } = useGetNotificationQuery();
  const [markRead] = useMarkReadNotificationMutation();
console.log(notificationData)
 



  // Mark notification as read
  const handleMarkAsRead = async (id) => {
    try {
      await markRead(id);
      refetch(); 
    } catch (error) {
      console.log("Error marking as read:", error);
    }
  };

  return (
    <div className="overflow-y-auto">
      <div className="mb-3">
        <PageHeading title="Notification" />
      </div>

      {notificationData?.length > 0 ? (
        notificationData?.map((item) => (
          <div
            key={item._id}
           
            className={`relative p-3 border rounded-lg mb-3 transition ${
              item.isRead ? "bg-white" : "bg-blue-100"
            }`}
          >
            <h3 className="font-semibold text-gray-900">{item.title}</h3>

            <p className="text-sm text-gray-700">{item.body}</p>

            <p className="text-xs text-gray-500 mt-1">
              {new Date(item.createdAt).toLocaleDateString()} •{" "}
              {new Date(item.createdAt).toLocaleTimeString()}
            </p> 
            <button  onClick={() => handleMarkAsRead(item._id)} className="mt-1">Read</button>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 py-10">No notifications.</p>
      )}
    </div>
  );
}
