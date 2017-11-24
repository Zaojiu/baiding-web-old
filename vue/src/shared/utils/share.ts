import {isInApp, isInWechat} from './utils';
import {callHandler, initIOS} from "./ios";
import {showSharePopup} from "../../store/share";
import {environment, host} from "../../env/environment";
import {appendAfterEachHook} from "../../hooks";

declare const wx: any;

let _title = '', _desc = '', _cover = '', _link = '';

export const wechatSetShareInfo = async (title: string, desc: string, cover: string, link: string) => {
  _title = title;
  _desc = desc;
  _cover = cover;
  _link = link;

  if (desc.length > 19) desc = `${desc.slice(0, 18)}...`;

  wx.onMenuShareTimeline({
    title: title, // 分享标题
    link: link, // 分享链接
    imgUrl: cover, // 分享图标
    success: () => {
    },
    cancel: () => {
    }
  });

  wx.onMenuShareAppMessage({
    title: title, // 分享标题
    desc: desc, // 分享描述
    link: link, // 分享链接
    imgUrl: cover, // 分享图标
    success: () => {
    },
    cancel: () => {
    }
  });

  wx.onMenuShareQQ({
    title: title, // 分享标题
    desc: desc, // 分享描述
    link: link, // 分享链接
    imgUrl: cover, // 分享图标
    success: () => {
    },
    cancel: () => {
    }
  });

  wx.onMenuShareWeibo({
    title: title, // 分享标题
    desc: desc, // 分享描述
    link: link, // 分享链接
    imgUrl: cover, // 分享图标
    success: () => {
    },
    cancel: () => {
    }
  });

  wx.onMenuShareQZone({
    title: title, // 分享标题
    desc: desc, // 分享描述
    link: link, // 分享链接
    imgUrl: cover, // 分享图标
    success: () => {
    },
    cancel: () => {
    }
  })
};

export const iosSetShareInfo = async (title: string, desc: string, cover: string, link: string) => {
  _title = title;
  _desc = desc;
  _cover = cover;
  _link = link;

  await initIOS();
  callHandler('setShareInfo', {title: title, desc: desc, cover: cover, link: link}, () => {}, () => {});
  return;
};

export const pcSetShareInfo = (title: string, desc: string, cover: string, link: string) => {
  _title = title;
  _desc = desc;
  _cover = cover;
  _link = link;
};

let _setShareInfo: (title: string, desc: string, cover: string, link: string) => void;

if (isInWechat) {
  _setShareInfo = wechatSetShareInfo;
} else if (isInApp) {
  _setShareInfo = iosSetShareInfo;
} else {
  _setShareInfo = pcSetShareInfo;
}

export const setShareInfo = _setShareInfo;

//---------------------------------------------------------------------

export const wechatShare = () => {
  showSharePopup('');
};

export const iosShare = async () => {
  await initIOS();
  callHandler('share', {title: _title, desc: _desc, cover: _cover, link: _link}, () => {}, () => {});
  return;
};

export const pcShare = () => {
  showSharePopup(_link);
};

let _share: () => void;

if (isInWechat) {
  _share = wechatShare;
} else if (isInApp) {
  _share = iosShare;
} else {
  _share = pcShare;
}

export const share = _share;

export const setDefaultShareInfo = (shareTitle?: string, shareDesc?: string, shareCover?: string, shareLink?: string, isInheritShareInfo?: boolean) => {
  shareTitle = shareTitle || environment.config.name;
  shareDesc = shareDesc || environment.config.slogan;
  shareCover = shareCover || `${host.assets}/assets/img/zaojiu-logo.jpg`;
  shareLink = shareLink || `${host.self}/lives`; // 默认分享首页地址

  if (isInheritShareInfo && _title && _desc && _cover && _link) {
    setShareInfo(_title, _desc, _cover, _link);
  } else {
    setShareInfo(shareTitle, shareDesc, shareCover, shareLink);
  }
};

appendAfterEachHook((to, from) => {
  const shareTitle = to.meta.shareTitle;
  const shareDesc = to.meta.shareDesc;
  const shareCover = to.meta.shareCover;
  const shareLink = to.meta.shareLink;
  const isInheritShareInfo = !!to.meta.isInheritShareInfo;
  setDefaultShareInfo(shareTitle, shareDesc, shareCover, shareLink, isInheritShareInfo);
});
