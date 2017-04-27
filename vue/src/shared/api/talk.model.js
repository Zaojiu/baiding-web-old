import moment from 'moment'

export class TalkInfoMediaModel {
  constructor (mp3 = '', mp4 = '', mp4SD = '', mp4HD = '', preview = '', duration = 0) {
    this.mp3 = mp3
    this.mp4 = mp4
    this.mp4SD = mp4SD
    this.mp4HD = mp4HD
    this.preview = preview
    this.duration = moment.duration(duration)
  }

  get hasVideo () {
    return !!this.mp4 || !!this.mp4SD || !!this.mp4HD
  }

  get hasAudio () {
    return !!this.mp3
  }

  get hasPreview () {
    return !!this.preview
  }
}

export class TalkInfoRefModel {
  constructor (link = '', title = '') {
    this.link = link
    this.title = title
  }
}

export class TalkInfoSpeakerModel {
  constructor (id = '', uid = 0, name = '', title = '', avatar = '') {
    this.id = id
    this.uid = uid
    this.name = name
    this.title = title
    this.avatar = avatar
  }
}

export class TalkInfoCatalogModel {
  constructor (id = '', title = '') {
    this.id = id
    this.title = title
  }
}

export class TalkInfoModel {
  constructor (data, users, speakers, categories, tags, currentUserInfo) {
    this.id = data.id
    if (users && data.uid) this.userInfo = users[data.uid]
    this.subject = data.subject
    this.desc = data.desc
    this.coverUrl = `${data.coverUrl}?updatedAt=${Math.round(+data.updatedAt)}`
    this.coverSmallUrl = `${data.coverUrl}?imageMogr2/auto-orient/thumbnail/640x&updatedAt=${Math.round(+data.updatedAt)}`
    this.coverThumbnailUrl = `${data.coverUrl}?imageMogr2/auto-orient/thumbnail/80x&updatedAt=${Math.round(+data.updatedAt)}`

    this.cover169Url = `${data.coverUrl}~16-9?updatedAt=${Math.round(+data.updatedAt)}`
    this.coverSmall169Url = `${data.coverUrl}~16-9?imageMogr2/auto-orient/thumbnail/640x&updatedAt=${Math.round(+data.updatedAt)}`
    this.coverThumbnail169Url = `${data.coverUrl}~16-9?imageMogr2/auto-orient/thumbnail/80x&updatedAt=${Math.round(+data.updatedAt)}`

    this.cover11Url = `${data.coverUrl}~1-1?updatedAt=${Math.round(+data.updatedAt)}`
    this.coverSmall11Url = `${data.coverUrl}~1-1?imageMogr2/auto-orient/thumbnail/640x&updatedAt=${Math.round(+data.updatedAt)}`
    this.coverThumbnail11Url = `${data.coverUrl}~1-1?imageMogr2/auto-orient/thumbnail/80x&updatedAt=${Math.round(+data.updatedAt)}`

    this.isNeedPay = data.isNeedPay
    this.totalFee = data.totalFee
    this.praiseTotal = data.praiseTotal
    if (currentUserInfo) this.isPraised = currentUserInfo.praised
    this.commentTotal = data.commentTotal
    if (currentUserInfo) this.isFavorited = !!currentUserInfo.favoritedAt
    this.shareTotal = data.shared
    this.totalUsers = data.totalUsers

    if (data.latestPraisedUids) {
      data.latestPraisedUids.forEach((uid) => {
        const user = users[uid]
        if (user) this.latestPraisedUsers.push(user)
      })
    }

    if (data.latestUserUids) {
      data.latestUserUids.forEach((uid) => {
        const user = users[uid]
        if (user) this.latestUsers.push(user)
      })
    }

    this.content = data.meta && data.meta.content ? data.meta.content : ''
    this.isOriginal = data.meta && data.meta.isOriginal ? data.meta.isOriginal : true
    // data.meta.mp4暂不添加, 因为有的视频是mov
    this.media = data.meta ? new TalkInfoMediaModel(data.meta.mp3, '', data.meta.mp4SD, data.meta.mp4HD, data.meta.preview, data.meta.duration) : new TalkInfoMediaModel()

    if (data.meta && data.meta.refLink && data.meta.refLink.length) {
      for (const item of data.meta.refLink) {
        this.refLink.push(new TalkInfoRefModel(item.link, item.title))
      }
    }

    if (data.meta && data.meta.speakersId && data.meta.speakersId.length && speakers) {
      for (const id of data.meta.speakersId) {
        const speaker = speakers[id]
        if (speaker) this.speaker.push(new TalkInfoSpeakerModel(speaker.id, speaker.uid, speaker.subject, speaker.desc, speaker.coverUrl))
      }
    }

    if (tags && tags.length) {
      for (const item of tags) {
        this.tags.push(item)
      }
    }

    if (categories && categories.length) {
      for (const item of categories) {
        const catalogArr = []
        let catalog = item

        while (catalog) {
          catalogArr.unshift(new TalkInfoCatalogModel(catalog.id, catalog.title))
          catalog = catalog.parent
        }

        this.categories.push(catalogArr)
      }
    }

    this.createdAt = moment(+data.createdAt / 1e6)
    this.updatedAt = moment(+data.updatedAt / 1e6)
    this.publishAt = moment(data.publishAt)
  }
}

export class TalkCommentParentModel {
  constructor (userInfo, content, createdAt) {
    this.user = userInfo;
    this.content = content;
    this.createdAt = createdAt;
  }
}

export class TalkCommentModel {
  constructor (data, users) {
    this.id = data.id
    if (users) this.user = users[data.uid]
    if (data.parent && users) this.parent = new TalkCommentParentModel(users[data.parent.uid], data.parent.content, this.createdAt = moment(+data.parent.createdAt / 1e6))
    if (data.toUids) {
      for (const uid of data.toUsers) {
        this.toUsers.push(users[uid]);
      }
    }
    this.content = data.content;
    this.createdAt = moment(+data.createdAt / 1e6);
    this.originCreatedAt = data.createdAt;

  }
}

