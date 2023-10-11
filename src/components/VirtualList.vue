<template>
  <div class="virtual-list">
    <div
      class="item"
      v-for="(item, index) in visibleItems"
      :key="index"
      :style="{ top: item.top + 'px', height: item.height + 'px' }"
    >
      {{ item.text }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref,onMounted,watch} from 'vue'
const items = ref<Array<any>>([])
const visibleItems = ref<Array<any>>([])
const containerHeight = ref<Number>(0)
const itemHeight = ref<Number>(0)

onMounted(()=>{
  
})
  mounted() {
    // 在组件挂载后计算列表高度
    this.containerHeight = this.$el.offsetHeight;

    // 加载列表数据
    for (let i = 0; i < 1000; i++) {
      this.items.push({
        text: `Item ${i}`,
        height: this.itemHeight
      });
    }

    // 初始化可见列表项
    this.updateVisibleItems();
  },
  methods: {
    updateVisibleItems() {
      // 获取滚动条位置
      let scrollTop = this.$el.scrollTop;

      // 计算可见列表项的索引范围
      let startIndex = Math.floor(scrollTop / this.itemHeight);
      let endIndex = startIndex + Math.ceil(this.containerHeight / this.itemHeight);

      // 限制索引范围
      startIndex = Math.max(0, startIndex);
      endIndex = Math.min(this.items.length - 1, endIndex);

      // 更新可见列表项
      this.visibleItems = this.items
        .slice(startIndex, endIndex + 1)
        .map((item, index) => {
          return {
            ...item,
            top: (startIndex + index) * this.itemHeight
          };
        });
    }
  },
  watch: {
    // 当列表滚动时，更新可见列表项
    "$el.scrollTop": "updateVisibleItems"
  }
</script>

<style>
.virtual-list {
  overflow-y: scroll;
  height: 500px;
  position: relative;
}

.item {
  position: absolute;
  left: 0;
  right: 0
}
</style>