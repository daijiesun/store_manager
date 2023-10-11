<template>
  <section style="height: 40px" id="imageCode" @click="getCode"></section>
</template>

<script setup>
import { onMounted } from "vue";
import { getImageCode } from "@/api/user";
const getCode = () => {
  getImageCode().then((res) => {
    console.log(res);
    const ele = document.querySelector("#imageCode");
    if (ele) {
      ele.innerHTML = res;
    }
  });
};
onMounted(() => {
  getCode();
});
</script>
<style lang='scss' scoped>
</style>