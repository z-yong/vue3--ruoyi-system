<template>
  <div class="upload-file">
    <el-upload :action="uploadFileUrl" :before-upload="handleBeforeUpload" :file-list="fileList"
      :limit="1" :on-error="handleUploadError" :on-exceed="handleExceed"
      :on-success="handleUploadSuccess" :show-file-list="false" :headers="headers"
      class="upload-file-uploader" ref="upload">
      <!-- 上传按钮 -->
      <el-button size="mini" type="primary">选取文件</el-button>
      <!-- 上传提示 -->
      <template v-if="showTip" v-slot:tip>
        <div class="el-upload__tip">
          请上传
          <template v-if="fileSize"> 大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b>
          </template>
          <template v-if="fileType"> 格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b>
          </template>
          的文件
        </div>
      </template>
    </el-upload>

    <!-- 文件列表 -->
    <transition-group class="upload-file-list el-upload-list el-upload-list--text"
      name="el-fade-in-linear" tag="ul">
      <li :key="file.uid" class="el-upload-list__item ele-upload-list__item-content"
        v-for="(file, index) in list">
        <el-link :href="file.url" :underline="false" target="_blank">
          <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
        </el-link>
        <div class="ele-upload-list__item-content-action">
          <el-link :underline="false" @click="handleDelete(index)" type="danger">删除</el-link>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script lang='ts'>
import { getToken } from '@/utils/auth'
import Message from '@/utils/message'
import { computed, defineComponent } from 'vue'
import baseUrl from '@/config/baseUrl'
export default defineComponent({
  props: {
    // 值
    value: [String, Object, Array],
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 5,
    },
    // 文件类型, 例如['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => ['doc', 'xls', 'ppt', 'txt', 'pdf'],
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, ctx) {
    const uploadFileUrl = baseUrl + 'common/upload'
    const headers = { Authorization: 'Bearer ' + getToken() }
    const fileSize = props.fileSize
    const fileType = props.fileType
    const showTip = computed(() => {
      return props.isShowTip && (fileType || fileSize)
    })

    const fileList = computed(() => {
      let temp = 1
      if (props.value) {
        // 首先将值转为数组
        const list = Array.isArray(props.value) ? props.value : [props.value]
        // 然后将数组转为对象数组
        return list.map((item: any) => {
          if (typeof item === 'string') {
            item = { name: item, url: item }
          }
          item.uid = item.uid || new Date().getTime() + temp++
          return item
        })
      } else {
        return []
      }
    })

    // 上传前校检格式和大小
    const handleBeforeUpload = (file: any) => {
      // 校检文件类型
      if (fileType) {
        let fileExtension = ''
        if (file.name.lastIndexOf('.') > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1)
        }
        const isTypeOk = fileType.some((type) => {
          if (file.type.indexOf(type) > -1) return true
          if (fileExtension && fileExtension.indexOf(type as string) > -1)
            return true
          return false
        })
        if (!isTypeOk) {
          ;(Message as any).error(
            `文件格式不正确, 请上传${fileType.join('/')}格式文件!`
          )
          return false
        }
      }
      // 校检文件大小
      if (fileSize) {
        const isLt = file.size / 1024 / 1024 < fileSize
        if (!isLt) {
          ;(Message as any).error(`上传文件大小不能超过 ${fileSize} MB!`)
          return false
        }
      }
      return true
    }
    // 文件个数超出
    const handleExceed = () => {
      ;(Message as any).error('只允许上传单个文件')
    }
    // 上传失败
    const handleUploadError = () => {
      ;(Message as any).error('上传失败, 请重试')
    }
    // 上传成功回调
    const handleUploadSuccess = ({ url }: any) => {
      ;(Message as any).success('上传成功')
      ctx.emit('input', url)
    }
    // 删除文件
    const handleDelete = (index: number) => {
      fileList.value.splice(index, 1)
      ctx.emit('input', '')
    }
    // 获取文件名称
    const getFileName = (name: string) => {
      if (name.lastIndexOf('/') > -1) {
        return name.slice(name.lastIndexOf('/') + 1).toLowerCase()
      } else {
        return ''
      }
    }

    return {
      uploadFileUrl,
      headers,
      fileSize,
      fileType,
      showTip,
      fileList,
      handleBeforeUpload,
      handleExceed,
      handleUploadError,
      handleUploadSuccess,
      handleDelete,
      getFileName,
    }
  },
})
</script>

<style scoped lang="scss">
.upload-file-uploader {
  margin-bottom: 5px;
}
.upload-file-list .el-upload-list__item {
  border: 1px solid #e4e7ed;
  line-height: 2;
  margin-bottom: 10px;
  position: relative;
}
.upload-file-list .ele-upload-list__item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
}
.ele-upload-list__item-content-action .el-link {
  margin-right: 10px;
}
</style>