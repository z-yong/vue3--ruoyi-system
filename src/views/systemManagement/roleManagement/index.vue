<template>
  <div class="df fdc">
    <el-form ref="queryForm" :inline="true" class="top-search" label-width="90px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="queryParams.roleName" placeholder="请输入角色名称" clearable size="small"
          @keyup.enter="handleQuery"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="角色状态" clearable size="small">
          <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">查询
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-hasPermi="['roleManagement:add']" type="primary" plain icon="el-icon-plus"
          size="small" @click="handleAdd">添加
        </el-button>
      </el-form-item>
    </el-form>
    <div class="f1">
      <el-table height="100%" v-loading="loading" :data="roleList" border>
        <!-- <el-table-column label="角色编号" align="center" prop="roleId"></el-table-column> -->
        <el-table-column label="序号" align="center" type="index"></el-table-column>
        <el-table-column label="角色名称" align="center" prop="roleName" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column align="center" label="显示顺序" prop="roleSort"></el-table-column>
        <el-table-column label="状态" align="center">
          <template v-slot="scope">
            <span :class="scope.row.status == 0 ? 'blue' : ''">
              {{ scope.row.status == 0 ? "启用" : "停用" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime">
          <template v-slot="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="250"
          class-name="small-padding fixed-width">
          <template v-slot="scope">
            <el-button v-hasPermi="['roleManagement:edit']" size="small" type="text"
              @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button v-hasPermi="['roleManagement:contrast']" size="small" type="text"
              @click="handleDataScope(scope.row)">用户对照</el-button>
            <el-button v-hasPermi="['roleManagement:delete']" size="small" type="text"
              @click="handleDelete(scope.row)">删除</el-button>
            <el-button v-hasPermi="['roleManagement:stop']" v-if="scope.row.status == 0"
              size="small" type="text" @click="handleStatusChange(scope.row)">停用
            </el-button>
            <el-button v-hasPermi="['roleManagement:start']" v-if="scope.row.status != 0"
              size="small" type="text" @click="handleStatusChange(scope.row)">启用
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" :total="total"></pagination>
    <!-- 添加或修改角色配置对话框 -->
    <div v-dialogDrag:openDialog v-dialogDragSize:openDialog>
      <el-dialog custom-class="openDialog" :title="title" v-model="open" width="700px"
        :lock-scroll="false" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="form" :model="formParams" :rules="rules" label-width="80px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="formParams.roleName" placeholder="请输入角色名称"></el-input>
          </el-form-item>
          <el-form-item label="角色顺序" prop="roleSort">
            <el-input-number v-model="formParams.roleSort" controls-position="right" :min="0">
            </el-input-number>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="formParams.status">
              <el-radio v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictValue">
                {{ dict.dictLabel }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="菜单权限">
            <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">
              展开/折叠
            </el-checkbox>
            <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">
              全选/全不选</el-checkbox>
            <el-checkbox v-model="formParams.menuCheckStrictly"
              @change="handleCheckedTreeConnect($event, 'menu')">父子联动</el-checkbox>
            <el-tree v-loading="treeLoading" class="tree-border" :data="menuOptions" show-checkbox
              ref="menu" node-key="id" :check-strictly="!formParams.menuCheckStrictly"
              empty-text="加载中，请稍后" :props="{  children: 'children', label: 'label' }">
            </el-tree>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="formParams.remark" type="textarea" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button size="small" @click="cancel">取 消</el-button>
          <el-button size="small" type="primary" @click="submitForm">确 定</el-button>
        </template>
      </el-dialog>
    </div>

    <!-- 用户对照弹框 -->
    <div v-dialogDrag:openDataScopeDialog v-dialogDragSize:openDataScopeDialog>
      <el-dialog :title="title" v-model="openDataScope" width="80%"
        custom-class="openDataScopeDialog" :lock-scroll="false" :close-on-click-modal="false"
        :close-on-press-escape="false">
        <el-form :inline="true" class="top-search" label-width="90px">
          <el-form-item label="用户信息">
            <el-input clearable v-model="search" placeholder="用户信息" @keyup.enter="handleUserSearch"
              size="small"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="small" @click="handleUserSearch">
              查询
            </el-button>
            <el-button v-hasPermi="['roleManagement:dialog:add']" type="primary" plain
              icon="el-icon-plus" size="small" @click="handleAddUser">添加
            </el-button>
          </el-form-item>
        </el-form>
        <el-table v-loading="getDataLoading" border :data="limiteUserData" stripe height="520">
          <el-table-column label="序号" type="index" align="center" width="60">
          </el-table-column>
          <el-table-column prop="sUserName" align="center" :show-overflow-tooltip="true"
            label="用户姓名">
          </el-table-column>
          <el-table-column prop="sUserCode" align="center" :show-overflow-tooltip="true"
            label="用户编码">
          </el-table-column>
          <el-table-column prop="sTelNo" align="center" :show-overflow-tooltip="true" label="联系电话">
          </el-table-column>
          <el-table-column label="状态" :show-overflow-tooltip="true" align="center">
            <template v-slot="scope">
              <span v-text="scope.row.nState == 0 ? '正常' : '停用'"></span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" align="center" :show-overflow-tooltip="true" label="操作"
            width="80">
            <template v-slot="scope">
              <el-button v-hasPermi="['roleManagement:dialog:delete']"
                @click="limiteUserDelete(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <template #footer>
          <div class="dialog-footer">
            <el-button size="small" @click="openDataScope = false">关 闭</el-button>
          </div>
        </template>
        <template v-dialogDrag:innerVisibleDialog v-dialogDragSize:innerVisibleDialog>
          <el-dialog custom-class="innerVisibleDialog" width="60%" title="用户列表"
            v-model="innerVisible" :lock-scroll="false" :close-on-click-modal="false"
            :close-on-press-escape="false" append-to-body @close="beforeClose">
            <el-form :inline="true" class="top-search" label-width="90px">
              <el-form-item label="用户信息">
                <el-input clearable v-model="firmSearch" placeholder="用户信息"
                  @keyup.enter="searchName" size="small"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="small" @click="searchName">查询
                </el-button>
              </el-form-item>
            </el-form>
            <el-table v-loading="getDataLoading2" border :data="firmUserData" stripe height="450"
              ref="multipleTable" :row-key="getRowKey" @cell-click="getRowClick"
              @selection-change="selectionChange" :row-class-name="rowClassName">
              <el-table-column type="selection" align="center" :selectable="selectableFunc"
                :reserve-selection="true" width="40"></el-table-column>
              <el-table-column label="序号" type="index" align="center" width="60">
              </el-table-column>
              <el-table-column prop="sUserName" align="center" :show-overflow-tooltip="true"
                label="用户姓名">
              </el-table-column>
              <el-table-column prop="sUserCode" align="center" :show-overflow-tooltip="true"
                label="用户编码">
              </el-table-column>
            </el-table>
            <Pagination :total="totalItems" v-model:page="firmCurrentPage"
              v-model:limit="firmPageSize" @pagination="addUser"></Pagination>
            <template #footer>
              <span class="dialog-footer">
                <el-button size="small" @click="innerVisible = false">取 消</el-button>
                <el-button size="small" :disabled="isPrevent" @click="cliceSave" type="primary">确 定
                </el-button>
              </span>
            </template>
          </el-dialog>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'roleManagement',
})
</script>

<script  lang="ts" setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import {
  listRole,
  getRole,
  delRole,
  createRole,
  updateRole,
  addRole,
  changeRoleStatus,
  getHavenUserList,
  delUserContrast,
  getOptionalUser,
} from '@/api/system/role'
import { treeselect, roleMenuTreeselect } from '@/api/system/menu'
import { ElMessageBox } from 'element-plus'
import Message from '@/utils/message'
import { parseTime } from '@/utils/ruoyi'

const statusOptions = [
  {
    dictLabel: '启用',
    dictValue: '0',
  },
  {
    dictLabel: '停用',
    dictValue: '1',
  },
]

const rules = {
  roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
  roleSort: [{ required: true, message: '角色顺序不能为空', trigger: 'blur' }],
}
// 查询菜单树
const treeLoading = ref(false)
const menuOptions = ref([])
const deptOptions = ref([])
const getMenuTreeselect = () => {
  treeselect()
    .then((response) => {
      menuOptions.value = response.data.menus
    })
    .finally(() => (treeLoading.value = false))
}

// 查询角色列表
const queryParams = reactive({
  pageNum: 1,
  pageSize: 15,
  roleName: '',
  status: '',
})
const loading = ref(false)
const roleList = ref([])
const total = ref(0)
const getList = () => {
  listRole(queryParams).then((response) => {
    let data = response.data
    roleList.value = data.records
    total.value = data.total
    loading.value = false
  })
}

onMounted(() => {
  getList()
})

let currentRoleId = ''
const openDataScope = ref(false)
// 用户对照
const handleDataScope = (row) => {
  currentRoleId = row.roleId
  getHavenUser()
}
// 删除用户对照
const limiteUserDelete = (row) => {
  ElMessageBox.confirm('是否确认删除该条用户对照？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    delUserContrast({
      sRoleId: currentRoleId,
      sUserId: row.sUserId,
    }).then((res) => {
      ;(Message as any).success(res.data)
      getHavenUser() // 重新获取已关联的用户信息
    })
  })
}

