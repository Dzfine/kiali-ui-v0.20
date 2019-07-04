import { getType } from 'typesafe-actions';
import { LoginState as LoginStateInterface, LoginStatus } from '../store/Store';
import { KialiAppAction } from '../actions/KialiAppAction';
import { LoginActions } from '../actions/LoginActions';
import authenticationConfig from '../config/AuthenticationConfig';

export const INITIAL_LOGIN_STATE: LoginStateInterface = {
  status: LoginStatus.loggedOut,
  session: undefined,
  message: ''
};

// This Reducer allows changes to the 'loginState' portion of Redux Store
const loginState = (state: LoginStateInterface = INITIAL_LOGIN_STATE, action: KialiAppAction): LoginStateInterface => {
  switch (action.type) {
    case getType(LoginActions.loginRequest):
      return { ...INITIAL_LOGIN_STATE, status: LoginStatus.logging };
    case getType(LoginActions.loginSuccess):
      return { ...INITIAL_LOGIN_STATE, ...action.payload };
    case getType(LoginActions.loginExtend):
      return {
        ...INITIAL_LOGIN_STATE,
        status: LoginStatus.loggedIn,
        session: action.payload.session
      };
    case getType(LoginActions.loginFailure):
      let message = '连接失败。该连接为错误连接。';

      authenticationConfig.secretMissing = false;
      if (action.payload.error.request.status === 401) {
        message =
          '未经认证。您提供的用户名和密码无法访问Kiali。请检查用户名和密码后重试。';
      } else if (action.payload.error.request.status === 520) {
        authenticationConfig.secretMissing = true;
      }

      return { ...INITIAL_LOGIN_STATE, status: LoginStatus.error, message: message };
    case getType(LoginActions.logoutSuccess):
      // If login succeeds, we clear the secret missing flag, since the server
      // allowed the authentication
      authenticationConfig.secretMissing = false;
      return INITIAL_LOGIN_STATE;
    case getType(LoginActions.sessionExpired):
      return {
        ...INITIAL_LOGIN_STATE,
        status: LoginStatus.expired,
        message: '您的会话已过期或者在另一窗口终止。'
      };
    default:
      return state;
  }
};

export default loginState;
