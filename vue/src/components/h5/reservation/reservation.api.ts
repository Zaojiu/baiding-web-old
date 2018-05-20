import {post} from '../../../shared/api/xhr';
import {host} from '../../../env/environment';

export const bookGuestsMockData = [
  {
    index: 1,
    id: '5aec128fce87e80001a56bf6',
    name: '吴志强',
    enName: 'Wu Zhiqiang',
    desc: ['中国工程院 院士、同济大学副校长'],
    enDesc: ['Academician of the Chinese Academy of Engineering, Vice-President of Tongji University'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestswuzhiqiang_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestswuzhiqiang_s.jpg'
  },
  {
    index: 2,
    id: '5aec128fce87e80001a56bf7',
    name: '李斌',
    enName: 'Li Bin',
    desc: ['蔚来创始人、董事长'],
    enDesc: ['Founder and Chairman of NIO Auto'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestslibin_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestslibin_s.jpg'
  },
  {
    index: 3,
    id: '5aec13bbce87e80001a56bf9',
    name: '李宁宁',
    enName: 'Li Ningning',
    desc: ['小米科技小米生态链工业设计高级总监'],
    enDesc: ['Senior Director of Industrial Design of Xiaomi Technology'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsliningning_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsliningning_s.jpg'
  },
  {
    index: 4,
    id: '5aec3235ce87e80001a56c08',
    name: '曹楠',
    enName: 'Cao Nan',
    desc: ['同济大学大数据可视化实验室 主任 教授'],
    enDesc: ['Director and Professor of Big Data Visualization Laboratory, Tongji University'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestscaonan_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestscannan_s.jpg'
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
    id: '5aec13bbce87e80001a56bfa',
    name: '孙效华',
    enName: 'Sun Xiaohua',
    desc: ['同济大学设计创意学院 副院长 教授'],
    enDesc: ['Associate Dean and Professor of School of Design and Creativity, Tongji University'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestssunxiaohua_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestssunxiaohua_s.jpg'
  },
  {
    index: 7,
    id: '5aec13bbce87e80001a56bfb',
    name: 'Jarmo Souminem',
    enName: 'Jarmo Souminem',
    desc: ['阿尔托大学/同济大学设计创意学院 教授'],
    enDesc: ['Professor of School of Design and Creativity, Aalto University / Tongji University'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsJarmo-Souminem_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsJarmo-Souminem_s.jpg'
  },
  {
    index: 8,
    id: '5afe55a004ea6d0001baa387',
    name: 'Arnaud Grignard',
    enName: '',
    desc: ['麻省理工学院媒体实验室科学家'],
    enDesc: [''],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guests/Arnaud_Grignard_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guests/Arnaud_Grignard_s.jpg'
  },
  {
    index: 9,
    id: '5aec13bbce87e80001a56bf8',
    name: 'Kent Larson',
    enName: 'Kent Larson',
    desc: ['麻省理工学院媒体实验室城市科学实验室主任'],
    enDesc: ['Director of City Science Laboratory, MIT Media Lab'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsKent-Larson_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsKent-Larson_s.jpg'
  },
  {
    index: 10,
    id: '5afe534704ea6d0001baa382',
    name: 'Ronan Doorley',
    enName: '',
    desc: ['麻省理工学院媒体实验室科学家'],
    enDesc: [''],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guests/Ronan_Doorley_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guests/Ronan_Doorley_s.jpg'
  },
  {
    index: 11,
    id: '5afe534704ea6d0001baa383',
    name: 'Marc Pons',
    enName: '',
    desc: ['安道尔科学实验室主任'],
    enDesc: [''],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guests/Marc_Pons_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guests/Marc_Pons_s.jpg'
  },
  {
    index: 12,
    id: '5afe547404ea6d0001baa384',
    name: 'Michael Lin',
    enName: '',
    desc: ['麻省理工学院媒体实验室博士研究员'],
    enDesc: [''],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guests/Micheal_Lin_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guests/Micheal_Lin_s.jpg'
  },
  {
    index: 13,
    id: '5afe547404ea6d0001baa385',
    name: 'Jörg Noennig',
    enName: '',
    desc: ['堡城市科学实验室主任、汉堡港口大学教授'],
    enDesc: [''],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guests/Jörg_Noennig_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guests/Jörg_Noennig_s.jpg'
  },
  {
    index: 14,
    id: '5afe55a004ea6d0001baa386',
    name: 'Antti Tuomela',
    enName: '',
    desc: ['芬兰阿尔托大学地产公司首席执行官'],
    enDesc: [''],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guests/Antti_Tuomela_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guests/Antti_Tuomela_s.jpg'
  },
  {
    index: 15,
    id: '5afe55a004ea6d0001baa388',
    name: '马可',
    enName: '',
    desc: ['同济大学设计与创意学院副院长，研究员'],
    enDesc: [''],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guests/make_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guests/make_s.jpg'
  },
  {
    index: 16,
    id: '5afe55a004ea6d0001baa389',
    name: '张砚',
    enName: '',
    desc: ['麻省理工学院媒体实验室博士研究员'],
    enDesc: [''],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guests/zhangyan_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guests/zhangyan_s.jpg'
  },
  {
    index: 17,
    id: '5afe55a004ea6d0001baa38a',
    name: 'Ariel Noyman',
    enName: '',
    desc: ['麻省理工学院媒体实验室博士研究员'],
    enDesc: [''],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guests/Ariel_Noyman_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guests/Ariel_Noyman_s.jpg'
  },
  {
    index: 18,
    id: '5afe56cc04ea6d0001baa38b',
    name: 'Markus ElKatsha',
    enName: '',
    desc: ['麻省理工学院媒体实验室研究员'],
    enDesc: [''],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guests/Markus_ElKatsha_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guests/Markus_ElKatsha_s.jpg'
  },
  {
    index: 19,
    id: '5afe57f804ea6d0001baa38c',
    name: 'Yasushi Sakai',
    enName: '',
    desc: ['麻省理工学院媒体实验室博士研究员'],
    enDesc: [''],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guests/Yasushi_Sakai_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guests/Yasushi_Sakai_s.jpg'
  },
  {
    index: 20,
    id: '5afe57f804ea6d0001baa38d',
    name: 'Luis Alonso',
    enName: '',
    desc: ['麻省理工学院媒体实验室科学家'],
    enDesc: [''],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guests/Luis_Alonso_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guests/Luis_Alonso_s.jpg'
  },
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
