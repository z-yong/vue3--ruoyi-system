<template>
  <div v-if="currentOrg.sOrgName" class="OrganizationStructure">
    <div class="sOrgName" @click="clickCurrentOrg">
      {{ currentOrg.sOrgName }} <i class="el-icon-caret-bottom"></i>
    </div>
    <template v-dialogDrag:changeOrganizationStructure v-dialogDragSize:changeOrganizationStructure>
      <el-dialog title="切换组织结构" append-to-body v-model="dialogTableVisible"
        custom-class="changeOrganizationStructure" :before-close="beforeClose">
        <el-form :inline="true" class="top-search">
          <el-form-item label="组织名称">
            <el-input v-model="searchData" placeholder="组织名称" clearable size="small"
              @keyup.enter="search" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="small" @click="search">查询
            </el-button>
          </el-form-item>
        </el-form>
        <el-table border :data="filterList" stripe ref="multipleTable" highlight-current-row
          @current-change="handleCurrentChange">
          <el-table-column label="序号" type="index" align="center" width="60"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="sOrgId" sortable label="组织结构ID">
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="sOrgName" sortable label="组织结构名称">
          </el-table-column>
        </el-table>
        <template v-slot:footer>
          <el-button size="small" @click="dialogTableVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="changeOrg">确 定</el-button>
        </template>
      </el-dialog>
    </template>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { computed, ref } from '@vue/reactivity'
import userStore from '@/store/user'
import commonStore from '@/store/common'
import tagsViewStore from '@/store/tagsView'
import { OrgType } from '@/types/user'
import { nextTick } from '@vue/runtime-core'
import { useRoute, useRouter } from 'vue-router'
export default defineComponent({
  setup() {
    const dialogTableVisible = ref(false)
    const searchData = ref('')
    const filterList = ref<OrgType[]>([])

    const currentOrg = computed(() => {
      return userStore.getState().currentOrg
    })

    const sOrgList = computed(() => {
      return userStore.getState().sOrgList
    })

    let currentRow = {
      sOrgId: '',
      sOrgName: '',
    }

    const beforeClose = () => {
      searchData.value = ''
      dialogTableVisible.value = false
    }
    const search = () => {
      filterList.value = sOrgList.value.filter(({ sOrgName }) => {
        return sOrgName.includes(searchData.value)
      })
    }

    const multipleTable = ref()
    const clickCurrentOrg = () => {
      dialogTableVisible.value = true
      filterList.value = [...sOrgList.value]
      nextTick(() => {
        multipleTable.value.setCurrentRow(currentOrg.value)
      })
    }

    const route = useRoute()
    const changeOrg = () => {
      userStore.setCurrentOrg(currentRow)
      commonStore.resetState()
      dialogTableVisible.value = false
      closeOthersTags(route)
    }
    // 关闭其他所有页面
    const closeOthersTags = (view) => {
      tagsViewStore.delOthersViews(view).then(() => {
        refreshSelectedTag(view)
      })
    }
    // 刷新当前页
    const router = useRouter()
    const refreshSelectedTag = (view) => {
      tagsViewStore.delCachedView(view).then(() => {
        const { fullPath } = view
        nextTick(() => {
          router.replace({
            path: '/redirect' + fullPath,
          })
        })
      })
    }
    const handleCurrentChange = (val) => {
      currentRow = val
    }
    return {
      dialogTableVisible,
      searchData,
      filterList,
      multipleTable,
      currentOrg,
      beforeClose,
      search,
      clickCurrentOrg,
      changeOrg,
      handleCurrentChange,
    }
  },
})
</script>

<style lang="scss" scoped>
.OrganizationStructure {
  cursor: pointer;
  font-size: 15px !important;
  .sOrgName:hover {
    color: var(--theme);
  }
}
</style>