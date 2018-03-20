import {host} from "../../env/environment";
import {del, get, post} from "./xhr";
import {Column, ColumnItem, ColumnItemCommentModel, ColumnItemDetail} from "./column.model";
import {params} from "../utils/utils";

export const getColumnInfo = async (id: string): Promise<Column> => {
  const url = `${host.io}/api/live/columns/${id}`;
  const res = await get(url);
  const data = res.data.column;
  const currentUserInfo = res.data.current_user_info;

  return new Column(data, currentUserInfo);
};

export const listColumnItems = async (id: string, size = 100, marker = ''): Promise<ColumnItem[]> => {
  const query = {size, marker};
  const url = `${host.io}/api/live/columns/${id}/items_info?${params(query)}`;
  const res = await get(url);

  const data = res.data.result || [];
  const items: ColumnItem[] = [];
  data.forEach((itemData: any) => {
    const item = new ColumnItem(itemData);
    items.push(item);
  });

  return items;
};

export const getColumnItemDetail = async (id: string): Promise<ColumnItemDetail> => {
  const url = `${host.io}/api/live/columns/items/${id}`;
  const res = await get(url);
  const data = res.data;

  return new ColumnItemDetail(data);
};

export const listComments = async (id: string, size = 20, marker = '', sorts = ['-createdAt']): Promise<ColumnItemCommentModel[]> => {
  const query = {
    createdAt: marker,
    size: size,
    sorts: sorts.join(',')
  };
  const url = `${host.io}/api/live/columns/items/${id}/comments?${params(query)}`;
  const res = await get(url);
  const result = res.data.result;
  const users = res.data.include ? res.data.include.users : null;
  const comments = [];

  if (!result || !result.length) return [];

  for (let item of result) {
    comments.push(new ColumnItemCommentModel(item, users))
  }

  return comments;
};

export const postComment = async (id: string, content: string, parentId?: string) => {
  const data = {
    content,
    parentId
  };

  const url = `${host.io}/api/live/columns/items/${id}/comments`;
  try {
    await post(url, data);
  } catch (e) {
  }

  return;
};

export const praise = async (id: string) => {
  const url = `${host.io}/api/live/columns/items/${id}/praises`;
  try {
    await post(url, null);
  } catch (e) {
  }

  return;
};

export const unpraise = async (id: string) => {
  const url = `${host.io}/api/live/columns/items/${id}/praises`;
  try {
    await del(url);
  } catch (e) {
  }

  return;
};

// 加入圈子
export const joinGroup = async (id: string) => {
  const url = `${host.io}/api/group/groups/${id}/join`;
  try {
    await post(url, null);
  } catch (e) {
  }
  return;
};
