import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";

export const useRealtimeUpdates = (onMessage) => {
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    const socketUrl = (import.meta.env.VITE_WS_URL || "http://localhost:8081") + "/ws";

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
