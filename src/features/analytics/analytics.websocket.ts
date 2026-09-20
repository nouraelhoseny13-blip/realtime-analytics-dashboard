import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  WebSocketService,
  type WebSocketStatus,
} from "../../services/websocket";

import type {
  AnalyticsPeriod,
  AnalyticsResponse,
} from "./analytics.types";

type AnalyticsMessage = {
  type: "analytics";
  period: AnalyticsPeriod;
  data: AnalyticsResponse;
};

type ErrorMessage = {
  type: "error";
  period: AnalyticsPeriod;
  message: string;
};

type IncomingMessage = AnalyticsMessage | ErrorMessage;

function getWebSocketUrl(period: AnalyticsPeriod) {
  const apiUrl =
    import.meta.env.VITE_API_URL ??
    "http://127.0.0.1:8000/api";

  const websocketBaseUrl = apiUrl
    .replace(/^http/, "ws")
    .replace(/\/api\/?$/, "");

  return `${websocketBaseUrl}/api/ws/analytics?period=${period}`;
}

function buildQueryKey(period: AnalyticsPeriod) {
  return ["analytics", period, undefined, undefined, undefined];
}

export function useAnalyticsWebSocket(period: AnalyticsPeriod) {
  const queryClient = useQueryClient();

  const [status, setStatus] =
    useState<WebSocketStatus>("connecting");

  const [lastError, setLastError] =
    useState<Error | null>(null);

  const [reconnectedAt, setReconnectedAt] =
    useState<number | null>(null);

  const serviceRef =
    useRef<WebSocketService<IncomingMessage> | null>(null);

  const statusRef =
    useRef<WebSocketStatus>("connecting");

  const initialPeriodRef =
    useRef(period);

  const pendingPeriodRef =
    useRef(period);

  const hasConnectedBeforeRef =
    useRef(false);

  const wasDisconnectedRef =
    useRef(false);

  useEffect(() => {
    const websocket = new WebSocketService<IncomingMessage>(
      getWebSocketUrl(initialPeriodRef.current),
      {
        reconnect: true,
        reconnectDelay: 3000,

        onStatusChange: (nextStatus) => {
          statusRef.current = nextStatus;
          setStatus(nextStatus);

          if (nextStatus === "connected") {
            if (
              hasConnectedBeforeRef.current &&
              wasDisconnectedRef.current
            ) {
              setReconnectedAt(Date.now());
            }

            hasConnectedBeforeRef.current = true;
            wasDisconnectedRef.current = false;

            if (pendingPeriodRef.current !== "custom") {
              websocket.send({
                type: "set_period",
                period: pendingPeriodRef.current,
              });
            }
          }

          if (
            nextStatus === "disconnected" ||
            nextStatus === "error"
          ) {
            wasDisconnectedRef.current = true;
          }
        },

        onMessage: (message) => {
          if (message.type === "error") {
            console.error(
              "Analytics WebSocket error:",
              message.message
            );

            setLastError(
              new Error(message.message)
            );

            return;
          }

          if (message.period === "custom") {
            return;
          }

          queryClient.setQueryData<AnalyticsResponse>(
            buildQueryKey(message.period),
            message.data
          );
        },

        onError: () => {
          console.error(
            "Analytics WebSocket connection error."
          );

          setLastError(
            new Error(
              "Analytics WebSocket connection error."
            )
          );
        },
      }
    );

    serviceRef.current = websocket;

    websocket.connect();

    return () => {
      serviceRef.current = null;
      websocket.disconnect();
    };
  }, [queryClient]);

  useEffect(() => {
    pendingPeriodRef.current = period;

    if (period === "custom") {
      return;
    }

    if (
      serviceRef.current &&
      statusRef.current === "connected"
    ) {
      serviceRef.current.send({
        type: "set_period",
        period,
      });
    }
  }, [period]);

  return {
    status,
    isConnected: status === "connected",
    isConnecting: status === "connecting",
    isDisconnected: status === "disconnected",
    hasError: status === "error",
    lastError,
    reconnectedAt,
  };
}
