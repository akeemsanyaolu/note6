export const TIME = {  
    /** CORS preflight cache duration (1 day) */
    CORS_MAX_AGE: 24 * 60 * 60,
 
  } as const;

/**
 * Rate limits and capacity constraints
 */
export const LIMITS = {
  /** Maximum API key requests per minute */
  API_KEY_MAX_REQUESTS_PER_MINUTE: 100,

  /** Maximum organization invitations per organization */
  ORGANIZATION_INVITATION_LIMIT: 100,

  /** Maximum organizations per user */
  ORGANIZATION_LIMIT: 100,

  /** Minimum password length */
  PASSWORD_MIN_LENGTH: 8,

  /** Maximum password length */
  PASSWORD_MAX_LENGTH: 256,

  /** Default pagination limit */
  DEFAULT_PAGINATION_LIMIT: 20,

  /** Maximum pagination limit */
  MAX_PAGINATION_LIMIT: 100,

  /**
   * GET /v1/chat (AI SDK UI history): default page size until the chat UI adds cursor navigation.
   * Same cap is used when merging server-side history on POST /v1/chat.
   */
  CHAT_UI_MESSAGES_DEFAULT_LIMIT: 200,

  /** Maximum messages returned in one GET /v1/chat page (matches current UI expectation). */
  CHAT_UI_MESSAGES_MAX_LIMIT: 200,

  /** Maximum upload size for direct user file uploads (1GB) */
  USER_UPLOAD_MAX_SIZE_BYTES: 1024 * 1024 * 1024,

  /** Minimum chargeable credits */
  MIN_CHARGEABLE_CREDITS: 1e-10,
} as const;