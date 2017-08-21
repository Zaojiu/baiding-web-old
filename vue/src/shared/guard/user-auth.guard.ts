import {getUserInfo} from '../api/user.api'
import {Route} from "vue-router";
import router from '../../router';

export default (redirectTo: string) => {
  return async (to: Route, from: Route): Promise<boolean> => {
    try {
      await getUserInfo(false);
    } catch (err) {
      if (err.isUnauthorized) {
        router.push({path: '/signin', query: {redirectTo: redirectTo}});
      } else {
        router.push({path: '/reload', query: {redirectTo: redirectTo}});
      }
      return false;
    }

    return true;
  }
}
