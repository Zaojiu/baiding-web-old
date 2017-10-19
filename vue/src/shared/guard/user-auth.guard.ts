import {getUserInfoCache} from '../api/user.api'
import {Route} from "vue-router";
import router from "../../router";

export const authGuard = () => {
  return async (to: Route, from: Route): Promise<boolean> => {
    try {
      getUserInfoCache(false);
    } catch (err) {
      router.push({path: '/signin', query: {redirectTo: to.fullPath}});
      return false;
    }

    return true;
  }
};
