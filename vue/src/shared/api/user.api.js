import xhr from './xhr'
import { host } from '../../env/environment'
import { UserInfoModel } from './user.model'

export default {
  async getUserInfo () {
    const url = `${host.io}/api/user`;
    const res = await xhr.get(url);
    if (res instanceof Error) return null;
    return new UserInfoModel(res.data);
  },
}
