import axios from 'axios'
import { host } from '../../env/environment'
import { TalkInfoModel } from './talk.model'

export default {
  getTalkInfo: async (id) => {
    const url = `${host.io}/api/live/objects/${id}`
    return await axios.get(url).then(res => {
      return new TalkInfoModel(res.data.object, res.data.users, res.data.speakers, res.data.categories, res.data.tags, res.data.currentUserInfo)
    })
  }
}
