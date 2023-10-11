<template>
  <div>
    <el-form class="search_top form_row">
      <el-row>
        <el-col :span="5">
          <el-form-item label="文章名称">
            <el-input v-model="searchData.params.title"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-form-item label="文章类型">
            <el-select v-model="searchData.params.type" clearable>
              <el-option v-for="(item,index) in articleTypes" :key="index" :value="item.id" :label="item.title"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-form-item label="状态">
            <el-select v-model="searchData.params.isValid" clearable>
              <el-option v-for="(item,index) in isValids" :key="index" :value="item.id" :label="item.title"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-button @click="search" type="primary">搜索</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="table_action">
      <el-button type="primary" @click="editArticle()">新增</el-button>
      <el-button type="danger" @click="batchDel">批量删除</el-button>
    </el-row>
    <el-table class="search_table" :data="searchResult.data" @selection-change="handleSelectionChange" height="calc(100vh - 320px)" width="100%">
      <el-table-column type="index" width="30"> </el-table-column>
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="title" label="文章名称"></el-table-column>
      <el-table-column prop="type" label="文章类型">
        <template #default="scope">{{scope.row.articleType?.title}}</template>
      </el-table-column>
      <el-table-column label="缩略图">
        <template #default="scope">
          <el-avatar :src="scope.row.avatar"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template #default="scope">
          {{scope.row.isValid ? '启用': '禁用'}}
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="创建日期" show-overflow-tooltip>
        <template #default="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.createDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop label="操作" width="180">
        <template #default="scope">
          <div>
            <el-button @click="editArticle(scope.row.id)" type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click="delArticle(scope.row.id)" type="danger" icon="el-icon-delete" circle></el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="search_page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchData.page" :page-sizes="searchData.sizes" :page-size="searchData.pageSize" layout="total,jumper, sizes, prev, pager, next" :total="searchResult.total"></el-pagination>
    <el-dialog top="10px" title="编辑文章信息" v-model="dialogVisible" width="960px" :before-close="handleClose" :close-on-click-modal="false" destroy-on-close>
      <ArticleDetail ref="editRef" :id="id" @submit="submit" />
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { onMounted, reactive, ref, toRefs } from "vue";
import { Dict, PageRequest, PageResponse } from "@/types/common";
import { getArticleList, batchDeleteArticle, deleteGood } from "@/api/article";
import { ElMessage, ElMessageBox } from "element-plus";
import useArticleTypes from "@/composables/article/useArticleTypes";
import ArticleDetail from "./components/ArticleDetail.vue";
import { Article } from "@/types/article";
import { isValids } from "@/store/module/common";
class SearchModel {
  title: string = "";
  type: string = "";
  isValid: string = "";
}
export default {
  name: "ArticleList",
  components: {
    ArticleDetail,
  },
  setup() {
    // 查询逻辑
    const searchData = reactive<PageRequest<SearchModel>>(
      new PageRequest<SearchModel>(new SearchModel())
    );
    const searchResult = reactive<PageResponse<Article[]>>(
      new PageResponse<Article[]>([])
    );
    const { articleTypes, getArticleTypes } = useArticleTypes();

    const search = async () => {
      const res = await getArticleList(searchData);
      Object.assign(searchResult, res);
    };
    const delArticle = (id: string) => {
      ElMessageBox.confirm("此操作将永久删除该文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await deleteGood(id);
        if (res) {
          ElMessage.success("删除成功");
          search();
        }
      });
    };

    const multipleSelection = ref<Article[]>([]);
    const handleSelectionChange = (val: Article[]) => {
      multipleSelection.value = val;
    };
    const batchDel = async () => {
      if (!multipleSelection.value.length) {
        ElMessage.error("请选择需要删除的项");
        return;
      }
      const ids = multipleSelection.value.map((item: Article) => {
        return item.id;
      });
      const res = await batchDeleteArticle(ids);
      if (res) {
        ElMessage.success("批量删除成功");
        search();
      }
    };
    const handleSizeChange = (size: number) => {
      searchData.pageSize = size;
      search();
    };
    const handleCurrentChange = (page: number) => {
      searchData.page = page;
      search();
    };
    // TODO:新建编辑逻辑
    const id = ref<string>("");
    const dialogVisible = ref<boolean>(false);
    const editRef = ref<string>("");
    const editArticle = (articleId: string) => {
      id.value = articleId;
      dialogVisible.value = true;
    };
    const handleClose = (done: Function) => {
      ElMessageBox.confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    };
    const submit = () => {
      dialogVisible.value = false;
      search();
    };

    onMounted(() => {
      getArticleTypes();
      search();
    });
    return {
      searchData,
      articleTypes,
      searchResult,
      id,
      dialogVisible,
      editRef,
      multipleSelection,
      isValids,
      search,
      editArticle,
      delArticle,
      batchDel,
      handleSizeChange,
      handleCurrentChange,
      handleSelectionChange,
      handleClose,
      submit,
    };
  },
};
</script>
<style lang='less' scoped>
</style>