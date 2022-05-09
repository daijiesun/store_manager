<template>
  <div class>
    <el-upload style="display: none;" :action="uploadUrl" :before-upload="beforeUpload" :on-success="onSuccess">
      <el-button size="small" type="primary" id="quill-upload">点击上传</el-button>
    </el-upload>
    <QuillEditor v-model:content="editorContent" ref="quill" content-type="html" :options="editorOption" @textChange="textChange"></QuillEditor>
  </div>
</template>

<script lang='ts'>
import { onMounted, reactive, ref, toRefs, watchEffect, nextTick } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { debounce } from "@/utils/performance";
import getters from "@/store/getters";
const toolBar = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ["bold", "italic", "underline", "strike", "image"], // toggled buttons
  ["blockquote", "code-block"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ direction: "rtl" }], // text direction
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
  ["clean"],
];
const editorOption = reactive({
  modules: {
    toolbar: {
      container: toolBar,
      handlers: {
        image: function (value: any) {
          if (value) {
            // 调用iview图片上传
            (document as any).querySelector("#quill-upload").click();
          } else {
            // quill.format('image', false);
          }
        },
      },
    },
  },
  placeholder: "请输入商品详情",
  theme: "snow",
});
export default {
  name: "",
  components: {
    QuillEditor,
  },
  props: ["modelValue"],
  emits: ["update:modelValue"],
  data() {
    return {
      editorOption: editorOption,
      uploadUrl: `${getters.apiUrl()}/upload/action/`,
    };
  },
  setup(props: any, context: any) {
    const quill = ref<any>("");
    const { modelValue } = toRefs(props);
    const editorContent = ref<string>("");

    onMounted(async () => {
      setTimeout(() => {
        if (props.modelValue) {
          quill.value.setHTML(props.modelValue);
        }
      }, 1000);
    });
    const textChange = () => {
      debounce(() => {
        context.emit("update:modelValue", editorContent.value);
      });
    };
    return {
      quill,
      editorContent,
      textChange,
    };
  },
  methods: {
    onSuccess(res: any, file: any) {
      // 如果上传成功
      if (res) {
        const quill = this.quill.getQuill();
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片，res为服务器返回的图片链接地址
        quill.insertEmbed(length, "image", res.path);
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        console.log("图片插入失败");
      }
    },
    beforeUpload(file: any) {
      return true;
    },
    getContent() {
      const quill = (this as any).$refs.quill.getQuill();
      return quill.getHtml();
    },
  },
};
</script>
<style lang='less' scoped>
:deep(.ql-container) {
  min-height: 200px;
}
</style>