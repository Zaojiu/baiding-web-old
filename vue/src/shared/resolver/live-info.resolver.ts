import {Route} from "vue-router";
import {router} from "../../router";
import {getLiveInfo, getLiveInfoCache} from "../api/lives.api";
import {ApiCode} from "../api/code-map.enum";

export const liveInfoResolver = () => {
  return async (to: Route, from: Route) => {
    const liveId = to.params['id'];

    const liveInfoCache = getLiveInfoCache(liveId);
    if (liveInfoCache) {
      to.meta['liveInfo'] = liveInfoCache;
      return;
    }

    try {
      to.meta['liveInfo'] = await getLiveInfo(liveId);
    } catch (e) {
      const code = e.code;
      if (code !== ApiCode.ErrUnauthorized && code !== ApiCode.ErrNeedToLogin) {
        router.push({path: '/500', query: {redirectTo: to.fullPath}});
        return false;
      }
    }
  }
};
