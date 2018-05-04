/*export const guests = [
  {
    index: 0,
    name: 'Chris Anderson',
    desc: ['3DR 首席执行官，《连线》杂质前主编，《长尾》、《免费》、《创客》作者'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsChris-Anderson_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsChris-Anderson_s.jpg'
  },
  {
    index: 1,
    name: 'Don Norman',
    desc: ['设计思想家，加利福尼亚大学圣地亚哥分校设计实验室主任，《设计心理学》作者，同济大学名誉教授'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsDon-Norman_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsDon-Norman_s.jpg'
  },
  {
    index: 2,
    name: 'Tuula Teeri',
    desc: ['瑞典皇家工程院院长'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsTuula-Teeri_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsTuula-Teeri_s.jpg'
  },
  {
    index: 3,
    name: 'Jochen Goller',
    desc: ['宝马集团大中华区总裁兼首席执行官'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsJochen-Goller_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsJochen-Goller_s.jpg'
  },
  {
    index: 4,
    name: 'Tuula Antola',
    desc: ['芬兰Espoo市副市长'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsTuula-Antola_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsTuula-Antola_s.jpg'
  },
  {
    index: 5,
    name: '张洋洋',
    desc: ['光启科学有限公司行政总裁'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestszhangyangyang_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestszhangyangyang_s.jpg'
  },
  {
    index: 6,
    name: '刘松',
    desc: ['阿里巴巴集团副总裁'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsliusong_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsliusong_s.jpg'
  },
  {
    index: 7,
    name: 'Luisa Collina',
    desc: ['米兰理工大学副校长、设计学院院长', 'Cumulus国际艺术、设计与媒体院校联盟 主席'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsLuisa-Collina_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsLuisa-Collina_s.jpg'
  },
  {
    index: 8,
    name: '孔那',
    desc: ['深圳安吉尔饮水产业集团有限公司总裁'],
    url: '',
    cover: ''
  },
  {
    index: 9,
    name: '骆新',
    desc: ['特邀主持、上海东方卫视创意总监、记者、新闻评论员'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsluoxin_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsluoxin_s.jpg'
  },
  {
    index: 10,
    name: '吴志强',
    desc: ['中国工程院 院士、同济大学副校长'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestswuzhiqiang_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestswuzhiqiang_s.jpg'
  },
  {
    index: 11,
    name: '李斌',
    desc: ['蔚来创始人、董事长'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestslibin_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestslibin_s.jpg'
  },
  {
    index: 12,
    name: 'Antti Ahlava',
    desc: ['芬兰阿尔托大学 副校长'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsAntti-Ahlava_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsAntti-Ahlava_s.jpg'
  },
  {
    index: 13,
    name: 'Kent Larson',
    desc: ['麻省理工学院媒体实验室城市科学实验室主任'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsKent-Larson_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsKent-Larson_s.jpg'
  },
  {
    index: 14,
    name: '李宁宁',
    desc: ['小米科技小米生态链工业设计高级总监'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsliningning_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsliningning_s.jpg'
  },
  {
    index: 15,
    name: '娄永琪',
    desc: ['同济大学设计创意学院 院长 教授'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestslouyongqi_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestslouyongqi_s.jpg'
  },
  {
    index: 16,
    name: '孙效华',
    desc: ['同济大学设计创意学院 副院长 教授'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestssunxiaohua_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestssunxiaohua_s.jpg'
  },
  {
    index: 17,
    name: 'Jarmo Souminem',
    desc: ['阿尔托大学/同济大学设计创意学院 教授'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsJarmo-Souminem_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsJarmo-Souminem_s.jpg'
  },
  {
    index: 18,
    name: '曹楠 ',
    desc: ['同济大学大数据可视化实验室 主任 教授'],
    url: '',
    cover: ''
  },
  {
    index: 19,
    name: 'Peter Vesterbacka',
    desc: ['愤怒的小鸟联合创始人，SLUSH联合创始人'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsPeter-Vesterbacka_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsPeter-Vesterbacka_s.jpg'
  },
  {
    index: 20,
    name: 'Srini Srinivasan',
    desc: ['世界设计组织（WDO）当选主席'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsSrini-Srinivasan_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsSrini-Srinivasan_s.jpg'
  },
  {
    index: 21,
    name: '忻榕',
    desc: ['中欧国际工商学院管理学教授、副教务长 (欧洲事务)、中国企业全球化中心联合主任'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsqirong_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsqirong_s.jpg'
  },
  {
    index: 22,
    name: '赵均宁',
    desc: ['万科国际学校 校长'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestszhaojunning_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestszhaojunning_s.jpg'
  },
  {
    index: 23,
    name: '王欣',
    desc: ['馒头商学院创始人'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestswangxin_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestswnagixin_s.jpg'
  },
  {
    index: 24,
    name: '陆坚',
    desc: ['LinkedIn中国区总裁'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestslujian_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestslujian_s.jpg'
  },
  {
    index: 25,
    name: '王敏',
    desc: ['长江学者、原中央美术学院设计学院院长'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestswangmin_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestswangmin_s.jpg'
  },
  {
    index: 26,
    name: '娄永琪',
    desc: ['同济大学设计创意学院 院长 教授'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestslouyongqi_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestslouyongqi_s.jpg'
  },
  {
    index: 27,
    name: '朱哲琴',
    desc: ['歌手，跨界声音艺术家，独立制作人，【看见造物】创始人，同济-朱哲琴声音实验室发起人\n'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestszhuzheqin_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestszhuzheqin_s.jpg'
  },
  {
    index: 28,
    name: 'Ami Vitale',
    desc: ['国家地理杂志摄影师'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsAmi-Vitale_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsAmi-Vitale_s.jpg'
  },
  {
    index: 29,
    name: '蒋琼耳',
    desc: ['「上下」首席执行官 & 艺术总监'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsjiangqionger_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsjiangqionger_s.jpg'
  },
  {
    index: 30,
    name: 'Piotr Loj',
    desc: ['Virtual VR Dream首席执行官'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsPiotr-Loj_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsPiotr-Loj_s.jpg'
  },
  {
    index: 31,
    name: 'Kyle Lawrence Mertensmeyer',
    desc: ['上海高德芬创始合伙人、首席设计师'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsKyle-Lawrence_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsKyle-Lawrence_s.jpg'
  },
  {
    index: 32,
    name: '奥雷·伯曼 Ole Bouman',
    desc: ['设计互联 馆长'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsOle-Bouman_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsOle-Bouman_s.jpg'
  }
];*/

