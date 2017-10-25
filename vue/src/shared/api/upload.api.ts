import {UploadCoverTokenModel} from "./upload.model";
import {host} from "../../env/environment";
import {post} from "./xhr";

export const getCoverUploadToken = async (id: string): Promise<UploadCoverTokenModel> => {
  const url = `${host.io}/api/live/streams/${id}/cover/uptoken`;
  const resp = await post(url);
  const data = resp.data;
  return new UploadCoverTokenModel(data.key, data.token);
};
