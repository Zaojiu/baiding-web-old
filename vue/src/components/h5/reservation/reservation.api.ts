import {post} from '../../../shared/api/xhr';
import {host} from '../../../env/environment';

export const bookGuestsMockData = [
  {
    index: 1,
    id: '5aec186bce87e80001a56c06',
    name: '奥雷·伯曼 Ole Bouman',
    desc: ['设计互联 馆长'],
    enDesc: [''],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsOle-Bouman_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsOle-Bouman_s.jpg'
  },
  {
    index: 2,
    id: '5afe5dd504ea6d0001baa391',
    name: '刘克成',
    enName: '',
    desc: ['西安建筑科技大学建筑学院教授/刘克成设计工作室主持人'],
    enDesc: [''],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guests/liukecheng_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guests/liukecheng_s.jpg'
  },
  {
    index: 3,
    id: '5af556b2df46b50001e292d3',
    name: 'Tiziano Cattaneo',
    enName: '',
    desc: ['同济大学设计创意学院副教授、意大利建筑师协会注册一级建筑师，“上海千人计划”专家'],
    enDesc: [''],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guests/Tiziano_Cattaneo_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guests/Tiziano_Cattaneo_s.jpg'
  },

  {
    index: 4,
    id: '5af5563b1824d200019725de',
    name: '张周捷',
    enName: '',
    desc: ['独立设计师、艺术家'],
    enDesc: [''],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guests/zhangzhoujie_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guests/zhangzhoujie_s.jpg'
  },
  {
    index: 5,
    id: '5aec173fce87e80001a56c04',
    name: 'Ami Vitale',
    enName: 'Ami Vitale',
    desc: ['国家地理杂志摄影师'],
    enDesc: ['Photographer of National Geographic Magazine'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsAmi-Vitale_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsAmi-Vitale_s.jpg'
  },
  {
    index: 6,
    id: '5afe5dd504ea6d0001baa392',
    name: '朱晔',
    enName: '',
    desc: ['独立艺术家、策展人/广州美术学院建筑艺术设计学院兼职副教授'],
    enDesc: [''],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guests/zhuye_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guests/zhuye_s.jpg'
  },
  {
    index: 7,
    id: '5aec173fce87e80001a56c05',
    name: 'Piotr Loj',
    enName: 'Piotr Loj',
    desc: ['Virtual VR Dream首席执行官'],
    enDesc: ['CEO of Virtual VR Dream'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsPiotr-Loj_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsPiotr-Loj_s.jpg'
  },
  {
    index: 8,
    id: '5af558941824d200019725e0',
    name: '刘毅',
    enName: '',
    desc: ['艺术家，设计师，策展人'],
    enDesc: [''],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guests/liuyi_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guests/liuyi_s.jpg'
  }
];

export const maxMeet = 5; // 最大见面人数
export const maxQuestion = 10; // 最大问题数
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
