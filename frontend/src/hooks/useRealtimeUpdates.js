import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";

const resolveSocketBaseUrl = () => {
  const explicitWsUrl = import.meta.env.VITE_WS_URL;
  if (explicitWsUrl && explicitWsUrl.trim()) {
    return explicitWsUrl.trim().replace(/\/$/, "");
  }

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  if (apiBaseUrl && apiBaseUrl.trim()) {
    return apiBaseUrl.trim().replace(/\/api\/?$/, "").replace(/\/$/, "");
  }

  return "https://safernest1.onrender.com";
};

export const useRealtimeUpdates = (onMessage) => {
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    const socketUrl = `${resolveSocketBaseUrl()}/ws`;

    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      reconnectDelay: 3000,
      onConnect: () => {
        client.subscribe("/topic/updates", (message) => {
          if (message.body) {
            onMessageRef.current(JSON.parse(message.body));
          }
        });
      },
      onStompError: () => {
      },
      onWebSocketError: () => {
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);
};
