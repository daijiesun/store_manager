import { PageRequest,PageResponse } from '@/types/common';
import { Article, ArticleType } from '@/types/article';
import { POST, GET, DELETE, PATCH } from './index';

// TODO: about article
export const getArticleList = (p: PageRequest<any>) => {
  return POST<PageResponse<Article>>('/article/page', p)
}

export const createArticle = (p: Article) => {
  return POST('/article', p)
}
export const getArticleInfo = (articleId: string) => {
  return GET<Article>(`/article/${articleId}`)
}
export const deleteGood = (id: string) => {
  return DELETE(`/article/${id}`)
}
export const batchDeleteArticle = (ids: string[]) => {
  return PATCH('/article/batch', ids)
}
export const updateArticle = (p: Article) => {
  return PATCH('/article/update', p)
}

//TODO: about article type
export const getArticleTypeList = () => {
  return GET<ArticleType[]>('/article/type/list')
}

export const deleteArticleType = (id: string) => {
  return DELETE(`/article/type/${id}`)
}

export const editArticleType = (dto: ArticleType) => {
  return PATCH('/article/type/submit', dto)
}