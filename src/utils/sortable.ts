import Sortable from 'sortablejs'

// 行拖拽
export function rowDrag(domClass, tableData, callback) {
  if (!tableData.length) {
    return
  }
  if (!domClass) {
    domClass = ''
  } else {
    domClass = '.' + domClass
  }
  // 首先获取需要拖拽的dom节点
  const wrapperTbody = document.querySelector(`${domClass} .el-table__body-wrapper table > tbody`)
  console.log('wrapperTbody', wrapperTbody)
  if (!wrapperTbody) {
    return
  }
  Sortable.create(wrapperTbody, {
    disabled: false, // 是否开启拖拽
    ghostClass: 'sortable-ghost', // 拖拽样式
    animation: 150, // 拖拽延时，效果更好看
    group: { // 是否开启跨表拖拽
      pull: false,
      put: false
    },
    onEnd: ({
      newIndex,
      oldIndex
    }) => {
      if (oldIndex === newIndex) {
        return
      }
      // 更新数据位置
      tableData.splice(newIndex, 0, tableData.splice(oldIndex, 1)[0]) // 数据处理
      tableData.map((item, index) => item.sort = index + 1)
      // tslint:disable-next-line
      typeof callback === 'function' && callback(tableData)
    }
  })
}

// 列拖拽
export function columnDrag(domClass, columnList, callback) {
  if (!columnList.length) {
    return
  }
  if (!domClass) {
    domClass = ''
  } else {
    domClass = '.' + domClass
  }
  const wrapperTr = document.querySelector(`.${domClass} .el-table__header-wrapper tr`)
  if (!wrapperTr) {
    return
  }
  Sortable.create(wrapperTr, {
    disabled: false, // 是否开启拖拽
    ghostClass: 'sortable-ghost', // 拖拽样式
    animation: 150, // 拖拽延时，效果更好看
    group: { // 是否开启跨表拖拽
      pull: false,
      put: false
    },
    onEnd: ({
      newIndex,
      oldIndex
    }) => {
      if (oldIndex === newIndex) {
        return
      }
      // 更新数据位置
      columnList.splice(newIndex, 0, columnList.splice(oldIndex, 1)[0])
      columnList.map((item, index) => item.sort = index + 1)
      // 更改key值以重新渲染页面
      if (columnList[newIndex].key < columnList.length) {
        columnList[newIndex].key += columnList.length
      } else {
        columnList[newIndex].key -= columnList.length
      }
      // 执行回调
      // tslint:disable-next-line
      typeof callback === 'function' && callback(columnList)
    }
  })
}
