import {getUserInfoCache} from '../api/user.api'
import {Route} from "vue-router";
import router from "../../router";

export const mobileBindedGuard = () => {
  return async (to: Route, from: Route): Promise<boolean> => {
    let userInfo;

    try {
      userInfo = await getUserInfoCache();
    } catch (err) {
      return false;
    }

    if (!userInfo.mobile.number) {
      router.push({path: '/signup', query: {redirectTo: to.fullPath}});
      return false;
    }

    return true;
  }
};

