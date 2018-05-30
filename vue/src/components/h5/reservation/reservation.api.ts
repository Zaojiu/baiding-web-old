import {post} from '../../../shared/api/xhr';
import {host} from '../../../env/environment';

export const bookGuestsMockData = [
  {
    index: 1,
    id: '',
    name: '黎耕',
    desc: ['中国科学院国家天文台副研究员'],
    enDesc: [''],
    url: 'https://og9s6vxbs.qnssl.com/cover/img/FiF0gSZVatRcZr8XTfomCeHfW0wH-1525317837.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/cover/img/FiF0gSZVatRcZr8XTfomCeHfW0wH-1525317837.jpg'
  },
  {
    index: 2,
    id: '',
    name: '陈鹏飞',
    enName: '',
    desc: ['长江学者,南京大学天文与空间科学学院教授'],
    enDesc: [''],
    url: 'https://og9s6vxbs.qnssl.com/cover/img/FittMFwPVVGvfCj_Y69UcLgu91n0-1525328485.jpeg',
    cover: 'https://og9s6vxbs.qnssl.com/cover/img/FittMFwPVVGvfCj_Y69UcLgu91n0-1525328485.jpeg'
  },

  {
    index: 3,
    id: '',
    name: '周济林',
    enName: '',
    desc: ['南京大学天文与空间科学学院院长'],
    enDesc: [''],
    url: 'https://og9s6vxbs.qnssl.com/cover/img/FjeNaMuSN9AIntSvy0JxUiuVEVcm-1525317874.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/cover/img/FjeNaMuSN9AIntSvy0JxUiuVEVcm-1525317874.jpg'
  },
  {
    index: 4,
    id: '',
    name: '戴子高',
    enName: '',
    desc: ['长江学者,中国天文学会副理事长'],
    enDesc: ['Photographer of National Geographic Magazine'],
    url: 'https://og9s6vxbs.qnssl.com/cover/img/FjnanqiTVUwt7DI49HdfouQxyUXe-1525317893.png',
    cover: 'https://og9s6vxbs.qnssl.com/cover/img/FjnanqiTVUwt7DI49HdfouQxyUXe-1525317893.png'
  },
  {
    index: 5,
    id: '',
    name: '袁强',
    enName: '',
    desc: [',紫金山天文台研究员,暗物质粒子探测卫星“悟空”团队成员'],
    enDesc: [''],
    url: 'https://og9s6vxbs.qnssl.com/cover/img/Fur44Xb6DTfp3_6q6Ob9BGZQXJWs-1525402007.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/cover/img/Fur44Xb6DTfp3_6q6Ob9BGZQXJWs-1525402007.jpg'
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
