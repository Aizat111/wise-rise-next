/** Access token (localStorage) */
export const ACCESS_TOKEN_KEY = "wise-rise-accessToken";

/** Authenticated user payload (localStorage) */
export const USER_KEY = "wise-rise-user";

/** Persisted multi-step registration draft (sessionStorage) */
export const REGISTER_FLOW_STORAGE_KEY = "wise-rise-register-flow";

/** Active Wise&Rise viewing profile (localStorage) */
export const ACTIVE_PROFILE_KEY = "wise-rise-active-profile";

/** Maximum profiles allowed per account */
export const MAX_PROFILES = 4;

/** Last subscription-status check + payload, keyed by user id (localStorage) */
export const SUBSCRIPTION_STATUS_STORAGE_PREFIX =
  "wise-rise-subscription-status-last-checked_";

/** Expiring-membership warning dismissed for a calendar day, keyed by user id */
export const SUBSCRIPTION_WARNING_DISMISSED_PREFIX =
  "wise-rise-subscription-warning-dismissed_";

/** Expired-today prompt already shown for a calendar day, keyed by user id */
export const SUBSCRIPTION_EXPIRED_PROMPTED_PREFIX =
  "wise-rise-subscription-expired-prompted_";

/** Selected plan for authenticated membership renewal (sessionStorage) */
export const RENEWAL_FLOW_STORAGE_KEY = "wise-rise-renewal-flow";
