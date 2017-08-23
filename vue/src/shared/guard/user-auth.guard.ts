import {getUserInfoCache} from '../api/user.api'
import {Route} from "vue-router";
import {getRelativePath} from "../utils/utils";
import router from "../../router";

export const authGuard = (redirectTo: string) => {
  return async (to: Route, from: Route): Promise<boolean> => {
    redirectTo = getRelativePath(redirectTo, '/lives');

    try {
      await getUserInfoCache();
    } catch (err) {
      router.push({path: '/signin', query: {redirectTo: to.fullPath}});
      return false;
    }

    return true;
  }
};
