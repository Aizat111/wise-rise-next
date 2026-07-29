export type NotifyType = "success" | "error" | "warning" | "info";

export type NotifyItem = {
  id: string;
  type: NotifyType;
  message: string;
  duration: number;
  createdAt: number;
};

export type NotifyOptions = {
  /** Auto-dismiss duration in ms. Default: 4000. Pass `Infinity` to disable. */
  duration?: number;
  /** Optional stable id to replace an existing toast with the same id. */
  id?: string;
};

export type NotifyApi = {
  success: (message: string, options?: NotifyOptions) => string;
  error: (message: string, options?: NotifyOptions) => string;
  warning: (message: string, options?: NotifyOptions) => string;
  info: (message: string, options?: NotifyOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
};
