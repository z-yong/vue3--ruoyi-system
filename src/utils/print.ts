import { ElMessage } from 'element-plus'

// tslint:disable-next-line
export default function (templateUrl: string, paramData: any) {
  return new Promise((resolve, reject) => {
    try {
      function printStart() {
        const jsonData = {
          Table1: paramData
        }
        // @ts-ignore: Unreachable code error
        const report = new Stimulsoft.Report.StiReport();
        report.loadFile(templateUrl, paramData); // 默认可以mrt文件方式初始化
        // @ts-ignore: Unreachable code error
        const dataSet = new Stimulsoft.System.Data.DataSet('data');
        report.dictionary.databases.clear();
        dataSet.readJson(jsonData);
        report.regData('data', 'data', dataSet);
        report.render();
        report.reportName = '';
        report.print();
        resolve('ok');
      }
      // @ts-ignore: Unreachable code error
      if (typeof Stimulsoft === 'undefined') { // 没有这个打印对象
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'static/stimulsoft/stimulsoft.reports.js';
        document.getElementsByTagName('head')[0].appendChild(script);
        script.onload = () => {
          printStart();
        };
      } else {
        printStart();
      }
    } catch (e) {
      ElMessage({
        message: '打印出错了',
        type: 'warning',
        duration: 5 * 1000
      })
      reject(e)
    }
  })
}
