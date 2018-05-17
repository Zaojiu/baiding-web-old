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
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsChris-Anderson_s.jpg',
    meetTime: '',
    meetAddress: ''
  },
  {
    index: 1,
    id: '5aec1037ce87e80001a56bef',
    name: 'Don Norman',
    enName: 'Don Norman',
    desc: ['设计思想家，加利福尼亚大学圣地亚哥分校设计实验室主任，《设计心理学》作者，同济大学名誉教授'],
    enDesc: ['Design thinker, Director of Design'],
    url: 'https://og9s6vxbs.qnssl.com/wiee/guestsDon-Norman_b.jpg',
    cover: 'https://og9s6vxbs.qnssl.com/wiee/guestsDon-Norman_s.jpg',
    meetTime: '',
    meetAddress: ''
  }];


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