export const guests = [
  {
    index: 0,
    id: '5aec1037ce87e80001a56bee',
    name: 'Chris Anderson',
    desc: ['3DR 首席执行官，《连线》杂质前主编，《长尾》、《免费》、《创客》作者'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsChris-Anderson_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsChris-Anderson_s.jpg'
  },
  {
    index: 1,
    id: '5aec1037ce87e80001a56bef',
    name: 'Don Norman',
    desc: ['设计思想家，加利福尼亚大学圣地亚哥分校设计实验室主任，《设计心理学》作者，同济大学名誉教授'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsDon-Norman_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsDon-Norman_s.jpg'
  },
  {
    index: 2,
    id: '5aec1037ce87e80001a56bf0',
    name: 'Tuula Teeri',
    desc: ['瑞典皇家工程院院长'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsTuula-Teeri_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsTuula-Teeri_s.jpg'
  },
  {
    index: 3,
    id: '5aec106c6b3ff000012b326e',
    name: 'Jochen Goller',
    desc: ['宝马集团大中华区总裁兼首席执行官'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsJochen-Goller_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsJochen-Goller_s.jpg'
  },
  {
    index: 4,
    id: '5aec1163ce87e80001a56bf1',
    name: 'Tuula Antola',
    desc: ['芬兰Espoo市副市长'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsTuula-Antola_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsTuula-Antola_s.jpg'
  },
  {
    index: 5,
    id: '5aec1163ce87e80001a56bf2',
    name: '张洋洋',
    desc: ['光启科学有限公司行政总裁'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestszhangyangyang_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestszhangyangyang_s.jpg'
  },
  {
    index: 6,
    id: '5aec1163ce87e80001a56bf3',
    name: '刘松',
    desc: ['阿里巴巴集团副总裁'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsliusong_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsliusong_s.jpg'
  },
  {
    index: 7,
    id: '5aec1163ce87e80001a56bf4',
    name: 'Luisa Collina',
    desc: ['米兰理工大学副校长、设计学院院长', 'Cumulus国际艺术、设计与媒体院校联盟 主席'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsLuisa-Collina_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsLuisa-Collina_s.jpg'
  },
  {
    index: 8,
    name: '孔那',
    desc: ['深圳安吉尔饮水产业集团有限公司总裁'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestskongna_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestskongna_s.jpg'
  },
  {
    index: 9,
    id: '5aec128fce87e80001a56bf5',
    name: '骆新',
    desc: ['特邀主持、上海东方卫视创意总监、记者、新闻评论员'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsluoxin_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsluoxin_s.jpg'
  },
  {
    index: 10,
    id: '5aec128fce87e80001a56bf6',
    name: '吴志强',
    desc: ['中国工程院 院士、同济大学副校长'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestswuzhiqiang_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestswuzhiqiang_s.jpg'
  },
  {
    index: 11,
    id: '5aec128fce87e80001a56bf7',
    name: '李斌',
    desc: ['蔚来创始人、董事长'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestslibin_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestslibin_s.jpg'
  },
  {
    index: 12,
    id: '5aec12c46b3ff000012b326f',
    name: 'Antti Ahlava',
    desc: ['芬兰阿尔托大学 副校长'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsAntti-Ahlava_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsAntti-Ahlava_s.jpg'
  },
  {
    index: 13,
    id: '5aec13bbce87e80001a56bf8',
    name: 'Kent Larson',
    desc: ['麻省理工学院媒体实验室城市科学实验室主任'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsKent-Larson_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsKent-Larson_s.jpg'
  },
  {
    index: 14,
    id: '5aec13bbce87e80001a56bf9',
    name: '李宁宁',
    desc: ['小米科技小米生态链工业设计高级总监'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsliningning_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsliningning_s.jpg'
  },
  {
    index: 15,
    id: '5a27521894cd830001c2a2f4',
    name: '娄永琪',
    desc: ['同济大学设计创意学院 院长 教授'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestslouyongqi_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestslouyongqi_s.jpg'
  },
  {
    index: 16,
    id: '5aec13bbce87e80001a56bfa',
    name: '孙效华',
    desc: ['同济大学设计创意学院 副院长 教授'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestssunxiaohua_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestssunxiaohua_s.jpg'
  },
  {
    index: 17,
    id: '5aec13bbce87e80001a56bfb',
    name: 'Jarmo Souminem',
    desc: ['阿尔托大学/同济大学设计创意学院 教授'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsJarmo-Souminem_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsJarmo-Souminem_s.jpg'
  },
  {
    index: 18,
    name: '曹楠',
    desc: ['同济大学大数据可视化实验室 主任 教授'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestscaonan_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestscannan_s.jpg'
  },
  {
    index: 19,
    id: '5aec14e7ce87e80001a56bfc',
    name: 'Peter Vesterbacka',
    desc: ['愤怒的小鸟联合创始人，SLUSH联合创始人'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsPeter-Vesterbacka_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsPeter-Vesterbacka_s.jpg'
  },
  {
    index: 20,
    id: '5aec14e7ce87e80001a56bfd',
    name: 'Srini Srinivasan',
    desc: ['世界设计组织（WDO）当选主席'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsSrini-Srinivasan_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsSrini-Srinivasan_s.jpg'
  },
  {
    index: 21,
    id: '5aec14e7ce87e80001a56bfe',
    name: '忻榕',
    desc: ['中欧国际工商学院管理学教授、副教务长 (欧洲事务)、中国企业全球化中心联合主任'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsqirong_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsqirong_s.jpg'
  },
  {
    index: 22,
    id: '5aec14e7ce87e80001a56bff',
    name: '赵均宁',
    desc: ['万科国际学校 校长'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestszhaojunning_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestszhaojunning_s.jpg'
  },
  {
    index: 23,
    id: '5aec14e7ce87e80001a56c00',
    name: '王欣',
    desc: ['馒头商学院创始人'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestswangxin_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestswnagixin_s.jpg'
  },
  {
    index: 24,
    id: '5aec151d6b3ff000012b3270',
    name: '陆坚',
    desc: ['LinkedIn中国区总裁'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestslujian_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestslujian_s.jpg'
  },
  {
    index: 25,
    id: '5aec1613ce87e80001a56c02',
    name: '王敏',
    desc: ['长江学者、原中央美术学院设计学院院长'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestswangmin_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestswangmin_s.jpg'
  },
  {
    index: 26,
    id: '5a27521894cd830001c2a2f4',
    name: '娄永琪',
    desc: ['同济大学设计创意学院 院长 教授'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestslouyongqi_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestslouyongqi_s.jpg'
  },
  {
    index: 27,
    id: '59881bdd5a0cd800014a0e36',
    name: '朱哲琴',
    desc: ['歌手，跨界声音艺术家，独立制作人，【看见造物】创始人，同济-朱哲琴声音实验室发起人\n'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestszhuzheqin_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestszhuzheqin_s.jpg'
  },
  {
    index: 28,
    id: '5aec173fce87e80001a56c04',
    name: 'Ami Vitale',
    desc: ['国家地理杂志摄影师'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsAmi-Vitale_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsAmi-Vitale_s.jpg'
  },
  {
    index: 29,
    id: '58b8d8734b5b3479f27ea0b3',
    name: '蒋琼耳',
    desc: ['「上下」首席执行官 & 艺术总监'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsjiangqionger_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsjiangqionger_s.jpg'
  },
  {
    index: 30,
    id: '5aec173fce87e80001a56c05',
    name: 'Piotr Loj',
    desc: ['Virtual VR Dream首席执行官'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsPiotr-Loj_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsPiotr-Loj_s.jpg'
  },
  {
    index: 31,
    id: '5aec17756b3ff000012b3272',
    name: 'Kyle Lawrence Mertensmeyer',
    desc: ['上海高德芬创始合伙人、首席设计师'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsKyle-Lawrence_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsKyle-Lawrence_s.jpg'
  },
  {
    index: 32,
    id: '5aec186bce87e80001a56c06',
    name: '奥雷·伯曼 Ole Bouman',
    desc: ['设计互联 馆长'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsOle-Bouman_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsOle-Bouman_s.jpg'
  }
];

export const PlanList = [
  {
    title: '5.19',
    desc: '未来趋势峰会',
    content: [
      {
        start: '10:40',
        end: '11:05',
        title: [
          '主题演讲1：Chris Anderson'
        ],
        desc: '3DR 首席执行官，《连线》杂质前主编，《长尾》作者',
        status: 1
      },
      {
        start: '11:05',
        end: '11:30',
        title: [
          '主题演讲2：Don Norman',
        ],
        desc: '设计思想家，加利福尼亚大学圣地亚哥分校设计实验室主任',
        status: 1
      },
      {
        start: '11:30',
        end: '11:55',
        title: [
          '主题演讲3：Tuula Teeri'
        ],
        desc: '瑞典皇家工程院院长',
        status: 1
      },
      {
        start: '11:55',
        end: '14:00',
        title: [
          '午餐',
          '参观城市、大学、企业、组织馆'
        ],
        desc: '',
        status: 0
      },
      {
        start: '14:00',
        end: '14:25',
        title: [
          '主题演讲4：Tuula Antola'
        ],
        desc: '芬兰Espoo市副市长',
        status: 1
      },
      {
        start: '14:25',
        end: '14:50',
        title: [
          '主题演讲5：Jochen Goller'
        ],
        desc: '宝马集团大中华区总裁兼首席执行官',
        status: 1
      },
      {
        start: '14:50',
        end: '15:15',
        title: [
          '主题演讲6：张洋洋'
        ],
        desc: '光启科学有限公司行政总裁',
        status: 1
      },
      {
        start: '15:15',
        end: '15:40',
        title: [
          '休息'
        ],
        desc: '',
        status: 0
      },
      {
        start: '15:40',
        end: '16:05',
        title: [
          '主题演讲7：刘松'
        ],
        desc: '阿里巴巴集团副总裁',
        status: 1
      },
      {
        start: '16:05',
        end: '16:30',
        title: [
          '主题演讲8：Luisa Collina'
        ],
        desc: '米兰理工大学副校长、设计学院院长，Cumulus国际艺术、设计与媒体院校联盟 主席',
        status: 1
      },
      {
        start: '16:30',
        end: '16:55',
        title: [
          '主题演讲9：孙洪业'
        ],
        desc: '明码生物科技首席技术官、中国区负责人',
        status: 1
      },
      {
        start: '16:55',
        end: '17:20',
        title: [
          '主题演讲10：孔那'
        ],
        desc: '深圳安吉尔饮水产业集团有限公司总裁',
        status: 1
      },
      {
        start: '17:20',
        end: '17:50',
        title: [
          '大会总结：骆新'
        ],
        desc: '特邀主持、上海东方卫视创意总监、记者、新闻评论员',
        status: 1
      }
    ]
  },
  {
    title: '5.20',
    desc: '同济·MIT超越城市智慧论坛',
    content: [
      {
        start: '13:30',
        end: '13:35',
        title: [
          '开场演出'
        ],
        desc: '',
        status: 1
      },
      {
        start: '13:35',
        end: '13:40',
        title: [
          '欢迎/主持人'
        ],
        desc: '娄永琪-同济大学设计创意学院院长',
        status: 1
      },
      {
        start: '13:40',
        end: '14:30',
        title: [
          '演讲1：吴志强',
          '演讲2：李斌',
          '演讲3：李宁宁'
        ],
        desc: '',
        status: 1
      },
      {
        start: '14:30',
        end: '14:40',
        title: [
          '主题介绍:Kent Larson'
        ],
        desc: '',
        status: 1
      },
      {
        start: '14:40',
        end: '15:10',
        title: [
          '主题版块1：洞察',
          '演讲4：曹楠',
          '演讲5：Ronan Doorley',
          '演讲6：Marc Pons'
        ],
        desc: '',
        status: 1
      },
      {
        start: '15:10',
        end: '15:40',
        title: [
          '主题版块2：转型',
          '演讲7：Michael Lin',
          '演讲8：Jörg Noennig',
          '演讲9：Antti Tuomela'
        ],
        desc: '',
        status: 1
      },
      {
        start: '15:40',
        end: '16:00',
        title: [
          '休息'
        ],
        desc: '',
        status: 0
      },
      {
        start: '16:00',
        end: '16:30',
        title: [
          '主题版块3：预测、体验',
          '演讲10：Jarmo Souminem',
          '演讲11：Arnaud Grignard',
          '演讲12：孙效华，马可'
        ],
        desc: '',
        status: 1
      },
      {
        start: '16:30',
        end: '17:00',
        title: [
          '主题版块4：共识',
          '演讲13：张砚',
          '演讲14：Ariel Noyman',
          '演讲15：Markus ElKatsha'
        ],
        desc: '',
        status: 1
      },
      {
        start: '17:00',
        end: '17:30',
        title: [
          '主题版块5：部署',
          '演讲16：Hossein Rahnama',
          '演讲17：Yasushi Sakai',
          '演讲18：Luis Alonso'
        ],
        desc: '',
        status: 1
      },
      {
        start: '17:30',
        end: '17:40',
        title: [
          '结束语：Antti Ahlava'
        ],
        desc: '',
        status: 1
      },
      {
        start: '17:40',
        end: '19:00',
        title: [
          '城市科学馆展示与互动',
          '演示及交互体验',
          '主题对话',
          '视频采访',
          '与会者交流招待会'
        ],
        desc: '',
        status: 1
      },
      {
        start: '19:00',
        end: '20:00',
        title: [
          '总结致辞与闭幕酒会',
          '同济-MIT创新夜'
        ],
        desc: '',
        status: 1
      }
    ]
  },
  {
    title: '5.21',
    desc: '未来教育峰会',
    content: [
      {
        start: '13:00',
        end: '13:45',
        title: [
          '签到'
        ],
        desc: '',
        status: 1
      },
      {
        start: '13:45',
        end: '14:00',
        title: [
          '开场演出',
        ],
        desc: '',
        status: 1
      },
      {
        start: '14:00',
        end: '14:25',
        title: [
          '主题演讲1：Peter Vesterbacka'
        ],
        desc: '创新游戏教育公司Lightneer创始人，愤怒的小鸟联合创始人，SLUSH联合创始人',
        status: 1
      },
      {
        start: '14:25',
        end: '14:50',
        title: [
          '主题演讲2：汤维维'
        ],
        desc: '造就创始人及CEO',
        status: 1
      },
      {
        start: '14:50',
        end: '15:15',
        title: [
          '主题演讲3：忻榕'
        ],
        desc: '中欧国际工商学院管理学教授、副教务长 (欧洲事务)、中国企业全球化中心联合主任',
        status: 1
      },
      {
        start: '15:15',
        end: '15:40',
        title: [
          '主题演讲4：王敏'
        ],
        desc: '长江学者、原中央美术学院设计学院院长',
        status: 1
      },
      {
        start: '15:40',
        end: '16:00',
        title: [
          '休息'
        ],
        desc: '',
        status: 0
      },
      {
        start: '16:00',
        end: '6:25',
        title: [
          '主题演讲5：Srini Srinivasan'
        ],
        desc: '世界设计组织（WDO）当选主席',
        status: 1
      },
      {
        start: '16:25',
        end: '16:40',
        title: [
          '主题演讲6：王欣'
        ],
        desc: '馒头商学院创始人',
        status: 1
      },
      {
        start: '16:40',
        end: '17:05',
        title: [
          '主题演讲7：娄永琪'
        ],
        desc: '同济大学设计创意学院 院长 教授',
        status: 1
      },
      {
        start: '17:05',
        end: '17:30',
        title: [
          '大会总结：周斌'
        ],
        desc: '同济大学创新创业学院 执行副院长',
        status: 1
      }
    ]
  },
  {
    title: '5.22',
    desc: '城市艺术论坛',
    content: [
      {
        start: '13:00',
        end: '13:45',
        title: [
          '观众进场'
        ],
        desc: '',
        status: 1
      },
      {
        start: '13:45',
        end: '14:00',
        title: [
          '开场演出：金承志',
        ],
        desc: '彩虹合唱团',
        status: 1
      },
      {
        start: '14:00',
        end: '14:25',
        title: [
          '主题演讲1：kyle Lawrence Mertensmeyer'
        ],
        desc: '上海高德芬创始合伙人、首席设计师',
        status: 1
      },
      {
        start: '14:25',
        end: '14:50',
        title: [
          '主题演讲2：朱哲琴'
        ],
        desc: '著名音乐家，“看见/造物”创始人',
        status: 1
      },
      {
        start: '14:50',
        end: '15:15',
        title: [
          '主题演讲3：蒋琼耳'
        ],
        desc: '“上下”首席执行官&艺术总监',
        status: 1
      },
      {
        start: '15:15',
        end: '15:40',
        title: [
          '主题演讲4：奥雷·伯曼 Ole Bouman'
        ],
        desc: '设计互联 馆长',
        status: 1
      },
      {
        start: '15:40',
        end: '16:05',
        title: [
          '休息'
        ],
        desc: '',
        status: 0
      },
      {
        start: '16:05',
        end: '6:30',
        title: [
          '主题演讲5：Ami Vitale'
        ],
        desc: '国家地理杂志摄影师',
        status: 1
      },
      {
        start: '16:30',
        end: '16:55',
        title: [
          '主题演讲6：柳亦春'
        ],
        desc: '大舍建筑设计事务所主持建筑师、创始合伙人',
        status: 1
      },
      {
        start: '16:55',
        end: '17:20',
        title: [
          '主题演讲7：Piotr Loj'
        ],
        desc: 'Virtual VR Dream 首席执行官',
        status: 1
      },
      {
        start: '17:20',
        end: '17:45',
        title: [
          '主题演讲8：谷好好'
        ],
        desc: '上海昆剧团团长',
        status: 1
      },
      {
        start: '17:50',
        end: '18:00',
        title: [
          '大会总结：倪旻卿'
        ],
        desc: '同济大学设计创意学院',
        status: 1
      }
    ]
  }
];

