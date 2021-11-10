<template>
  <div class="js-html">
    <div v-for="(item, index) in arr" :key="index">
      <h2><span>{{ index + 1 }}：</span><span>{{ item.name }}</span></h2>
      <p v-text="item.value"></p>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'codeControl',
  setup() {
    const arr = [
      {
        name: '汇总行',
        value: `<div class="summary-row">
          <p>验收总金额：{{ totalMoney }}</p>
        </div>`,
      },
      {
        name: '列表',
        value: ` <el-table
        v-loading="getDataLoading"
        border
        :data="filterList"
        stripe
        height="100%">
        </el-table>`,
      },
      {
        name: '分页器',
        value: `<Pagination
          :total="totalItems"
          :page.sync="currentPage"
          :limit.sync="pageSize"
          @pagination="getData"
        ></Pagination>`,
      },
      {
        name: '弹框',
        value: `    <el-dialog
          :title="title"
          v-dialogDrag
          :visible.sync="addEditVirable"
          :show-close="true"
          :lock-scroll="false"
          :close-on-click-modal="false"
          :close-on-press-escape="false">
                <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="resetForm('addDatas')">取 消</el-button>
            <el-button
              size="small"
              :disabled="isPrevent"
              type="primary"
              @click="submitForm('addDatas')"
              >确 定</el-button
            >
          </span>
        </el-dialog>`,
      },
      {
        name: '表单',
        value: ` <el-form size="small" :inline="true" class="top-search" label-width="90px"><el-form-item label="配送单">
          <el-input
            clearable
            ref="searchBlur"
            v-model="search"
            placeholder="配送单"
            @keyup.enter.native="searchData"
          ></el-input>
        </el-form-item></el-form>`,
      },
      {
        name: '下拉框',
        value: `<el-select
          v-model="searchSup"
          placeholder="供应商"
          clearable
          filterable
          size="small"
        >
          <el-option value="" label="全部"></el-option>
          <el-option
            v-for="item in SupOpt"
            :key="item.sSupId"
            :label="item.sSupName"
            :value="item.sSupId"
          >
          </el-option>
        </el-select>`,
      },
      {
        name: '输入框',
        value: ` <el-form-item label="商品信息">
          <el-input
            clearable
            v-model="sBatchNo"
            placeholder="商品信息"
            size="small"
          ></el-input>
        </el-form-item>`,
      },
      {
        name: '时间段',
        value: ` <el-date-picker
          size="small"
          v-model="dateArr"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>`,
      },
      {
        name: '时间段 两格',
        value: `<el-form-item label="时间" class="date-picker">
          <el-date-picker
            size="small"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="开始日期"
            :editable="false"
            prefix-icon="none"
            v-model="dStartDate"
            :picker-options="pickerBeginDateBefore"
          >
          </el-date-picker>
          <span>-</span>
          <el-date-picker
            size="small"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="结束日期"
            :editable="false"
            prefix-icon="none"
            v-model="dEndDate"
            :picker-options="pickerBeginDateAfter"
          >
          </el-date-picker>
        </el-form-item>`,
      },
      {
        name: '查询按钮',
        value: ` <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="searchData"
          >查询</el-button
        >`,
      },
      {
        name: '打印按钮',
        value: `   <el-button
          type="warning"
          icon="el-icon-printer"
          size="small"
          @click="print"
          >打印</el-button
        >`,
      },
      {
        name: '计数器 - 表格',
        value: `<div @click.stop>
          <el-input-number
            size="small"
            spellcheck="false"
            v-model="scope.row.nExsitNum"
            :min="0"
          >
          </el-input-number>
        </div>`,
      },
    ]
    return { arr }
  },
})
</script>

<style lang="scss" scoped>
.js-html {
  height: 100%;
  overflow: auto;
  padding-bottom: 20px;
  & > div {
    margin-bottom: 30px;
  }
}
</style>