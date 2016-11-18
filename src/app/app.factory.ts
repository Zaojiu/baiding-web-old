import {WechatAudioService} from "./shared/bridge/audio/wechat-audio.service";
import {AudioBridge} from "./shared/bridge/audio.interface";
import {UtilsService} from "./shared/utils/utils";
import {WechatAuthService} from "./shared/bridge/auth/wechat-auth.service";
import {IosAuthService} from "./shared/bridge/auth/ios-auth.service";
import {PcAuthService} from "./shared/bridge/auth/pc-auth.service";
import {AuthBridge} from "./shared/bridge/auth.interface";
import {WechatShareService} from "./shared/bridge/share/wechat-share.service";
import {IosShareService} from "./shared/bridge/share/ios-share.service";
import {ShareBridge} from "./shared/bridge/share.interface";

export function audioServiceFactory(wechatAudioService: WechatAudioService): AudioBridge {
  return UtilsService.isInWechat ? wechatAudioService : UtilsService.isInApp ? wechatAudioService : wechatAudioService;
}

export function authServiceFactory(wechatAuthService: WechatAuthService, iosAuthService: IosAuthService, pcAuthService: PcAuthService): AuthBridge {
  return UtilsService.isInWechat ? wechatAuthService : UtilsService.isInApp ? iosAuthService : pcAuthService;
}

export function shareServiceFactory(wechatShareService: WechatShareService, iosShareService: IosShareService): ShareBridge {
  return UtilsService.isInWechat ? wechatShareService : UtilsService.isInApp ? iosShareService : wechatShareService;
}