const selectableFunc = (row) => {
  return !row.jiang
}

const rowClassName = ({ row }) => {
  if (row.jiang) {
    return 'grey-row'
  }
}

let selectLayerData = []
const cliceSave = () => {
  if (!selectLayerData.length) {
    return (Message as any).warning('请勾选用户')
  }
  saveUser()
}

const firmSearch = ref('')
const firmCurrentPage = ref(1)
const firmPageSize = ref(15)
const totalItems = ref(0)
const firmUserData = ref([])
const getDataLoading2 = ref(false)
const innerVisible = ref(false)
const isPrevent = ref(false)

const saveUser = () => {
  let postUserId = selectLayerData.map((item: any) => item.sUserId)
  addRole({
    sRoleId: currentRoleId,
    sUserIds: postUserId,
  })
    .then(() => {
      getHavenUser()
      innerVisible.value = false
      ;(Message as any).success('添加成功')
    })
    .finally(() => (isPrevent.value = false))
}

const getRowKey = (row) => {
  return row.sUserId
}

const selectionChange = (val) => {
  selectLayerData = val
}

const multipleTable = ref()
const getRowClick = (row) => {
  if (row.jiang) return false
  multipleTable.value.toggleRowSelection(row)
}

const beforeClose = () => {
  firmSearch.value = ''
  multipleTable.value.clearSelection()
}

