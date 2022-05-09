<template>
  <div class="goods_detail form_row">
    <el-divider content-position="left">基础信息</el-divider>
    <section>
      <el-form :model="goodsDetail" label-width="110px" ref="form" :rules="rules">
        <el-row>
          <el-col :sm="12" :md="8">
            <el-form-item label="商品名称" prop="title">
              <el-input v-model.trim="goodsDetail.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8">
            <el-form-item label="商品描述" prop="description">
              <el-input v-model.trim="goodsDetail.description"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8">
            <el-form-item label="商品种类" prop="type">
              <el-select v-model="goodsDetail.type">
                <el-option v-for="item in goodsTypes" :key="item.id" :label="item.title" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8">
            <el-form-item label="商品金额" prop="amount">
              <el-input-number v-model="goodsDetail.amount" controls-position="right" :min="0"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8">
            <el-form-item label="商品库存" prop="count">
              <el-input-number v-model="goodsDetail.count" controls-position="right" :min="0" step-strictly></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="8">
            <el-form-item label="启用">
              <el-switch v-model="goodsDetail.isValid"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </section>
    <el-divider content-position="left">缩略图配置</el-divider>
    <section class="upload">
      <el-upload :action="uploadUrl" list-type="picture-card" :auto-upload="true" :show-file-list="true" :on-success="avatarSuccess" :file-list="goodsDetail.avatar">
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
      <el-upload :action="uploadUrl" list-type="picture-card" :auto-upload="true" :on-success="swiperSuccess" :file-list="goodsDetail.swipeImages">
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
    <el-divider content-position="left">商品详情</el-divider>
    <section>
      <QuillEditor v-model="goodsDetail.details" />
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
import { Goods, GoodsType, FilePath } from "@/types/goods";
import QuillEditor from "@/components/RichEditor.vue";
import getters from "@/store/getters";
import { ElMessage } from "element-plus";
import { createGoods, updateGoods } from "@/api/goods";
import useGoodsTypes from "@/composables/goods/useGoodsTypes";
import { getGoodsInfo } from "@/api/goods";
import { getFileName } from "@/utils/common";
export default {
  name: "GoodsDetail",
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
    const goodsDetail = reactive<Goods>(new Goods());
    const { goodsTypes, getGoodsTypes } = useGoodsTypes();
    const form = ref<any>("");
    const rules = {
      title: { required: true, message: "请输入" },
      description: { required: true, message: "请输入" },
      type: { required: true, message: "请选择" },
      amount: { required: true, message: "请输入" },
      count: { required: true, message: "请输入" },
    };
    // have id is edit
    if (id.value) {
      getGoodsInfo(id.value).then((res: Goods) => {
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
        Object.assign(goodsDetail, { ...res });
      });
    } else {
      Object.assign(goodsDetail, { ...new Goods() });
    }

    //images
    let dialogImageUrl = ref<string>("");
    let dialogVisible = ref<boolean>(false);
    const handleRemove = (file: any) => {
      goodsDetail.swipeImages = (
        goodsDetail.swipeImages as Array<FilePath>
      ).filter((item: FilePath) => {
        return item.uid !== file.uid;
      });
    };
    // 轮播
    const swiperSuccess = (response: any, file: any) => {
      (goodsDetail.swipeImages as Array<FilePath>).push({
        name: response.name,
        url: response.path,
        uid: file.uid,
      });
    };
    // 缩略图
    const avatarSuccess = (response: any, file: any) => {
      goodsDetail.avatar = [
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
          if (!goodsDetail.avatar[0] || !goodsDetail.swipeImages.length) {
            ElMessage.error("请选择图片");
            return;
          }
          const submitDto: Goods = new Goods();
          Object.assign(submitDto, goodsDetail);
          submitDto.avatar = (submitDto.avatar as Array<FilePath>)[0]
            .url as string;
          submitDto.swipeImages = (
            submitDto.swipeImages as Array<FilePath>
          ).map<string>((item: FilePath) => {
            return item.url;
          });
          const action: Function = submitDto.id ? updateGoods : createGoods;
          await action({ ...submitDto });
          emit("submit");
        }
      });
    };
    onMounted(() => {
      getGoodsTypes();
    });

    return {
      goodsDetail,
      rules,
      goodsTypes,
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