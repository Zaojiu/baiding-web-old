import { getUserInfoCache, getUserInfo4MobileCache } from "../api/user.api";
import { Route } from "vue-router";
import { router } from "../../router";

export const mobileBindedGuard = (needNew = false) => {
  return (to: Route, from: Route): boolean => {
    let userInfo;

    try {
      userInfo = getUserInfoCache(false);
    } catch (err) {
      router.push({ path: "/signin", query: { redirectTo: to.fullPath } });
      return false;
    }

    if (!userInfo.mobile.number) {
      if (needNew) {
        router.push({
          path: "/mobile-bind-event",
          query: { redirectTo: to.fullPath }
        });
      } else {
        router.push({
          path: "/mobile-bind",
          query: { redirectTo: to.fullPath }
        });
      }
      return false;
    }
    return true;
  };
};
