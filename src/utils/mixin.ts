import { defineComponent, ref, nextTick, onMounted, onActivated, onBeforeUnmount } from 'vue'
export default defineComponent({
  setup() {
    let domList: HTMLElement[] | null = []
    const multipleTable = ref()
    const multipleTableOne = ref()

    const updateTable = (doms: any[] | null = domList) => {
      if (doms && doms.length) {
        doms.forEach((dom) => dom.doLayout && dom.doLayout())
      }
    }

    onMounted(() => {
      nextTick(() => {
        domList = []
        domList.push(multipleTable.value, multipleTableOne.value)
        if (domList.some((item) => item)) {
          window.addEventListener('resize', () => updateTable(domList))
        }
      })
    })

    onActivated(updateTable)

    onBeforeUnmount(() => {
      if (domList && domList.length) {
        domList = []
        window.removeEventListener('resize', () => updateTable(domList))
      }
    })

    return { multipleTable, multipleTableOne }
  }
})
