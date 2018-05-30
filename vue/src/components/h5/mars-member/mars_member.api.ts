import {post} from '../../../shared/api/xhr';
import {host} from '../../../env/environment';

export const postName = async (name: string, mobile: string, email: string): Promise<any> => {
  const data = {
    name,
    mobile,
    email
  };
  let url = `${ host.io }/api/live/mars_save/mars_save_name`;
  try {
    let res = await post(url, data);
    return res.data;
  } catch (e) {
    throw e;
  }
};
