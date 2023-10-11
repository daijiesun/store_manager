<template>
  <el-form class="search_top form_row">
    <el-row>
      <el-col :span="5">
        <el-form-item label="用户名">
          <el-input v-model="searchData.params.username"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="5" :offset="1">
        <el-form-item label="手机号">
          <el-input v-model="searchData.params.phoneNum"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="5" :offset="1">
        <el-form-item label="状态">
          <el-select v-model="searchData.params.isActive" clearable>
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
    <el-button type="primary" @click="addUser()">新增</el-button>
    <el-button type="danger" @click="batchDel">批量删除</el-button>
  </el-row>
  <el-table class="search_table" :data="searchResult.data" @selection-change="handleSelectionChange" height="calc(100vh - 350px)" width="100%">
    <el-table-column type="index" width="30"> </el-table-column>
    <el-table-column type="selection" width="55"> </el-table-column>
    <el-table-column prop="username" label="用户名"></el-table-column>
    <el-table-column prop="role" label="角色">
      <template #default="scope">
        {{getRoleName(scope.row.role)}}
      </template>
    </el-table-column>
    <el-table-column prop="phoneNum" label="手机号">
    </el-table-column>
    <el-table-column label="状态">
      <template #default="scope">
        {{scope.row.isActive == 1 ? '启用': '禁用'}}
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
          <el-button @click="editUser(scope.row)" type="primary" icon="el-icon-edit" circle></el-button>
          <el-button @click="delUser(scope.row.id)" type="danger" icon="el-icon-delete" circle></el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination class="search_page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchData.page" :page-sizes="searchData.sizes" :page-size="searchData.pageSize" layout="total,jumper, sizes, prev, pager, next" :total="searchResult.total"></el-pagination>

  <!-- 新增/编辑 -->
  <el-dialog :title="isAdd ? '新增用户' : '编辑用户'" v-model="dialogVisible" width="600px" @close="resetForm">
    <el-form :model="userForm" :rules="userFormRules" ref="userFormRef" label-width="100px" label-position="left">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="userForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phoneNum">
        <el-input v-model="userForm.phoneNum" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" v-if="isAdd">
        <el-input type="password" v-model="userForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword" v-if="isAdd">
        <el-input type="password" v-model="userForm.checkPassword" placeholder="请再次输入密码"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="imageCode">
        <div class="image-code">
          <el-input maxlength="4" type="password" v-model="userForm.imageCode" placeholder="请输入验证码"></el-input>
          <ImageCode />
        </div>
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="userForm.role" placeholder="请选择角色">
          <el-option v-for="role in roles" :key="role.code" :label="role.name" :value="role.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否有效" prop="isActive">
        <el-switch v-model="userForm.isActive" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="resetForm">关闭</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang='ts'>
import { onMounted, reactive, ref, nextTick } from "vue";
import { Dict, PageRequest, PageResponse } from "@/types/common";
import { ElMessage, ElMessageBox } from "element-plus";
import { isValids } from "@/store/module/common";
import { User } from "@/types/user";
import {
  userList,
  deleteUser,
  batchDeleteUser,
  creatUser,
  roleList,
  updateUser,
} from "@/api/user";
import ImageCode from "@/components/ImageCode.vue";
import md5 from "md5";
class SearchModel {
  username: string = "";
  phoneNum: string = "";
  isActive: string = "";
}
export default {
  name: "UserList",
  components: {
    ImageCode,
  },
  setup() {
    // TODO:查询逻辑
    const searchData = reactive<PageRequest<SearchModel>>(
      new PageRequest<SearchModel>(new SearchModel())
    );
    const searchResult = reactive<PageResponse<User[]>>(
      new PageResponse<User[]>([])
    );

    const search = async () => {
      const res = await userList(searchData);
      Object.assign(searchResult, res);
    };
    const handleSizeChange = (size: number) => {
      searchData.pageSize = size;
      search();
    };
    const handleCurrentChange = (page: number) => {
      searchData.page = page;
      search();
    };
    search();

    // TODO:删除
    const delUser = (id: string) => {
      ElMessageBox.confirm("此操作将删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await deleteUser(id);
        if (res) {
          ElMessage.success("删除成功");
          search();
        }
      });
    };
    const multipleSelection = ref<User[]>([]);
    const handleSelectionChange = (val: User[]) => {
      multipleSelection.value = val;
    };
    const batchDel = async () => {
      if (!multipleSelection.value.length) {
        return ElMessage.error("请选择需要删除的项");
      } else if (multipleSelection.value.length > 5) {
        return ElMessage.error("最多选择五个");
      }
      await ElMessageBox.confirm("此操作将删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });
      const ids = multipleSelection.value.map((item: User) => {
        return item.id;
      });
      const res = await batchDeleteUser(ids.join(","));
      if (res) {
        ElMessage.success("批量删除成功");
        search();
      }
    };
    // TODO:新增用户/编辑
    const isAdd = ref(true);
    const userFormRef = ref();
    const dialogVisible = ref(false);
    const userForm = reactive({
      username: "",
      phoneNum: "",
      role: "",
      isActive: true,
      password: "",
      checkPassword: "",
      imageCode: "",
    });
    const addUser = () => {
      isAdd.value = true;
      Object.assign(userForm, {
        username: "",
        phoneNum: "",
        role: "",
        isActive: true,
        password: "",
        checkPassword: "",
        imageCode: "",
      });
      dialogVisible.value = true;
    };
    const editUser = (user: User) => {
      isAdd.value = false;
      Object.assign(userForm, user);
      dialogVisible.value = true;
    };
    const userFormRules = {
      username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
      password: { required: true, message: "请输入密码" },
      checkPassword: { required: true, message: "请再次输入密码" },
      imageCode: { required: true, message: "请输入验证码" },
      phoneNum: [
        { required: false, message: "请输入手机号", trigger: "blur" },
        {
          pattern: /^1[3456789]\d{9}$/,
          message: "手机号格式不正确",
          trigger: "blur",
        },
      ],
      role: [{ required: true, message: "请选择角色", trigger: "change" }],
    };
    const resetForm = () => {
      userFormRef.value.resetFields();
      dialogVisible.value = false;
    };
    const submitForm = () => {
      userFormRef.value.validate(async (valid: boolean) => {
        if (valid) {
          const params = { ...userForm };
          const fetch = isAdd.value ? creatUser : updateUser;
          if (isAdd.value) {
            if (userForm.password !== userForm.checkPassword) {
              return ElMessage.error("两次密码不一致");
            }
            params.password = md5(userForm.password);
          }

          await fetch(params).then((res) => {
            console.log(res);
          });
          dialogVisible.value = false;
          ElMessage.success("操作成功");
          handleCurrentChange(1);
        }
      });
    };

    // TODO:角色列表
    const roles = ref<Array<Dict>>([]);
    roleList().then((data) => {
      roles.value = data;
    });
    const getRoleName = (code: string)=>{
      const r = roles.value.find(r=>r.code === code)
      return r && r.name
    }
    return {
      searchData,
      searchResult,
      multipleSelection,
      isValids,
      search,
      delUser,
      batchDel,
      handleSizeChange,
      handleCurrentChange,
      handleSelectionChange,
      addUser,
      editUser,
      isAdd,
      dialogVisible,
      userForm,
      userFormRules,
      userFormRef,
      roles,
      resetForm,
      submitForm,
      getRoleName
    };
  },
};
</script>
<style lang='scss' scoped>
:deep() .image-code {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  svg {
    height: 40px;
    width: 150px;
    cursor: pointer;
  }
  .el-input {
    flex-shrink: 0;
    width: 300px;
  }
}
</style>