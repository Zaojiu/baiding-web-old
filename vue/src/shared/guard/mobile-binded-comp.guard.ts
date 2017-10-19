import {getUserInfoCache} from '../api/user.api'
import {Route} from "vue-router";
import router from "../../router";
import {getRelativePath} from "../utils/utils";

export const mobileBindedCompGuard = () => {
  return (to: Route, from: Route): Promise<boolean> => {
    let userInfo;

    try {
      userInfo = getUserInfoCache();
    } catch (err) {
      router.push({path: '/signin', query: {redirectTo: to.fullPath}});
      return false;
    }

    const isMobileBinded = !!userInfo.mobile.number;

    if (isMobileBinded) {
      const redirectTo = getRelativePath(to.query['redirectTo'], '/lives');
      router.push(redirectTo);
    }

    return !isMobileBinded;
  }
};
