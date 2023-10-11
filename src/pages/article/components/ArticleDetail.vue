<template>
  <div class="article_detail form_row">
    <el-divider content-position="left">基础信息</el-divider>
    <section>
      <el-form :model="articleDetail" label-width="110px" ref="form" :rules="rules">
        <el-row>
          <el-col :sm="12" :md="8">
            <el-form-item label="文章名称" prop="title">
              <el-input v-model.trim="articleDetail.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8">
            <el-form-item label="文章描述" prop="description">
              <el-input v-model.trim="articleDetail.description"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8">
            <el-form-item label="文章种类" prop="type">
              <el-select v-model="articleDetail.type">
                <el-option v-for="item in articleTypes" :key="item.id" :label="item.title" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8">
            <el-form-item label="文章金额" prop="amount">
              <el-input-number v-model="articleDetail.amount" controls-position="right" :min="0"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8">
            <el-form-item label="文章库存" prop="count">
              <el-input-number v-model="articleDetail.count" controls-position="right" :min="0" step-strictly></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8">
            <el-form-item label="启用">
              <el-switch v-model="articleDetail.isValid"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </section>
    <el-divider content-position="left">缩略图配置</el-divider>
    <section class="upload">
      <el-upload :action="uploadUrl" :headers="{'Authorization': authorization}" list-type="picture-card" :auto-upload="true" :show-file-list="true" :on-success="avatarSuccess" :file-list="articleDetail.avatar">
        <template #default>
          <i class="el-icon-plus"></i>
        </template>
        <template #file="{ file }">
          <div>
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                <i class="el-icon-zoom-in"></i>
              </span>
            </span>
          </div>
        </template>
      </el-upload>
    </section>
    <el-divider content-position="left">轮播图配置</el-divider>
    <section class="upload">
      <el-upload :action="uploadUrl" list-type="picture-card" :auto-upload="true" :on-success="swiperSuccess" :file-list="articleDetail.swipeImages">
        <template #default>
          <i class="el-icon-plus"></i>
        </template>
        <template #file="{ file }">
          <div>
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                <i class="el-icon-zoom-in"></i>
              </span>
              <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </template>
      </el-upload>
    </section>
    <el-divider content-position="left">文章详情</el-divider>
    <section>
      <QuillEditor v-model="articleDetail.details" />
    </section>
    <section class="bottom-action">
      <el-button type="primary" @click="submitEdit">提交</el-button>
    </section>
    <el-dialog v-model="dialogVisible" append-to-body center>
      <img width="400" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { onMounted, reactive, ref, toRefs } from "vue";
import { Article, ArticleType, FilePath } from "@/types/article";
import QuillEditor from "@/components/RichEditor.vue";
import getters from "@/store/getters";
import { ElMessage } from "element-plus";
import { createArticle, updateArticle } from "@/api/article";
import useArticleTypes from "@/composables/article/useArticleTypes";
import { getArticleInfo } from "@/api/article";
import { getFileName } from "@/utils/common";
import { SSStorate } from '@/utils/storage';
export default {
  name: "ArticleDetail",
  props: {
    id: String,
  },
  components: {
    QuillEditor,
  },
  computed: {
    uploadUrl() {
      return `${getters.apiUrl()}/upload/action`;
    },
  },
  setup(props: any, { emit }) {
    const { id } = toRefs(props);
    const articleDetail = reactive<Article>(new Article());
    const { articleTypes, getArticleTypes } = useArticleTypes();
    const form = ref<any>("");
    const authorization = SSStorate.getItem('token')
    const rules = {
      title: { required: true, message: "请输入" },
      description: { required: true, message: "请输入" },
      type: { required: true, message: "请选择" },
      amount: { required: true, message: "请输入" },
      count: { required: true, message: "请输入" },
    };
    // have id is edit
    if (id.value) {
      getArticleInfo(id.value).then((res: Article) => {
        res.avatar = res.avatar
          ? ([
              {
                name: getFileName(res.avatar as string),
                url: res.avatar,
                uid: Date.now(),
              },
            ] as FilePath[])
          : [];
        res.swipeImages = (res.swipeImages as string[]).map((item: string) => {
          const name = getFileName(item);
          return {
            name,
            url: item,
            uid: name,
          };
        });
        Object.assign(articleDetail, { ...res });
      });
    } else {
      Object.assign(articleDetail, { ...new Article() });
    }

    //images
    let dialogImageUrl = ref<string>("");
    let dialogVisible = ref<boolean>(false);
    const handleRemove = (file: any) => {
      articleDetail.swipeImages = (
        articleDetail.swipeImages as Array<FilePath>
      ).filter((item: FilePath) => {
        return item.uid !== file.uid;
      });
    };
    // 轮播
    const swiperSuccess = (response: any, file: any) => {
      (articleDetail.swipeImages as Array<FilePath>).push({
        name: response.name,
        url: response.path,
        uid: file.uid,
      });
    };
    // 缩略图
    const avatarSuccess = (response: any, file: any) => {
      articleDetail.avatar = [
        {
          name: response.name,
          url: response.path,
          uid: file.uid,
        },
      ];
    };

    const handlePictureCardPreview = (file: any) => {
      dialogImageUrl.value = file.url;
      dialogVisible.value = true;
    };

    const submitEdit = () => {
      form.value.validate(async (val: boolean) => {
        if (val) {
          if (!articleDetail.avatar[0] || !articleDetail.swipeImages.length) {
            ElMessage.error("请选择图片");
            return;
          }
          const submitDto: Article = new Article();
          Object.assign(submitDto, articleDetail);
          submitDto.avatar = (submitDto.avatar as Array<FilePath>)[0]
            .url as string;
          submitDto.swipeImages = (
            submitDto.swipeImages as Array<FilePath>
          ).map<string>((item: FilePath) => {
            return item.url;
          });
          const action: Function = submitDto.id ? updateArticle : createArticle;
          await action({ ...submitDto });
          emit("submit");
        }
      });
    };
    onMounted(() => {
      getArticleTypes();
    });

    return {
      articleDetail,
      rules,
      articleTypes,
      dialogImageUrl,
      dialogVisible,
      form,
      handleRemove,
      handlePictureCardPreview,
      swiperSuccess,
      avatarSuccess,
      submitEdit,
    };
  },
};
</script>
<style lang='less' scoped>
.bottom-action {
  text-align: right;
  position: sticky;
  bottom: -14px;
  line-height: 40px;
  background-color: #fff;
}
</style>