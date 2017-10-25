import {getUserInfoCache} from '../api/user.api'
import {Route} from "vue-router";
import {router} from "../../router";

export const memberActivateCompGuard = () => {
  return (to: Route, from: Route): boolean => {
    let userInfo;

    try {
      userInfo = getUserInfoCache(false);
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
