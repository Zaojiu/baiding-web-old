import {getUserInfoCache} from '../api/user.api'
import {Route} from "vue-router";
import router from "../../router";

export const memberActivateCompGuard = () => {
  return async (to: Route, from: Route): Promise<boolean> => {
    let userInfo;

    try {
      userInfo = await getUserInfoCache();
    } catch (err) {
      router.push({path: '/signin', query: {redirectTo: to.fullPath}});
      return false;
    }

    if (userInfo.member.valid) {
      router.push({path: '/member/info'});
      return false;
    }

    return true;
  }
};
