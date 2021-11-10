<template>
  <div class="component-upload-image">
    <el-upload :action="uploadImgUrl" list-type="picture-card" :on-success="handleUploadSuccess"
      :before-upload="handleBeforeUpload" :on-error="handleUploadError" name="file"
      :show-file-list="false" :headers="headers" style="display: inline-block; vertical-align: top">
      <el-image v-if="!value" :src="value">
        <template v-slot:error>
          <div class="image-slot">
            <i class="el-icon-plus" />
          </div>
        </template>
      </el-image>
      <div v-else class="image">
        <el-image :src="value" :style="`width:150px;height:150px;`" fit="fill" />
        <div class="mask">
          <div class="actions">
            <span title="预览" @click.stop="dialogVisible = true">
              <i class="el-icon-zoom-in" />
            </span>
            <span title="移除" @click.stop="removeImage">
              <i class="el-icon-delete" />
            </span>
          </div>
        </div>
      </div>
    </el-upload>
    <el-dialog v-model="dialogVisible" title="预览" width="800" append-to-body>
      <img :src="value" style="display: block; max-width: 100%; margin: 0 auto;">
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { getToken } from '@/utils/auth'
import { ElLoading } from 'element-plus'
import Message from '@/utils/message'
import { defineComponent, ref } from 'vue'
import baseUrl from '@/config/baseUrl'

export default defineComponent({
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  setup(props, ctx) {
    const dialogVisible = ref(false)
    const uploadImgUrl = baseUrl + '/common/upload'
    const headers = {
      Authorization: 'Bearer ' + getToken(),
    }

    let loading

    const removeImage = () => {
      ctx.emit('input', '')
    }
    const handleUploadSuccess = (res) => {
      ctx.emit('input', res.url)
      loading.close()
    }

    const handleBeforeUpload = () => {
      loading = ElLoading.service({
        lock: true,
        text: '上传中',
        background: 'rgba(0, 0, 0, 0.7)',
      })
    }
    const handleUploadError = () => {
      Message({
        type: 'error',
        message: '上传失败',
      })
      loading.close()
    }

    return {
      value: props.value,
      dialogVisible,
      uploadImgUrl,
      headers,
      removeImage,
      handleUploadSuccess,
      handleBeforeUpload,
      handleUploadError,
    }
  },
})
</script>

<style scoped lang="scss">
.image {
  position: relative;
  .mask {
    opacity: 0;
    position: absolute;
    top: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    transition: all 0.3s;
  }
  &:hover .mask {
    opacity: 1;
  }
}
</style>