import auth from '../auth';
import userApi from '../api/user.api'
import {Route} from "vue-router";

export default (redirectTo: string) => {
  return async (to: Route, from: Route): Promise<boolean> => {
    const userInfo = await userApi.getUserInfo();

    if (userInfo) {
      return true;
    } else {
      auth(redirectTo);
      return false;
    }
  }
}