const searchName = () => {
  firmCurrentPage.value = 1
  addUser()
}

const handleAddUser = () => {
  innerVisible.value = true
  searchName()
}

const limiteUserData: any = ref([])
let limiteUserDataSearch = []
const getDataLoading = ref(false)
const title = ref('')

const addUser = () => {
  getDataLoading2.value = true
  getOptionalUser({
    pageNum: firmCurrentPage.value,
    pageSize: firmPageSize.value,
    userName: firmSearch.value,
  })
    .then((res) => {
      res.data.records.map((item) => {
        if (
          limiteUserData.value.find((item2) => item.sUserId == item2.sUserId)
        ) {
          item.jiang = true
        }
      })
      firmUserData.value = res.data.records
      totalItems.value = res.data.total
    })
    .finally(() => (getDataLoading2.value = false))
}

// 获取已关联用户信息
const getHavenUser = () => {
  openDataScope.value = true
  getDataLoading.value = true
  getHavenUserList(currentRoleId)
    .then((res) => {
      limiteUserData.value = res.data
      limiteUserDataSearch = res.data
      title.value = '用户对照'
    })
    .finally(() => (getDataLoading.value = false))
}

const search = ref('')
// 搜索对照用户
const handleUserSearch = () => {
  limiteUserData.value = []
  limiteUserDataSearch.forEach((value, index) => {
    for (let key in value) {
      if (value[key]) {
        if (
          String(value[key])
            .toUpperCase()
            .indexOf(search.value.toUpperCase()) >= 0
        ) {
          limiteUserData.value.push(value)
          break
        }
      }
    }
  })
}

