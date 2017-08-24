import {getUserInfoCache} from '../api/user.api'
import {Route} from "vue-router";
import router from "../../router";

export const mobileBindedGuard = (redirectTo: string) => {
  return async (to: Route, from: Route): Promise<boolean> => {
    let userInfo;

    try {
      userInfo = await getUserInfoCache();
    } catch (err) {
      router.push({path: '/signin', query: {redirectTo: to.fullPath}});
      return false;
    }

    const isMobileBinded = !!userInfo.mobile.number;

    if (isMobileBinded) router.push(redirectTo);

    return !isMobileBinded;
  }
};
