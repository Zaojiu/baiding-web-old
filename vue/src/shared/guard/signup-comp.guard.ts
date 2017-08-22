import {getUserInfoCache} from '../api/user.api'
import {Route} from "vue-router";

export const signupGuard = (redirectTo: string) => {
  return async (to: Route, from: Route): Promise<boolean> => {
    let userInfo;

    try {
      userInfo = await getUserInfoCache(to.fullPath);
    } catch (err) {
      return false;
    }

    return !userInfo.mobile.number;
  }
};
