import {getUserInfoCache} from '../api/user.api'
import {Route} from "vue-router";

export const authGuard = (redirectTo: string) => {
  return async (to: Route, from: Route): Promise<boolean> => {
    try {
      await getUserInfoCache(to.fullPath);
    } catch (err) {
      return false;
    }

    return true;
  }
}
