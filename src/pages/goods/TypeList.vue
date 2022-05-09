<template>
  <div class="">
    <el-form class="search_top">
      <el-row>
        <el-col :span="6">
          <el-form-item label="类型名称">
            <el-input v-model="typeName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="13">
          <el-button @click="search" type="primary">搜索</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="table_action">
      <el-button type="primary" @click="showDialog(true)">新增</el-button>
    </el-row>
    <el-table class="search_table" :data="tableList" height="calc(100vh - 290px)" width="100%">
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="title" label="类型名称"></el-table-column>
      <el-table-column prop="createDate" label="创建日期"></el-table-column>
      <el-table-column prop label="操作" width="180">
        <template #default="scope">
          <div>
            <el-button @click="editType(scope.row)" type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click="delType(scope.row.id)" type="danger" icon="el-icon-delete" circle></el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="submitDto.id ? '编辑商品类型':'新增商品类型'" v-model="dialogVisible" width="500px">
      <el-form>
        <el-form-item label="类型名称" :rules="{required: true}">
          <el-input v-model.trim="submitDto.title"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { onMounted, reactive, ref } from "vue";
import {
  deleteGoodsType,
  editGoodsType,
  getGoodsTypeList,
} from "../../api/goods";
import { GoodsType } from "../../types/goods";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  name: "GoodsType",
  setup() {
    const typeName = ref<string>("");
    const typeList = ref<GoodsType[]>([]);
    const tableList = ref<GoodsType[]>([]);
    const submitDto = reactive<GoodsType>(new GoodsType());
    const dialogVisible = ref<boolean>(false);
    const featchData = async () => {
      typeList.value = await getGoodsTypeList();
      search();
    };
    const search = () => {
      tableList.value = typeList.value.filter((item: GoodsType) => {
        return item.title.includes(typeName.value);
      });
    };
    const editType = (row: GoodsType) => {
      Object.assign(submitDto, row);
      showDialog(false);
    };

    const delType = (id: string) => {
      ElMessageBox.confirm("此操作将永久删除该类型, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await deleteGoodsType(id);
        if (res) {
          ElMessage.success("删除成功");
          featchData();
        }
      });
    };
    const showDialog = (isAdd: boolean) => {
      if (isAdd) {
        submitDto.title = "";
        submitDto.id = "";
      }
      dialogVisible.value = true;
    };
    const submit = async () => {
      if (!submitDto.title) {
        ElMessage.error("请输入类型名称");
        return;
      }
      const res = await editGoodsType(submitDto);
      if (res) {
        ElMessage.success("提交成功");
        featchData();
        dialogVisible.value = false;
      }
    };
    onMounted(async () => {
      featchData()
    });

    return {
      typeName,
      tableList,
      dialogVisible,
      submitDto,
      search,
      editType,
      delType,
      showDialog,
      submit
    };
  },
};
</script>
<style lang='less' scoped>
</style>