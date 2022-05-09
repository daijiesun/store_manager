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
      <div class="pannel-top">Store CMS</div>
      <div class="pannel-form">
        <el-form :model="form" ref="forms" :rules="rules" label-position="top">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入手机号或用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item class="mt-50">
            <el-button class="percent100" size="small" type="primary" @click="login" :loading="form.loading">登陆</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { reactive, ref } from "vue";
import { postLogin } from "@/api/user";
import { SSStorate } from "@/utils/storage";
import { useRouter } from "vue-router";
import md5 from "md5";
export default {
  name: "",
  setup() {
    const router = useRouter();
    const form = reactive({
      username: "",
      password: "",
      loading: false,
    });
    const rules = {
      username: { required: true, message: "请输入用户名" },
      password: { required: true, message: "请输入密码" },
    };
    const forms = ref(null);
    const login = () => {
      (forms.value as any).validate((val: boolean) => {
        if (val) {
          form.loading = true;
          postLogin({
            username: form.username,
            password: md5(form.password),
          })
            .then((res) => {
              if (res.token) {
                SSStorate.setItem("token", res.token);
                SSStorate.setItem("userInfo", {
                  username: res.username,
                  phoneNum: res.phoneNum,
                });
                router.push("/");
              }
            })
            .finally(() => {
              form.loading = false;
            });
        }
      });
    };
    return {
      form,
      rules,
      forms,
      login,
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
  width: 370px;
  height: 400px;
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
  animation: move 20s infinite linear;
  animation-fill-mode: forwards;
}

.wrap:nth-child(2) {
  animation: move 20s infinite linear;
  animation-delay: 6s;
}

.wall {
  width: 100%;
  height: 100%;
  position: absolute;
  background: url(../assets/img/galaxy.jpeg);
  background-size: cover;
  opacity: 0;
  animation: fade 20s infinite linear;
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