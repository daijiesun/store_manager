<template>
  <div class="p14 bg-fff percent100">
    <el-divider content-position="left">全局配置</el-divider>
    <section>
      <el-form>
        <el-form-item label="跑马灯" label-width="80px">
          <el-input type="textarea" :rows="1" v-model="base.topTip"></el-input>
        </el-form-item>
      </el-form>
    </section>
    <el-divider content-position="left">收款码配置</el-divider>
    <section>
      <el-upload :action="uploadUrl" list-type="picture-card" :auto-upload="true" :show-file-list="true" :on-success="avatarSuccess" :file-list="base.payCodeUrl">
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
    <section class="bottom-action">
      <el-button type="primary" @click="submitEdit">提交</el-button>
    </section>
    <el-dialog title="预览" v-model="dialogVisible" append-to-body center width="450px">
      <img width="400" :src="imgUrl" alt style="" />
    </el-dialog>
  </div>
</template>
<script lang='ts'>
import { reactive, toRefs, ref, onMounted } from "vue";
import getters from "@/store/getters";
import { BaseConfig } from "@/types/config";
import { saveBaseConfig, getBaseConfig } from "@/api/base";
import { ElMessage } from "element-plus";
import { getFileName } from "@/utils/common";
export default {
  name: "",
  computed: {
    uploadUrl() {
      return `${getters.apiUrl()}/upload/action`;
    },
  },
  setup() {
    const base = reactive<BaseConfig>({
      topTip: "",
      payCodeUrl: [],
    });
    const getConfigData = async () => {
      const res = await getBaseConfig();
      if (res) {
        base.topTip = res.topTip;
        base.payCodeUrl = [
          {
            name: getFileName(res.payCodeUrl as string),
            url: res.payCodeUrl,
            uid: Date.now(),
          },
        ];
      }
    };
    onMounted(() => {
      getConfigData();
    });
    const dialogVisible = ref(false);
    const imgUrl = ref<string>("");
    const handlePictureCardPreview = (file: any) => {
      imgUrl.value = file.url;
      dialogVisible.value = true;
    };

    const avatarSuccess = (response: any, file: any) => {
      base.payCodeUrl = [
        {
          name: response.name,
          url: response.path,
          uid: file.uid,
        },
      ];
    };

    const submitEdit = async () => {
      const params: BaseConfig = {
        topTip: base.topTip,
        payCodeUrl: base.payCodeUrl[0].url,
      };
      const res = await saveBaseConfig(params);
      if (res) {
        ElMessage.success("提交成功");
      }
    };

    return {
      base,
      dialogVisible,
      imgUrl,
      avatarSuccess,
      handlePictureCardPreview,
      submitEdit,
    };
  },
};
</script>
<style lang='less' scoped>
.bottom-action {
  text-align: right;
  position: sticky;
  bottom: 0;
  line-height: 40px;
  background-color: #fff;
}
</style>