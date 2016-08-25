import { UserInfoModel } from '../../shared/user-info.model'
import { LiveRoomTimelineModelType } from './live-room-time.enum'

export class LiveRoomTimelineModel {
    id: string;
    user: UserInfoModel;
    content: string;
    type: LiveRoomTimelineModelType;
    praised: number;
    praisedUsers: UserInfoModel[];
    commented: number;
    createdAt: string;
}
