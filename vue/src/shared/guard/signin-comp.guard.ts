import auth from '../auth';
import {getUserInfo} from '../api/user.api'
import {Route} from "vue-router";
import {host} from "../../env/environment";
import {isInApp, isInWechat} from "../utils/utils";
import router from "../../router";

export const signinGuard = (redirectTo: string) => {
  return async (to: Route, from: Route): Promise<boolean> => {
    redirectTo = redirectTo.replace(host.self, '');
    if (redirectTo === '/') redirectTo = '/lives';

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
        router.push({path: '/reload', query: {redirectTo: redirectTo}});
        return false;
      }
    }

    router.push(redirectTo);
    return false;
  }
}
