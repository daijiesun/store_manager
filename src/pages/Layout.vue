<template>
  <el-container>
    <el-header>
      <div style="cursor: pointer" @click="goHome">
        <h3>Live Manager</h3>
      </div>
      <el-dropdown size="large">
        <span class="el-dropdown-link">
          欢迎，{{ user.username }}
          <i class="el-icon-arrow-down el-icon--right"></i>
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
        <el-menu :default-openeds="[0]" :router="true" :unique-opened="true">
          <el-sub-menu v-for="(m,key) in muens" :index="key" :key="key">
            <template #title> <i class="el-icon-message"></i>{{m.title}} </template>
            <el-menu-item v-for="s in m.subMuens" :index="s.url" :key="s.url">{{s.title}}</el-menu-item>
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

<script lang="ts">
import { reactive, toRefs } from "vue";
import { postLogout } from "@/api/user";
import { SSStorate } from "@/utils/storage";
import { useRouter } from "vue-router";
export default {
  name: "",
  setup() {
    const muens = reactive([
      {
        title: "用户管理",
        icon: "el-icon-message",
        subMuens: [
          {
            title: "用户列表",
            url: "/user/list",
          },
          // {
          //   title: "角色",
          //   url: "/user/roles",
          // },
        ],
      },
      {
        title: "内容管理",
        icon: "el-icon-avatar",
        subMuens: [
          {
            title: "文章列表",
            url: "/article/list",
          },
          {
            title: "分类管理",
            url: "/article/types",
          },
        ],
      },
      {
        title: "配置管理",
        icon: "el-icon-coin",
        subMuens: [
          {
            title: "基础配置",
            url: "/config",
          }
        ],
      },
    ]);
    const userInfo = SSStorate.getItem("userInfo") || {};
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
    const goHome = () => {
      router.push("/");
    };
    return {
      user,
      logout,
      goHome,
      muens
    };
  },
};
</script>
<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  // background-color: var(--el-color-primary);
  line-height: 60px;
  // color: var(--el-color-primary);
  display: flex;
  justify-content: space-between;
  align-items: center;

  :deep(.el-dropdown) {
    font-size: 16px;
    // color: var(--el-color-primary);
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
