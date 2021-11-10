<template>
  <div class="df">
    <div class="f1 df fdc">
      <el-form :inline="true" class="top-search" label-width="90px" size="small">
        <el-form-item label="用户信息">
          <el-input placeholder="用户信息" clearable v-model="search" @keyup.enter="searchData">
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" icon="el-icon-search" size="small" @click="searchData">查询
          </el-button>
          <el-button v-hasPermi="['userManage:sync']" type="success" plain icon="el-icon-refresh"
            size="small" @click="synchroOperate">
            同步
          </el-button>
          <el-button v-hasPermi="['userManage:export']" type="success" icon="el-icon-download"
            size="small" @click="exportExcel">导出
          </el-button>
        </el-form-item>
      </el-form>
      <div class="f1">
        <el-table v-loading="loading" ref="multipleTable" stripe border :data="tableDataEnd"
          highlight-current-row @row-click="userTableClick" height="100%">
          <el-table-column fixed="left" label="序号" type="index" align="center" width="60">
          </el-table-column>
          <el-table-column prop="sUserCode" align="center" min-width="130"
            :show-overflow-tooltip="true" label="用户编码">
          </el-table-column>
          <el-table-column prop="sUserName" align="center" min-width="140"
            :show-overflow-tooltip="true" label="用户名称">
          </el-table-column>
          <el-table-column prop="nTypeName" align="center" min-width="140"
            :show-overflow-tooltip="true" label="用户类型">
          </el-table-column>
          <el-table-column prop="sTelNo" min-width="120" align="center"
            :show-overflow-tooltip="true" label="电话">
          </el-table-column>
          <el-table-column prop="sEmail" align="center" min-width="160"
            :show-overflow-tooltip="true" label="邮箱">
          </el-table-column>
          <el-table-column prop="sSex" align="center" min-width="75" :show-overflow-tooltip="true"
            label="性别">
            <template v-slot="scope">
              <span v-if="scope.row.sSex == '1'"> 男</span>
              <span v-else-if="scope.row.sSex == '0'"> 女</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" min-width="75" :show-overflow-tooltip="true" align="center">
            <template v-slot="scope">
              <span v-text="scope.row.nState == 0 ? '正常' : '停用'"></span>
            </template>
          </el-table-column>
          <el-table-column prop="nIsmain" align="center" min-width="130"
            :show-overflow-tooltip="true" label="是否是主账号">
            <template v-slot="scope">
              <span v-if="scope.row.nIsmain == 1">是</span>
              <span v-else-if="scope.row.nIsmain == 0">否</span>
            </template>
          </el-table-column>
          <el-table-column prop="sSelfCode" align="center" min-width="100"
            :show-overflow-tooltip="true" label="院内码">
          </el-table-column>
        </el-table>
      </div>
      <Pagination :total="totalItems" v-model:page="currentPage" v-model:limit="pageSize"
        @pagination="handleCurrentChange"></Pagination>
    </div>
    <div class="df fdc jsb" style="flex: 0.4; margin-left: 30px">
      <!-- 组织结构名称 -->
      <div style="flex: 0.48">
        <el-table v-loading="orgLoading" stripe border :data="organData" height="100%">
          <el-table-column label="序号" type="index" align="center" width="60">
          </el-table-column>
          <el-table-column prop="sOrgName" align="center" :show-overflow-tooltip="true"
            label="组织结构名称">
          </el-table-column>
        </el-table>
      </div>
      <!-- 角色名称 -->
      <div style="flex: 0.48">
        <el-table v-loading="roleLoading" :data="roleData" height="100%">
          <el-table-column label="序号" type="index" align="center" width="60">
          </el-table-column>
          <el-table-column prop="roleName" align="center" :show-overflow-tooltip="true"
            label="角色名称">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'userManage',
})
</script>

<script lang="ts" setup>
import { getUser, syncUser } from '@/api/initial/user'
import { getOwnerList } from '@/api/initial/hospital'
import { getOrgAll } from '@/api/system/org'
import { getRoleAll } from '@/api/system/role'
import { ref } from 'vue-demi'
import Message from '@/utils/message'
import { ElMessageBox } from 'element-plus'
import Export2Excel from '@/utils/export2Excel'

const multipleTable = ref()

let tableDataAll = []
let flag = false
const search = ref('')
const currentPage = ref(1)
const pageSize = ref(15)
const totalItems = ref(0)
const tableDataEnd: any = ref([])
const hosData = ref([])
const loading = ref(false)

const orgLoading = ref(false)
const roleLoading = ref(false)
const organData = ref([])
const roleData = ref([])