const menu = ref()
// 获取所有菜单节点数据
const getMenuAllCheckedKeys: any = async () => {
  await nextTick()
  // 目前被选中的菜单节点
  const checkedKeys = menu.value.getCheckedKeys()
  // 半选中的菜单节点
  const halfCheckedKeys = menu.value.getHalfCheckedKeys()
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
  return checkedKeys
}
const dept = ref()
// 获取所有部门节点数据
const getDeptAllCheckedKeys = async () => {
  await nextTick()
  // 目前被选中的部门节点
  let checkedKeys = dept.value.getCheckedKeys()
  // 半选中的部门节点
  let halfCheckedKeys = dept.value.getHalfCheckedKeys()
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
  return checkedKeys
}
// 根据角色ID查询菜单树结构
const getRoleMenuTreeselect = (roleId) => {
  return roleMenuTreeselect(roleId).then((response) => {
    menuOptions.value = response.data.menus
    return response
  })
}
// 角色状态修改
const handleStatusChange = (row) => {
  const status = row.status === '0' ? '1' : '0'
  const text = status === '0' ? '启用' : '停用'
  ElMessageBox.confirm(`确认要${text}${row.roleName} + ''角色吗?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    changeRoleStatus(row.roleId, status).then(() => {
      ;(Message as any).success(text + '成功')
      getList()
    })
  })
}
const handleCheckedTreeExpand = (value, type) => {
  if (type == 'menu') {
    const treeList: any = menuOptions.value
    for (let i = 0; i < treeList.length; i++) {
      menu.value.store.nodesMap[treeList[i].id].expanded = value
    }
  } else if (type == 'dept') {
    const treeList: any = deptOptions.value
    for (let i = 0; i < treeList.length; i++) {
      dept.value.store.nodesMap[treeList[i].id].expanded = value
    }
  }
}
// 树权限（全选/全不选）
const handleCheckedTreeNodeAll = (value, type) => {
  if (type == 'menu') {
    menu.value.setCheckedNodes(value ? menuOptions.value : [])
  } else if (type == 'dept') {
    dept.value.setCheckedNodes(value ? deptOptions : [])
  }
}
// 树权限（父子联动）
const handleCheckedTreeConnect = (value, type) => {
  if (type == 'menu') {
    formParams.menuCheckStrictly = value ? true : false
  } else if (type == 'dept') {
    formParams.deptCheckStrictly = value ? true : false
  }
}
// 点击搜索
const handleQuery = () => {
  queryParams.pageNum = 1
  getList()
}
// ----------添加或修改或删除角色对话框-----------
const form = ref()
const formParams = reactive({
  roleId: '',
  roleName: '',
  roleSort: 0,
  status: '0',
  menuIds: [],
  deptIds: [],
  menuCheckStrictly: true,
  deptCheckStrictly: true,
  remark: '',
})
const menuExpand = ref(false)
const menuNodeAll = ref(false)
const open = ref(false)
// 点击新增
const handleAdd = () => {
  open.value = true
  reset()
  getMenuTreeselect()
  title.value = '添加角色'
}
// 点击修改
const handleUpdate = (row) => {
  open.value = true
  reset()
  const roleId = row.roleId
  const roleMenu = getRoleMenuTreeselect(roleId)
  getRole(roleId).then(({ data }) => {
    formParams.roleId = data.roleId
    formParams.roleName = data.roleName
    formParams.roleSort = Number(data.roleSort)
    formParams.status = data.status
    formParams.menuIds = data.menuIds
    formParams.deptIds = data.deptIds
    formParams.menuCheckStrictly = data.menuCheckStrictly
    formParams.deptCheckStrictly = data.deptCheckStrictly
    formParams.remark = data.remark
    nextTick(() => {
      roleMenu.then((res) => {
        let checkedKeys = res.data.checkedKeys
        checkedKeys.forEach((v) => {
          nextTick(() => {
            menu.value.setChecked(v, true, false)
          })
        })
      })
    })
    title.value = '修改角色'
  })
}
// 点击删除
const handleDelete = (row) => {
  const roleIds = row.roleName
  ElMessageBox.confirm(`是否确认删除角色为${roleIds}的数据项?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    return delRole(roleIds).then(() => {
      getList()
      ;(Message as any).success('删除成功')
    })
  })
}
// 点击确定
const submitForm = () => {
  form.value.validate(async (valid) => {
    if (valid) {
      if (formParams.roleId != '') {
        formParams.menuIds = await getMenuAllCheckedKeys()
        updateRole(formParams).then(() => {
          ;(Message as any).success('修改成功')
          open.value = false
          getList()
        })
      } else {
        formParams.menuIds = await getMenuAllCheckedKeys()
        createRole(formParams).then(() => {
          ;(Message as any).success('新增成功')
          open.value = false
          getList()
        })
      }
    }
  })
}
// 点击取消
const cancel = () => {
  reset()
  open.value = false
}
// ----------用户对照表格弹窗-----------

// 表单重置
const reset = () => {
  if (menu.value) {
    menu.value.setCheckedKeys([])
  }
  menuExpand.value = false
  menuNodeAll.value = false
  formParams.roleId = ''
  formParams.roleName = ''
  formParams.roleSort = 0
  formParams.status = '0'
  formParams.menuIds = []
  formParams.deptIds = []
  formParams.menuCheckStrictly = true
  formParams.deptCheckStrictly = true
  formParams.remark = ''
  nextTick(() => {
    form.value.resetFields()
  })
}
</script>