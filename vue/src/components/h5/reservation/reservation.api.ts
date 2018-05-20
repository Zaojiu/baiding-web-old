import {post} from '../../../shared/api/xhr';
import {host} from '../../../env/environment';

export const bookGuestsMockData = [
  {
    index: 1,
    id: '5a27521794cd830001c2a2ec',
    name: '郭宇航',
    enName: '',
    desc: ['点融创始人及联合CEO'],
    enDesc: [''],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guests/guoyuhang_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guests/guoyuhang_s.jpg'
  },
  {
    index: 2,
    id: '5afe5b7d04ea6d0001baa38e',
    name: '戴京焦',
    enName: '',
    desc: ['贝塔网络金融科技CEO', '前嘉实基金副总经理，首席投资官'],
    enDesc: [''],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guests/daijingjiao_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guests/daijingjiao_s.jpg'
  },
  {
    index: 3,
    id: '5afe5ca904ea6d0001baa38f',
    name: '李婷',
    enName: '',
    desc: ['云锋金融集团首席执行官'],
    enDesc: [''],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guests/liting_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guests/liting_s.jpg'
  },
  {
    index: 4,
    id: '58b8d8724b5b3479f27ea094',
    name: '汤维维',
    enName: '',
    desc: ['造就创始人&CEO'],
    enDesc: [''],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guests/tangweiwei_s.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guests/tangweiwei_b.jpg'
  },
  {
    index: 5,
    id: '5a27521894cd830001c2a2f4',
    name: '娄永琪',
    enName: 'Lou Yongqi',
    desc: ['同济大学设计创意学院 院长 教授'],
    enDesc: ['Dean and Professor of School of Design and Creativity, Tongji University'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestslouyongqi_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestslouyongqi_s.jpg'
  },
  {
    index: 6,
    id: '5aec1613ce87e80001a56c02',
    name: '王敏',
    enName: 'Wang Min',
    desc: ['长江学者、原中央美术学院设计学院院长'],
    enDesc: ['Member of Chang Jiang Scholars Program, former Dean of the School of Design, Central Academy of Fine Arts'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestswangmin_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestswangmin_s.jpg'
  },
  {
    index: 7,
    id: '5a1f71e59df6bf0001156b9d',
    name: '范凌',
    enName: '',
    desc: ['特赞创始人兼首席执行官，世界经济论坛全球青年领袖'],
    enDesc: [''],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guests/fanling_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guests/fanling_s.jpg'
  },
  {
    index: 8,
    id: '5aec14e7ce87e80001a56bfc',
    name: 'Peter Vesterbacka',
    enName: 'Peter Vesterbacka',
    desc: ['愤怒的小鸟联合创始人，SLUSH联合创始人'],
    enDesc: ['Co-founder of Angry Birds and SLUSH'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsPeter-Vesterbacka_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsPeter-Vesterbacka_s.jpg'
  },
  {
    index: 9,
    id: '5aec14e7ce87e80001a56bff',
    name: '赵均宁',
    enName: 'Zhao Junning',
    desc: ['万科国际学校 校长'],
    enDesc: ['Principal of Shanghai Vanke International School'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestszhaojunning_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestszhaojunning_s.jpg'
  },
  {
    index: 10,
    id: '5aec16496b3ff000012b3271',
    name: 'Ali Vahabzadeh',
    enName: '',
    desc: ['共享交通初创公司Chariot创始人及董事会成员'],
    enDesc: [''],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guests/AliVahabzadeh_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guests/AliVahabzadeh_s.jpg'
  },
  {
    index: 11,
    id: '5aec14e7ce87e80001a56c00',
    name: '王欣',
    enName: 'Wang Xin',
    desc: ['馒头商学院创始人'],
    enDesc: ['Founder of MTEDU.com'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestswangxin_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestswnagixin_s.jpg'
  },
  {
    index: 12,
    id: '5aec128fce87e80001a56bf5',
    name: '骆新',
    enName: 'Luo Xin',
    desc: ['特邀主持、上海东方卫视创意总监、记者、新闻评论员'],
    enDesc: ['Chief correspondent of DRAGON TV, Director of the Department of Broadcasting and Hosting, Shanghai Theatre Academy'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsluoxin_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsluoxin_s.jpg'
  }
];

export const maxMeet = 5; // 最大见面人数
export const maxQuestion = 100; // 最大问题数
export const meetTime = '6点'; // 最大问题数

export const postQuestion = async (speakerName: string, name: string, mobile: string, question: string): Promise<any> => {
  const data = {
    speakerName,
    name,
    mobile,
    question
  };
  let url = `${ host.io }/api/live/misc/speaker_meetups`;
  try {
    let res = await post(url, data);
    return res.data;
  } catch (e) {
    throw e;
  }
};