const userTableClick = (row) => {
  orgLoading.value = roleLoading.value = true
  getOrgAll(row.sUserId)
    .then((res) => {
      organData.value = res.data
    })
    .finally(() => (orgLoading.value = false))
  getRoleAll(row.sUserId)
    .then((res) => {
      roleData.value = res.data
    })
    .finally(() => (roleLoading.value = false))
}
const getData = () => {
  loading.value = true
  tableDataEnd.value = []
  getUser({
    userInfo: search.value,
    pageNum: currentPage.value,
    pageSize: pageSize.value,
  })
    .then((res) => {
      tableDataAll = res.data.map((item) => ({
        ...item,
        nTypeName:
          item.nTypeId == 4
            ? '平台管理员'
            : item.nTypeId == 5
            ? '医院方'
            : '供应商',
      }))
      flag = false
      currentPage.value = 1
      totalItems.value = tableDataAll.length
      if (totalItems.value > pageSize.value) {
        for (let index = 0; index < pageSize.value; index++) {
          tableDataEnd.value.push(tableDataAll[index])
        }
      } else {
        tableDataEnd.value = tableDataAll
      }
      if (res.data.length) {
        multipleTable.value.setCurrentRow(tableDataEnd.value[0])
        userTableClick(res.data[0])
      }
    })
    .finally(() => (loading.value = false))

  // 获取所有医院
  getOwnerList().then((res) => {
    hosData.value = res.data.map((item) => ({
      label: item.sOwnerName,
      value: item.sOwnerId,
    }))
  })
}

getData()

const synchroOperate = () => {
  syncUser().then((res) => {
    ;(Message as any).success('同步成功')
    getData()
  })
}

let filterTableDataEnd = []
const searchData = () => {
  tableDataEnd.value = []
  //每次手动将数据置空,因为会出现多次点击搜索情况
  tableDataAll.forEach((value, index) => {
    for (let key in value) {
      if (value[key]) {
        if (String(value[key]).indexOf(search.value.toUpperCase()) >= 0) {
          filterTableDataEnd.push(value)
          break
        }
      }
    }
  })
  //页面数据改变重新统计数据数量和当前页
  currentPage.value = 1
  totalItems.value = filterTableDataEnd.length
  //渲染表格,根据值
  currentChangePage(filterTableDataEnd)
  //页面初始化数据需要判断是否检索过
  flag = true
}

const handleCurrentChange = (val) => {
  currentPage.value = val.page
  pageSize.value = val.limit
  //需要判断是否检索
  if (!flag) {
    currentChangePage(tableDataAll)
  } else {
    currentChangePage(filterTableDataEnd)
  }
}

const currentChangePage = (list) => {
  let from = (currentPage.value - 1) * pageSize.value
  const to = currentPage.value * pageSize.value
  tableDataEnd.value = []
  for (; from < to; from++) {
    if (list[from]) {
      tableDataEnd.value.push(list[from])
    }
  }
}

const exportExcel = () => {
  if (tableDataAll.length == 0) {
    return (Message as any).warning('暂无数据')
  }
  ElMessageBox.confirm('此操作将导出excel文件, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    export2Excel()
  })
}

const exportLoading = ref(false)
const export2Excel = () => {
  exportLoading.value = true
  require.ensure([], () => {
    const tHeader = [
      '用户编码',
      '院内码',
      '用户名称',
      '性别',
      '状态',
      '是否是主账号',
      '电话',
      '邮箱',
      '微信',
      '生日',
      '创建人',
      '创建时间',
      '修改人',
      '修改时间',
    ] // 导出的表头名
    const filterVal = [
      'sUserCode',
      'sSelfCode',
      'sUserName',
      'sSex',
      'nState',
      'nIsmain',
      'sTelNo',
      'sEmail',
      'sWechatNo',
      'dBirthday',
      'sCreateUser',
      'dCreateDate',
      'sModifyUser',
      'dModifyDate',
    ] // 导出的表头字段名
    let arr = JSON.parse(JSON.stringify(tableDataAll)).map((item) => ({
      ...item,
      nState: item.nState === 0 ? '正常' : '停用',
      sSex: item.sSex == 0 ? '女' : '男',
      nIsmain: item.nIsmain === 0 ? '否' : '是',
    }))
    const list = arr
    const data = formatJson(filterVal, list)

    Export2Excel(tHeader, data, '用户excel').finally(() => {
      exportLoading.value = false
    }) // 导出的表格名称，根据需要自己命名
  })
}

const formatJson = (filterVal, jsonData) => {
  return jsonData.map((v) => filterVal.map((j) => v[j]))
}
</script>
