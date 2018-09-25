import { getUserInfoCache } from "../api/user.api";
import { Route } from "vue-router";
import { router } from "../../router";
import { getRelativePath } from "../utils/utils";
import { isInWechat } from "../utils/utils";

export const mobileBindedCompGuard = () => {
  return (to: Route, from: Route): boolean => {
    let userInfo;

    try {
      userInfo = getUserInfoCache(false);
    } catch (err) {
      router.push({ path: "/signin", query: { redirectTo: to.fullPath } });
      return false;
    }

    const isMobileBinded = !!userInfo.mobile.number;

    if (isMobileBinded) {
      const redirectTo = getRelativePath(to.query["redirectTo"], "/lives");
      router.push(redirectTo);
    }

    return !isMobileBinded;
  };
};

export const wechatBindMobileCompGuard = () => {
  return (to: Route, from: Route): boolean => {
    if (isInWechat) {
      return true;
    } else {
      router.push({
        path: "/lives"
      });
      return false;
    }
  };
};
