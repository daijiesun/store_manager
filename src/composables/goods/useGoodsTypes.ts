import { ref } from 'vue'
import { getGoodsTypeList } from '../../api/goods';
import { GoodsType } from '../../types/goods'

export default function useGoodsTypes() {
  const goodsTypes = ref<GoodsType[]>([]);
  const getGoodsTypes = async () => {
    goodsTypes.value = await getGoodsTypeList();
  }

  return {
    goodsTypes,
    getGoodsTypes
  }
}