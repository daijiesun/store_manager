import { ref } from 'vue'
import { getArticleTypeList } from '../../api/article';
import { ArticleType } from '../../types/article'

export default function useArticleTypes() {
  const articleTypes = ref<ArticleType[]>([]);
  const getArticleTypes = async () => {
    articleTypes.value = await getArticleTypeList();
  }

  return {
    articleTypes,
    getArticleTypes
  }
}