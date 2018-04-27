import {host} from '../../env/environment';
import {get} from '../../shared/api/xhr';
import {params} from '../../shared/utils/utils';
import {Course} from "../../shared/api/course.model";

export const getSpeakerInfo = async (id: string): Promise<any> => {
  const url = `${host.io}/api/live/objects/${id}`;
  const res = await get(url);
  const data = res.data;
  return data;
};

export const getSpeakerMidel = async (id: string): Promise<any> => {
  const url = `${host.io}/api/live/media?${params({speakersId: id, size: 20})}`;
  const res = await get(url);
  const data = res.data;
  return data;
};

export const getCourseTalk = async (id: string): Promise<any> => {
  const url = `${host.io}/api/live/talks?${params({speakersId: id, size: 20})}`;
  const res = await get(url);
  const data = res.data;
  return data;
};
