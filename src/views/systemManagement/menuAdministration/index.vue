<template>
  <div class="df fdc">
    <el-form :inline="true" class="top-search" label-width="90px">
      <el-form-item label="名称">
        <el-input v-model="queryParams.menuName" placeholder="名称" clearable size="small"
          @keyup.enter="getList" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.status" placeholder="状态" clearable size="small">
          <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="getList">查询
        </el-button>
        <el-button v-hasPermi="['menuAdministration:add']" type="primary" plain icon="el-icon-plus"
          size="small" @click="handleAdd">添加
        </el-button>
      </el-form-item>
    </el-form>
    <div class="f1">
      <el-table border stripe v-loading="loading" height="100%" :data="menuList" row-key="menuId"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
        <el-table-column prop="menuName" label="名称" class-name="title-left"
          :show-overflow-tooltip="true" min-width="160">
          <template v-slot="scope">
            <svg-icon v-if="scope.row.icon" :icon-class="scope.row.icon" />
            <span style="margin-left:5px;">{{ scope.row.menuName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="menuType" align="center" label="类型" min-width="80">
          <template v-slot="scope">
            <span>{{ nameType[scope.row.menuType] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" align="center" label="排序" min-width="80"></el-table-column>
        <el-table-column prop="perms" label="权限标识" align="center" min-width="120"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="component" label="组件路径" align="center" min-width="150"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" min-width="80"
          :formatter="statusFormat" width="80"></el-table-column>
        <el-table-column label="创建时间" align="center" min-width="150" prop="createTime">
          <template v-slot="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center"
          class-name="small-padding fixed-width">
          <template v-slot="scope">
            <div>
              <el-button v-hasPermi="['menuAdministration:edit']" size="small" type="text"
                @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button v-hasPermi="['menuAdministration:add']" v-if="scope.row.menuType !== 'F'"
                size="small" type="text" @click="handleAdd(scope.row)">添加</el-button>
              <el-button v-hasPermi="['menuAdministration:delete']" size="small" type="text"
                @click="handleDelete(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加或修改菜单对话框 -->
    <div v-dialogDrag:openDialog v-dialogDragSize:openDialog>
      <el-dialog :title="title" v-model="open" width="1000px" custom-class="openDialog"
        :lock-scroll="false" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="formRef" :model="formParams" :rules="rules" label-width="90px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="上级">
                <!-- <treeselect v-model="formParams.parentId" :options="menuOptions"
                  :default-expand-level="0" :searchable="false" :normalizer="normalizer" show-count
                  placeholder="选择上级" /> -->
                <el-cascader v-model="formParams.parentId" :options="[menuOptions]"
                  :props="{ checkStrictly: true }" clearable style="width: 80%" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="类型" prop="menuType">
                <el-radio-group v-model="formParams.menuType">
                  <el-radio label="M">目录</el-radio>
                  <el-radio label="C">菜单</el-radio>
                  <el-radio label="F">按钮</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item v-if="formParams.menuType != 'F' && (
                (typeof formParams.parentId === 'string' && formParams.parentId === '0') || 
                (formParams.parentId.length && formParams.parentId[formParams.parentId.length - 1] === '0')
              )" label="图标">
                <el-popover v-model:visible="popoverVisible" placement="bottom-start" width="460"
                  trigger="click" @show="iconSelectShow">
                  <IconSelect ref="iconSelect" @selected="selected" />
                  <template #reference>
                    <el-input v-model="formParams.icon" placeholder="点击选择图标" readonly>
                      <template v-if="formParams.icon" #prefix>
                        <svg-icon :icon-class="formParams.icon" class="el-input__icon"
                          style="height: 36px; width: 16px" />
                      </template>
                      <template v-else #prefix>
                        <i class="el-icon-search el-input__icon" />
                      </template>
                    </el-input>
                  </template>
                </el-popover>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="nameType[formParams.menuType] + '名称'" prop="menuName">
                <el-input v-model="formParams.menuName" placeholder="请输入名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="显示排序" prop="orderNum">
                <el-input-number v-model="formParams.orderNum" controls-position="right" :min="0" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item v-if="formParams.menuType != 'F'" label="路由地址" prop="path">
                <el-input v-model="formParams.path" placeholder="请输入路由地址" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="formParams.menuType != 'F'" label="是否外链">
                <el-radio-group v-model="formParams.isFrame">
                  <el-radio label="0">是</el-radio>
                  <el-radio label="1">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="formParams.menuType != 'M'" label="权限标识">
                <el-input v-model="formParams.perms" placeholder="请权限标识" maxlength="50" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="formParams.menuType != 'F'" label="显示状态">
                <el-radio-group v-model="formParams.visible">
                  <el-radio v-for="dict in visibleOptions" :key="dict.dictValue"
                    :label="dict.dictValue">{{ dict.dictLabel }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="formParams.menuType != 'F'" label="状态">
                <el-radio-group v-model="formParams.status">
                  <el-radio v-for="dict in statusOptions" :key="dict.dictValue"
                    :label="dict.dictValue">{{ dict.dictLabel }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="formParams.menuType === 'C'" label="是否缓存">
                <el-radio-group v-model="formParams.isCache">
                  <el-radio label="0">缓存</el-radio>
                  <el-radio label="1">不缓存</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template #footer>
          <el-button size="small" @click="cancel">取 消</el-button>
          <el-button :loading="btnLoading" size="small" type="primary" @click="submitForm">确 定
          </el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  nextTick,
  onActivated,
  onMounted,
  reactive,
  ref,
} from 'vue'

export default defineComponent({
  name: 'menuAdministration',
})
</script>

<script lang="ts" setup>
import {
  listMenu,
  getMenu,
  delMenu,
  addMenu,
  updateMenu,
} from '@/api/system/menu'
import IconSelect from '@/components/IconSelect/index.vue'
import Message from '@/utils/message'
import { ElMessageBox } from 'element-plus'
import { handleTree, selectDictLabel } from '@/utils/ruoyi'
import { parseTime } from '@/utils/ruoyi'

const visibleOptions = [
  {
    dictLabel: '显示',
    dictValue: '0',
  },
  {
    dictLabel: '隐藏',
    dictValue: '1',
  },
]
const statusOptions = [
  {
    dictLabel: '正常',
    dictValue: '0',
  },
  {
    dictLabel: '停用',
    dictValue: '1',
  },
]
const rules = {
  menuName: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  orderNum: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
  path: [{ required: true, message: '路由地址不能为空', trigger: 'blur' }],
}
const nameType = {
  M: '目录',
  C: '菜单',
  F: '按钮',
}

const queryParams = reactive({
  menuName: '',
  status: '',
})
const formRef = ref()
const formParams = reactive({
  menuId: '',
  parentId: '0',
  menuName: '',
  path: '',
  icon: '',
  menuType: 'M',
  orderNum: 0,
  isFrame: '1',
  isCache: '0',
  visible: '0',
  status: '0',
})

const loading = ref(false)
const menuList: any = ref([])
type menuOptionsType = {
  value: string
  label: string
  children: any
  disabled?: boolean
}
const menuOptions = reactive<menuOptionsType>({
  value: '0',
  label: '主类目',
  children: [],
})
// 获取菜单列表及菜单下拉树
const getList = () => {
  loading.value = true
  menuOptions.children = []
  listMenu(queryParams)
    .then((response) => {
      menuList.value = handleTree(response.data, 'menuId')
      const children = JSON.parse(JSON.stringify(menuList.value))
      setDisabled(children)
      menuOptions.children = children
    })
    .finally(() => (loading.value = false))
}

onMounted(() => {
  getList()
})

// 转换菜单数据结构
const normalizer = (node) => {
  if (node.children && !node.children.length) {
    delete node.children
  }
  return {
    id: node.menuId,
    label: node.menuName,
    children: node.children || [],
  }
}
// 查询菜单下拉树结构
// const getTreeselect = () => {
//   menuOptions.children = []
//   listMenu().then((response) => {
//     const children = handleTree(response.data, 'menuId') as any
//     setDisabled(children)
//     menuOptions.children = children
//     console.log(menuOptions)
//   })
// }
// getTreeselect()
// 当节点为按钮时 则禁止选择
const setDisabled = (data) => {
  data.forEach((item, index) => {
    {
      const newItem = {
        disabled: false,
        value: '',
        label: '',
        children: [],
      }
      if (item.menuType === 'F') {
        newItem.disabled = true
      }
      newItem.value = item.menuId
      newItem.label = item.menuName
      newItem.children = item.children
      data[index] = newItem
      if (item.children && item.children.length) {
        setDisabled(item.children)
      } else {
        // item.children = []
      }
    }
  })
}
// 点击图标选择框
const iconSelect = ref()
const popoverVisible = ref(false)
const iconSelectShow = () => {
  iconSelect.value.reset()
}
// 选择图标
const selected = (icon) => {
  formParams.icon = icon
  popoverVisible.value = false
}

const statusFormat = (row) => {
  if (row.menuType === 'F') {
    return ''
  }
  return selectDictLabel(visibleOptions, row.status)
}
const open = ref(false)
const title = ref('')
// 点击新增
const handleAdd = (row) => {
  open.value = true
  reset()
  if (row && row.menuId) {
    formParams.parentId = row.menuId
  } else {
    formParams.parentId = '0'
  }
  open.value = true
  title.value = '添加'
}
// 点击编辑
const handleUpdate = (row) => {
  open.value = true
  reset()
  getMenu(row.menuId).then(({ data }) => {
    formParams.menuId = data.menuId
    formParams.parentId = data.parentId
    formParams.menuName = data.menuName
    formParams.path = data.path
    formParams.icon = data.icon
    formParams.menuType = data.menuType
    formParams.orderNum = Number(data.orderNum)
    formParams.isFrame = data.isFrame
    formParams.isCache = data.isCache
    formParams.visible = data.visible
    formParams.status = data.status
    open.value = true
    title.value = '修改'
  })
}
// 点击确定
const btnLoading = ref(false)
const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      btnLoading.value = true
      if (typeof formParams.parentId === 'object') {
        formParams.parentId = String((formParams.parentId as string[]).pop())
      }
      if (String(formParams.parentId) !== '0') {
        formParams.icon = ''
      }
      if (formParams.menuId != '') {
        updateMenu(formParams)
          .then(() => {
            ;(Message as any).success('修改成功')
            open.value = false
            getList()
          })
          .finally(() => (btnLoading.value = false))
      } else {
        const params: any = {
          ...formParams,
        }
        delete params.menuId
        addMenu(params)
          .then(() => {
            ;(Message as any).success('新增成功')
            open.value = false
            getList()
          })
          .finally(() => (btnLoading.value = false))
      }
    }
  })
}
// 点击删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`是否确认删除名称为${row.menuName}的数据项?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    delMenu(row.menuId).then(() => {
      getList()
      ;(Message as any).success('删除成功')
    })
  })
}
// 点击取消按钮
const cancel = () => {
  reset()
  open.value = false
}

// 表单重置
const reset = () => {
  formParams.menuId = ''
  formParams.parentId = '0'
  formParams.menuName = ''
  formParams.icon = ''
  formParams.path = ''
  formParams.menuType = 'M'
  formParams.orderNum = 0
  formParams.isFrame = '1'
  formParams.isCache = '0'
  formParams.visible = '0'
  formParams.status = '0'
  nextTick(() => {
    formRef.value.resetFields()
  })
}
</script>
