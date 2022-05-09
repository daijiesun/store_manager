<!--  -->
<template>
  <el-container>
    <el-header>
      <div>Store Manager</div>
      <el-dropdown size="small">
        <span class="el-dropdown-link">
          {{user.username}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">
              <i class="el-icon-switch-button"></i>退出
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu :default-openeds="['1']" :router="true" :unique-opened="true">
          <el-sub-menu index="1">
            <template #title>
              <i class="el-icon-message"></i>商品管理
            </template>
            <el-menu-item index="/goods/list">商品列表</el-menu-item>
            <el-menu-item index="/goods/typeList">商品类型列表</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <i class="el-icon-coin"></i>配置管理
            </template>
            <el-menu-item index="/config/base">基础配置</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
        <el-footer>Copyright &copy; 2021</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script lang='ts'>
import { reactive, toRefs } from "vue";
import { postLogout } from "@/api/user";
import { SSStorate } from "@/utils/storage";
import { useRouter } from "vue-router";
export default {
  name: "",
  setup() {
    const userInfo = SSStorate.getItem("userInfo");
    const user = reactive({
      phoneNum: userInfo.phoneNum,
      username: userInfo.username,
    });
    const router = useRouter();
    const logout = async () => {
      postLogout();
      SSStorate.clear();
      router.push("/login");
    };
    return {
      user,
      logout,
    };
  },
};
</script>
<style lang='less' scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: var(--el-color-primary);
  line-height: 60px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;

  :deep(.el-dropdown) {
    font-size: 16px;
    color: #fff;
    font-weight: 600;
    cursor: pointer;
  }
}

.el-footer {
  color: var(--el-text-color-primary);
  text-align: center;
}

.el-aside {
  color: var(--el-text-color-primary);
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: var(--el-text-color-primary);
  box-sizing: border-box;
  padding: 14px;
  height: calc(100vh - 128px);
  & > div {
    background-color: #fff;
    height: 100%;
    box-sizing: inherit;
    overflow: auto;
  }
}
.el-footer {
  height: 45px;
  line-height: 45px;
  font-size: 14px;
}
</style>