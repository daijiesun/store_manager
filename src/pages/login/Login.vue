<!--  -->
<template>
  <div class="login">
    <div class="animation">
      <div class="scene">
        <div class="wrap">
          <div class="wall wall-right"></div>
          <div class="wall wall-left"></div>
          <div class="wall wall-top"></div>
          <div class="wall wall-bottom"></div>
          <div class="wall wall-back"></div>
        </div>
        <div class="wrap">
          <div class="wall wall-right"></div>
          <div class="wall wall-left"></div>
          <div class="wall wall-top"></div>
          <div class="wall wall-bottom"></div>
          <div class="wall wall-back"></div>
        </div>
      </div>
    </div>
    <div class="login-pannel">
      <div class="pannel-top">Apollo CMS</div>
      <div class="pannel-form">
        <el-form :model="form" ref="forms" :rules="rules" label-position="top">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入手机号或用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPassword" v-if="showRegister">
            <el-input type="password" v-model="form.checkPassword" placeholder="请再次输入密码"></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="imageCode">
            <div class="image-code">
              <el-input maxlength="4" type="password" v-model="form.imageCode" placeholder="请输入验证码"></el-input>
              <ImageCode />
            </div>
          </el-form-item>
          <el-form-item class="mt-50">
            <div class="footer">
              <el-button class="percent100" type="primary" @click="login" :loading="form.loading">{{showRegister ? '注 册':'登 录'}}</el-button>
              <el-button type="text" v-if="!showRegister" class="mt-20" @click="showRegister = true">没有账号？</el-button>
              <el-button type="text" v-else class="mt-20" @click="showRegister = false">已有账号</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { onMounted, reactive, ref } from "vue";
import { postLogin, postRegister } from "@/api/user";
import { SSStorate } from "@/utils/storage";
import { useRouter } from "vue-router";
import md5 from "md5";
import { ElMessage } from "element-plus/es";
import ImageCode from "@/components/ImageCode.vue";
export default {
  name: "",
  components: { ImageCode },
  setup() {
    const router = useRouter();
    const form = reactive({
      username: "",
      password: "",
      checkPassword: "",
      imageCode: "",
      loading: false,
    });
    const rules = {
      username: { required: true, message: "请输入用户名" },
      password: { required: true, message: "请输入密码" },
      checkPassword: { required: true, message: "请再次输入密码" },
      imageCode: { required: true, message: "请输入验证码" },
    };
    const forms = ref(null);
    const login = () => {
      (forms.value as any).validate((val: boolean) => {
        if (val) {
          form.loading = true;
          if (showRegister.value && form.password !== form.checkPassword) {
            form.loading = false;
            return ElMessage.error("两次密码不一致");
          }
          const fetch = showRegister.value ? postRegister : postLogin;
          fetch({
            username: form.username,
            password: md5(form.password),
            imageCode: form.imageCode,
          }).then((res) => {
              if (res.token) {
                SSStorate.setItem("token", res.token);
                SSStorate.setItem("userInfo", {
                  username: res.username,
                  phoneNum: res.phoneNum,
                });
                router.push("/");
              }
            }).finally(() => {
              form.loading = false;
            });
        }
      });
    };
    const showRegister = ref<Boolean>(false);
    const closeRegister = () => {
      showRegister.value = false;
    };
    const clickRegister = () => {
      showRegister.value = true;
    };

    return {
      form,
      rules,
      forms,
      showRegister,
      login,
      closeRegister,
      clickRegister,
    };
  },
};
</script>
<style lang='less' scoped>
.login {
  height: 100%;
  width: 100%;
  position: relative;
  background-color: #000;
}
.login-pannel {
  width: 470px;
  min-height: 400px;
  background-color: #fff;
  position: absolute;
  right: 20%;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 10px;
  opacity: 0.9;
}
.pannel-top {
  height: 64px;
  line-height: 64px;
  font-size: 30px;
  font-weight: 600;
  text-align: center;
  text-shadow: 5px 5px 5px var(--el-color-primary);
}
.pannel-form {
  padding: 20px 30px;
}
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
    width: 200px;
  }
}
.footer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
<style lang="less" scoped>
.animation {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  text-align: center;
}
.animation::before {
  content: "";
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}
.scene {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  perspective: 15px;
  perspective-origin: 50% 50%;
}

.wrap {
  position: absolute;
  width: 1000px;
  height: 1000px;
  left: -500px;
  top: -500px;
  transform-style: preserve-3d;
  animation: move 30s infinite linear;
  animation-fill-mode: forwards;
}

.wrap:nth-child(2) {
  animation: move 30s infinite linear;
  animation-delay: 6s;
}

.wall {
  width: 100%;
  height: 100%;
  position: absolute;
  background: url(../../assets/img/galaxy.jpeg);
  background-size: cover;
  opacity: 0;
  animation: fade 30s infinite linear;
}

.wrap:nth-child(2) .wall {
  animation-delay: 6s;
}

.wall-right {
  transform: rotateY(90deg) translateZ(500px);
}

.wall-left {
  transform: rotateY(-90deg) translateZ(500px);
}

.wall-top {
  transform: rotateX(90deg) translateZ(500px);
}

.wall-bottom {
  transform: rotateX(-90deg) translateZ(500px);
}

.wall-back {
  transform: rotateX(180deg) translateZ(500px);
}

@keyframes fade {
  0% {
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@keyframes move {
  0% {
    transform: translateZ(-500px) rotate(0deg);
  }
  100% {
    transform: translateZ(500px) rotate(0deg);
  }
}
</style>