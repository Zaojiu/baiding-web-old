import auth from '../auth';
import userApi from '../api/user.api'

export default function (redirectTo) {
  return async function (to, from) {
    const userInfo = await userApi.getUserInfo();
    if (userInfo) {
      return;
    } else {
      auth(redirectTo);
      return false;
    }
  }
}
