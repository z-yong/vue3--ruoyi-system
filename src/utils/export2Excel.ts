// tslint:disable-next-line
export default function (header, data, filename) {
  return new Promise((res, rej) => {
    import('@/assets/ts/Export2Excel').then((excel) => {
      excel.export_json_to_excel({
        header, // 表头 必填
        data, // 具体数据 必填
        filename, // excel-list 非必填
        autoWidth: true, // 自动宽度 非必填
        bookType: 'xlsx' // 非必填
      })
      res('ok')
    }).catch(() => rej())
  })
}
