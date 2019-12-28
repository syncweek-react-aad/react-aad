export enum AuthenticationActions {
  Initializing = 'AAD_INITIALIZING',
  Initialized = 'AAD_INITIALIZED',
  LoginSuccess = 'AAD_LOGIN_SUCCESS',
  LoginFailed = 'AAD_LOGIN_FAILED',
  LoginError = 'AAD_LOGIN_ERROR',
  ClearError = 'AAD_CLEAR_ERROR',
  LogoutSuccess = 'AAD_LOGOUT_SUCCESS',
  AcquiredIdTokenSuccess = 'AAD_ACQUIRED_ID_TOKEN_SUCCESS',
  AcquiredIdTokenError = 'AAD_ACQUIRED_ID_TOKEN_ERROR',
  AcquiredAccessTokenSuccess = 'AAD_ACQUIRED_ACCESS_TOKEN_SUCCESS',
  AcquiredAccessTokenError = 'AAD_ACQUIRED_ACCESS_TOKEN_ERROR',
  AuthenticatedStateChanged = 'AAD_AUTHENTICATED_STATE_CHANGED',
}
