import {post} from '../../../shared/api/xhr';
import {host} from '../../../env/environment';

export const bookGuestsMockData = [
  {
    index: 0,
    id: '5aec1037ce87e80001a56bee',
    name: 'Chris Anderson',
    enName: 'Chris Anderson',
    desc: ['3DR 首席执行官，《连线》杂志前主编，《长尾》、《免费》、《创客》作者'],
    enDesc: ['CEO of 3DR, Former Editor-in-chief of WIRED Magazine, Author of “The Long Tail”, “FREE” and “Makers”'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsChris-Anderson_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsChris-Anderson_s.jpg'
  },
  {
    index: 1,
    id: '5aec1037ce87e80001a56bef',
    name: 'Don Norman',
    enName: 'Don Norman',
    desc: ['设计思想家，加利福尼亚大学圣地亚哥分校设计实验室主任，《设计心理学》作者，同济大学名誉教授'],
    enDesc: ['Design thinker, Director of Design Laboratory, University of California, San Diego, author of “Design Psychology”, Honorary Professor of Tongji University'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsDon-Norman_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsDon-Norman_s.jpg'
  },
  {
    index: 2,
    id: '5aec1037ce87e80001a56bf0',
    name: 'Tuula Teeri',
    enName: 'Tuula Teeri',
    desc: ['瑞典皇家工程院院长'],
    enDesc: ['President of the Royal Swedish Academy of Engineering'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsTuula-Teeri_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsTuula-Teeri_s.jpg'
  },
  {
    index: 3,
    id: '5aec1163ce87e80001a56bf2',
    name: '张洋洋',
    enName: 'Zhang Yangyang',
    desc: ['光启科学有限公司行政总裁'],
    enDesc: ['Executive President of Kuangchi Science'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestszhangyangyang_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestszhangyangyang_s.jpg'
  },
  {
    index: 4,
    id: '5aec1163ce87e80001a56bf3',
    name: '刘松',
    enName: 'Liu Song',
    desc: ['阿里巴巴集团副总裁'],
    enDesc: ['Vice-President of Alibaba Group'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsliusong_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsliusong_s.jpg'
  },
  {
    index: 5,
    id: '5aec14e7ce87e80001a56bfd',
    name: 'Srini Srinivasan',
    enName: 'Srini Srinivasan',
    desc: ['世界设计组织（WDO）当选主席'],
    enDesc: ['President of World Design Organization'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsSrini-Srinivasan_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsSrini-Srinivasan_s.jpg'
  },
  {
    index: 6,
    id: '5af565791824d200019725ec',
    name: 'Ilkka Niemelä',
    enName: '',
    desc: ['芬兰阿尔托大学校长'],
    enDesc: [''],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guests/Ilkka_Niemelä_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guests/Ilkka_Niemelä_s.jpg'
  },
  {
    index: 7,
    id: '5aec1037ce87e80001a56bf0',
    name: 'Tuula Teeri',
    enName: 'Tuula Teeri',
    desc: ['瑞典皇家工程院院长'],
    enDesc: ['President of the Royal Swedish Academy of Engineering'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsTuula-Teeri_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsTuula-Teeri_s.jpg'
  },
  {
    index: 8,
    id: '5aec3235ce87e80001a56c09',
    name: '孔那',
    enName: '',
    desc: ['深圳安吉尔饮水产业集团有限公司'],
    enDesc: [''],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestskongna_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestskongna_s.jpg'
  },
  {
    index: 9,
    id: '5aec1163ce87e80001a56bf4',
    name: 'Luisa Collina',
    enName: 'Luisa Collina',
    desc: ['米兰理工大学副校长、设计学院院长', 'Cumulus国际艺术、设计与媒体院校联盟 主席'],
    enDesc: ['Vice-President of Polytechnic University of Milan and Dean of the School of Design\n' +
    'President of Cumulus International Association of Universities and Colleges of Art, Design and Media'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsLuisa-Collina_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsLuisa-Collina_s.jpg'
  },
];

export const maxMeet = 3; // 最大见面人数
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
