import { Store } from './index'
import { getSupOpt } from '@/api/store/common'
import { SupOptType, CommonType } from '@/types/common'

function getDefaultState(): CommonType {
  return {
    SupOpt: []
  }
}
const state = getDefaultState()

class CommonStore extends Store<CommonType> {
  public setSupOpt(SupOpt: SupOptType[]): void {
    this.state.SupOpt = SupOpt
  }

  public resetState(): void {
    this.state = getDefaultState()
  }

  public getSupOpt() {
    return new Promise((resolve) => {
      const SupOpt = this.state.SupOpt
      if (SupOpt && SupOpt.length) {
        resolve(SupOpt)
      } else {
        getSupOpt().then(({ data }) => {
          this.setSupOpt(data)
          resolve(data)
        }).catch(() => {
          this.setSupOpt([])
          resolve([])
        })
      }
    })
  }

  protected data(): CommonType {
    return state
  }
}

export default new CommonStore()
