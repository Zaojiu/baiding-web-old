import {get} from "./xhr";
import {host} from '../../env/environment'
import {UserInfoModel} from './user.model'

export default {
  async getUserInfo (): Promise<UserInfoModel | Error> {
    const url = `${host.io}/api/user`;
    const res = await get(url);
    if (res instanceof Error) return res;
    return new UserInfoModel(res.data);
  },
}
