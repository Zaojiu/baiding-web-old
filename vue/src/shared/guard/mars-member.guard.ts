import {getUserInfo} from '../api/user.api';
import {Route} from "vue-router";
import {router} from "../../router";

export const memberActionGuard = () => {
  return async (to: Route, from: Route): Promise<boolean> => {
    try {
      let userInfo = await getUserInfo(false);
      if (userInfo && userInfo.member.valid) {
        router.push({path: '/new-member/card'});
        return false;
      }
    } catch (err) {
      return true;
    }
    return true;
  };
};

export const memberCardGuard = () => {
  return async (to: Route, from: Route): Promise<boolean> => {
    try {
      let userInfo = await getUserInfo(false);
      if (!userInfo || !userInfo.member.valid) {
        router.push({path: '/new-member/action'});
        return false;
      }
    } catch (err) {
      router.push({path: '/new-member/action'});
      return false;
    }
    return true;
  };
};

export const memberPlanGuard = () => {
  return async (to: Route, from: Route): Promise<boolean> => {
    try {
      let userInfo = await getUserInfo(false);
      if (!userInfo || !userInfo.member.valid) {
        router.push({path: '/new-member/action'});
        return false;
      } else {
        if (userInfo.member.memberId === 'member-mars' || userInfo.member.memberId === 'member-aia-mars') {
          return true;
        } else {
          router.push({path: '/new-member/card'});
          return false;
        }
      }
    } catch (err) {
      router.push({path: '/new-member/action'});
      return false;
    }
  };
};
