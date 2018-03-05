import {getUserInfoCache} from '../api/user.api';
import {Route} from "vue-router";
import {router} from "../../router";

export const memberGuard = () => {
  return async (to: Route, from: Route): Promise<boolean> => {
    try {
      let userInfo = getUserInfoCache(false);
      if (userInfo && userInfo.member.valid) {
        router.push({path: 'new-member/card'});
      }
    } catch (err) {
      return true;
    }
    return true;
  };
};
