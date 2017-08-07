import {host} from "../../env/environment";
import {get} from "./xhr";
import {Column, ColumnItem, ColumnItemContent, ColumnItemDetail, ColumnUserInfo} from "./column.model";
import {Speaker} from "./speaker.model";

export const getColumnInfo = async (id: string): Promise<Column | null> => {
  const url = `${host.io}/api/live/columns/${id}`;
  const res = await get(url).catch(() => null);
  if (res === null) return null;

  const data = res.data.column;
  const speakerData = data.speaker;
  const userData = data.current_user_info;
  const speaker = speakerData ? new Speaker(speakerData.id, speakerData.uid,
    speakerData.subject, speakerData.desc, speakerData.coverUrl) : null;
  const currentUserInfo = userData ? new ColumnUserInfo(userData.isPaid, userData.paidAt, userData.praised, userData.shared) : null;

  return new Column(data.id, speaker, data.subject, data.desc, data.detail,
    data.totalFee, data.isNeedPay, data.subscribedTotal, data.totalVol, data.currentVol,
    data.status, data.publishAt, data.createdAt, data.updatedAt, currentUserInfo)
};

export const listColumnItems = async (id: string, size = 100, marker = ''): Promise<ColumnItem[] | null> => {
  const url = `${host.io}/api/live/columns/${id}/items_info?size=${size}&marker=${marker}`;
  const res = await get(url).catch(() => null);
  if (res === null) return null;

  const result = res.data.result || [];
  const items: ColumnItem[] = [];

  result.forEach((v: any) => {
    const item = new ColumnItem(v.id, v.columnId, v.vol, v.type, v.subject, v.desc, v.payType, v.status,
      v.viewTotal, v.commentTotal, v.publishAt, v.createdAt, v.updatedAt);
    items.push(item);
  });

  return items;
};

export const getColumnItemDetail = async (id: string): Promise<ColumnItemDetail | null> => {
  const url = `${host.io}/api/live/columns/items/${id}`;
  const res = await get(url).catch(() => null);
  if (res === null) return null;

  const columnData = res.data.column;
  const speakerData = columnData.speaker;
  const prevData = res.data.pre;
  const nextData = res.data.next;
  const currentData = res.data.item;

  const speaker = speakerData ? new Speaker(speakerData.id, speakerData.uid,
    speakerData.subject, speakerData.desc, speakerData.coverUrl) : null;
  const column = new Column(columnData.id, speaker, columnData.subject, columnData.desc, columnData.detail,
    columnData.totalFee, columnData.isNeedPay, columnData.subscribedTotal, columnData.totalVol, columnData.currentVol,
    columnData.status, columnData.publishAt, columnData.createdAt, columnData.updatedAt, null);

  const prev = prevData ? new ColumnItemContent(prevData.id, prevData.columnId, prevData.vol,
    prevData.type, prevData.subject, prevData.desc, prevData.payType, prevData.status,
    prevData.viewTotal, prevData.commentTotal, prevData.publishAt, prevData.createdAt,
    prevData.updatedAt, prevData.content, prevData.audioUrl, prevData.videoUrl) : null;
  const next = nextData ? new ColumnItemContent(nextData.id, nextData.columnId, nextData.vol,
    nextData.type, nextData.subject, nextData.desc, nextData.payType, nextData.status,
    nextData.viewTotal, nextData.commentTotal, nextData.publishAt, nextData.createdAt,
    nextData.updatedAt, nextData.content, nextData.audioUrl, nextData.videoUrl) : null;
  const current = new ColumnItemContent(currentData.id, currentData.columnId, currentData.vol,
    currentData.type, currentData.subject, currentData.desc, currentData.payType, currentData.status,
    currentData.viewTotal, currentData.commentTotal, currentData.publishAt, currentData.createdAt,
    currentData.updatedAt, currentData.content, currentData.audioUrl, currentData.videoUrl);

  return new ColumnItemDetail(column, current, prev, next);
};

