export type WebSocketStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

type WebSocketOptions<T> = {
  onMessage?: (data: T) => void;
  onStatusChange?: (
    status: WebSocketStatus
  ) => void;
  onError?: (error: Event) => void;
  reconnect?: boolean;
  reconnectDelay?: number;
};

export class WebSocketService<T> {
  private socket: WebSocket | null = null;

  private url: string;

  private options: WebSocketOptions<T>;

  private reconnectTimer: number | null = null;

  private shouldReconnect = true;

  constructor(
    url: string,
    options: WebSocketOptions<T> = {}
  ) {
    this.url = url;

    this.options = {
      reconnect: true,
      reconnectDelay: 3000,
      ...options,
    };
  }

  connect() {
    if (
      this.socket?.readyState === WebSocket.OPEN ||
      this.socket?.readyState === WebSocket.CONNECTING
    ) {
      return;
    }

    this.shouldReconnect =
      this.options.reconnect ?? true;

    this.options.onStatusChange?.(
      "connecting"
    );

    this.socket = new WebSocket(
      this.url
    );

    this.socket.onopen = () => {
      this.options.onStatusChange?.(
        "connected"
      );
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(
          event.data
        ) as T;

        this.options.onMessage?.(data);
      } catch {
        console.error(
          "Failed to parse WebSocket message."
        );
      }
    };

    this.socket.onerror = (error) => {
      this.options.onStatusChange?.(
        "error"
      );

      this.options.onError?.(error);
    };

    this.socket.onclose = () => {
      this.options.onStatusChange?.(
        "disconnected"
      );

      if (this.shouldReconnect) {
        this.scheduleReconnect();
      }
    };
  }

  send(data: unknown) {
    if (
      this.socket?.readyState !==
      WebSocket.OPEN
    ) {
      return;
    }

    this.socket.send(
      JSON.stringify(data)
    );
  }

  disconnect() {
    this.shouldReconnect = false;

    if (
      this.reconnectTimer !== null
    ) {
      window.clearTimeout(
        this.reconnectTimer
      );

      this.reconnectTimer = null;
    }

    this.socket?.close();

    this.socket = null;
  }

  private scheduleReconnect() {
    if (
      this.reconnectTimer !== null
    ) {
      return;
    }

    this.reconnectTimer =
      window.setTimeout(() => {
        this.reconnectTimer = null;

        if (this.shouldReconnect) {
          this.connect();
        }
      }, this.options.reconnectDelay);
  }
}
