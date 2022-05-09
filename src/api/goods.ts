import { PageRequest,PageResponse } from '@/types/common';
import { Goods, GoodsType } from '@/types/goods';
import { POST, GET, DELETE, PATCH } from './index';

// TODO: about goods
export const getGoodsList = (p: PageRequest<any>) => {
  return POST<PageResponse<Goods>>('/goods/page', p)
}

export const createGoods = (p: Goods) => {
  return POST('/goods', p)
}
export const getGoodsInfo = (goodsId: string) => {
  return GET<Goods>(`/goods/${goodsId}`)
}
export const deleteGood = (id: string) => {
  return DELETE(`/goods/${id}`)
}
export const batchDeleteGoods = (ids: string[]) => {
  return PATCH('/goods/batch', ids)
}
export const updateGoods = (p: Goods) => {
  return PATCH('/goods/update', p)
}

//TODO: about goods type
export const getGoodsTypeList = () => {
  return GET<GoodsType[]>('/goods/type/list')
}

export const deleteGoodsType = (id: string) => {
  return DELETE(`/goods/type/${id}`)
}

export const editGoodsType = (dto: GoodsType) => {
  return PATCH('/goods/type/submit', dto)
}