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
import {IosAudioService} from "./shared/bridge/audio/ios-audio.service";
import {PcAudioService} from "./shared/bridge/audio/pc-audio.service";
import {PcShareService} from "./shared/bridge/share/pc-share.service";
import {WechatImageService} from "./shared/bridge/image/wechat-image.service";
import {ImageBridge} from "./shared/bridge/image.interface";

export function audioServiceFactory(wechatAudioService: WechatAudioService, iosAudioService: IosAudioService, pcAudioService: PcAudioService): AudioBridge {
  return UtilsService.isInWechat ? wechatAudioService : UtilsService.isInApp ? iosAudioService : pcAudioService;
}

export function authServiceFactory(wechatAuthService: WechatAuthService, iosAuthService: IosAuthService, pcAuthService: PcAuthService): AuthBridge {
  return UtilsService.isInWechat ? wechatAuthService : UtilsService.isInApp ? iosAuthService : pcAuthService;
}

export function shareServiceFactory(wechatShareService: WechatShareService, iosShareService: IosShareService, pcShareService: PcShareService): ShareBridge {
  return UtilsService.isInWechat ? wechatShareService : UtilsService.isInApp ? iosShareService : pcShareService;
}

export function imageServiceFactory(wechatImageService: WechatImageService): ImageBridge {
  return UtilsService.isInWechat ? wechatImageService : UtilsService.isInApp ? wechatImageService : wechatImageService;
}
