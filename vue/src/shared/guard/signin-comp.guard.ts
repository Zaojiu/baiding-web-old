import {auth} from '../utils/auth';
import {getUserInfo} from '../api/user.api'
import {Route} from "vue-router";
import {host} from "../../env/environment";
import {getRelativePath, isInApp, isInWechat} from "../utils/utils";
import router from "../../router";

export const signinGuard = (redirectTo: string) => {
  return async (to: Route, from: Route): Promise<boolean> => {
    redirectTo = getRelativePath(redirectTo, '/lives');

    try {
      await getUserInfo(false);
    } catch (err) {
      if (err.isUnauthorized) {
        if (isInApp || isInWechat) {
          auth(`${host.self}${redirectTo}`);
          return false;
        } else {
          return true;
        }
      } else {
        console.error(err);
        router.push({path: '/500', query: {redirectTo: to.fullPath}});
        return false;
      }
    }

    router.push(redirectTo);
    return false;
  }
};
