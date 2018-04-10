import {host} from "../../env/environment";
import {del, get, post} from "./xhr";
import {Course, CourseItem, CourseItemCommentModel, CourseItemDetail} from "./course.model";
import {params} from "../utils/utils";

export const getCourseInfo = async (id: string): Promise<Course> => {
  const url = `${host.io}/api/course/courses/${id}`;
  const res = await get(url);
  const data = res.data.course;
  const currentUserInfo = res.data.current_user_info;

  return new Course(data, currentUserInfo);
};

export const listCourseItems = async (id: string, size = 100, marker = ''): Promise<CourseItem[]> => {
  const query = {size, marker};
  const url = `${host.io}/api/course/courses/${id}/items_info?${params(query)}`;
  const res = await get(url);

  const data = res.data.result || [];
  const items: CourseItem[] = [];
  data.forEach((itemData: any) => {
    const item = new CourseItem(itemData);
    items.push(item);
  });

  return items;
};

export const getCourseItemDetail = async (id: string, invitedBy = ''): Promise<CourseItemDetail> => {
  const query = {'invited_by': invitedBy};
  const url = `${host.io}/api/course/courses/items/${id}?${params(query)}`;
  const res = await get(url);
  const data = res.data;

  return new CourseItemDetail(data);
};

// 课程item
export const listComments = async (id: string, size = 20, marker = ''): Promise<CourseItemCommentModel[]> => {
  const query = {
    marker: marker,
    size: size
  };
  const url = `${host.io}/api/course/courses/items/${id}/comments?${params(query)}`;
  const res = await get(url);
  const result = res.data.result;
  const users = res.data.include ? res.data.include.users : null;
  const comments = [];

  if (!result || !result.length) return [];

  for (let item of result) {
    comments.push(new CourseItemCommentModel(item, users));
  }

  return comments;
};

export const listCourseComments = async (id: string, size = 20, marker = ''): Promise<CourseItemCommentModel[]> => {
  const query = {
    marker: marker,
    size: size
  };
  const url = `${host.io}/api/course/courses/${id}/comments?${params(query)}`;
  const res = await get(url);
  const result = res.data.result;
  const users = res.data.include ? res.data.include.users : null;
  const comments = [];

  if (!result || !result.length) return [];

  for (let item of result) {
    comments.push(new CourseItemCommentModel(item, users));
  }

  return comments;
};

export const postComment = async (id: string, content: string, parentId?: string) => {
  const data = {
    content,
    parentId
  };

  const url = `${host.io}/api/course/courses/items/${id}/comments`;
  try {
    await post(url, data);
  } catch (e) {
  }

  return;
};

export const postCourseComment = async (id: string, content: string, parentId?: string) => {
  const data = {
    content,
    parentId
  };
  const url = `${host.io}/api/course/courses/${id}/comments`;
  try {
    await post(url, data);
  } catch (e) {
    throw e;
  }

  return;
};


export const favorite = async (id: string) => {
  const url = `${host.io}/api/course/courses/${id}/favorites`;
  try {
    await post(url, null);
  } catch (e) {
  }

  return;
};

export const unFavorite = async (id: string) => {
  const url = `${host.io}/api/course/courses/${id}/favorites`;
  try {
    await del(url);
  } catch (e) {
  }

  return;
};

export const praise = async (id: string) => {
  const url = `${host.io}/api/course/courses/items/${id}/praises`;
  try {
    await post(url, null);
  } catch (e) {
  }

  return;
};

export const unpraise = async (id: string) => {
  const url = `${host.io}/api/course/courses/items/${id}/praises`;
  try {
    await del(url);
  } catch (e) {
  }

  return;
};

export const coursePraise = async (id: string) => {
  const url = `${host.io}/api/course/courses/${id}/praises`;
  try {
    await post(url, null);
  } catch (e) {
  }

  return;
};

export const courseUnpraise = async (id: string) => {
  const url = `${host.io}/api/course/courses/${id}/praises`;
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
