// TODO: NotificationContext placeholder
import React, { createContext, useState } from 'react';

export const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const add = (n) => setNotifications((prev) => [...prev, n]);
  return (
    <NotificationContext.Provider value={{ notifications, add }}>
      {children}
    </NotificationContext.Provider>
  );
}
