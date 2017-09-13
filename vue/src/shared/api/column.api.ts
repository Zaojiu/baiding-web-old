import {host} from "../../env/environment";
import {get} from "./xhr";
import {Column, ColumnItem, ColumnItemDetail} from "./column.model";
import {params} from "../utils/utils";

export const getColumnInfo = async (id: string): Promise<Column> => {
  const url = `${host.io}/api/live/columns/${id}`;
  const res = await get(url);
  const data = res.data.column;

  return new Column(data);
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

