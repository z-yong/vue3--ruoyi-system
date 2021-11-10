import { Store } from './index'
import { resetRouter } from '@/router'
import { OrgType, UserType, LoginType } from '@/types/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, logout, getInfo, getHospitalData, getMenuPermission, getMessageData } from '@/api/store/login'

function getDefaultState(): UserType {
  return {
    token: getToken(),
    avatar: './favicon.ico',
    sUserCode: '',
    sSelfCode: '',
    sUserId: '',
    sUserName: '',
    roles: [],
    permissions: [],
    currentOrg: {
      sOrgId: '', sOrgName: ''
    },
    sOrgList: [],
    sOwnerId: '',
    nTypeId: '',
    messageDataNum: 0
  }
}

const state: UserType = getDefaultState()

class UserStore extends Store<UserType> {
  // protected userState: UserType = reactive(state)

  // public getState(): UserType {
  //   return this.state
  // }

  // 登录
  public login(userInfo: LoginType) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(({ data }) => {
        this.state.token = data
        setToken(data)
        resolve(data)
      }).catch((error) => {
        reject(error)
      })
    })
  }
  // 后端登出
  public logout() {
    return new Promise((resolve, reject) => {
      logout(this.state.sUserCode).then(() => {
        removeToken()
        resetRouter()
        resolve(1)
      }).catch((error) => {
        reject(error)
      })
    })
  }
  // 前端 登出
  public fedLogOut() {
    removeToken()
    this.state = getDefaultState()
    resetRouter()
  }
  // 获取用户信息
  public getUserInfo() {
    return new Promise((resolve, reject) => {
      getInfo(this.state.token).then(({ data }) => {
        if (!data) {
          return reject('用户获取失败，请重新登录.')
        }
        this.state.sUserCode = data.sUserCode
        this.state.sSelfCode = data.sSelfCode
        this.state.sUserId = data.sUserId
        this.state.sUserName = data.sUserName
        this.state.sOwnerId = data.sOwnerId
        this.state.nTypeId = data.nTypeId
        resolve(data)
      }).catch((error) => {
        reject(error)
      })
    })
  }
  // 获取菜单列表
  public getMenuPermission() {
    return new Promise((resolve, reject) => {
      getMenuPermission().then(({ data }) => {
        this.state.permissions = data
        resolve(data)
      }).catch((error) => {
        reject(error)
      })
    })
  }
  // 设置当前组织结构
  public setCurrentOrg(current: OrgType): void {
    this.state.currentOrg = {
      sOrgId: current.sOrgId,
      sOrgName: current.sOrgName
    }
  }
  // 获取所属医院信息
  public getHospitalData() {
    return new Promise((resolve, reject) => {
      getHospitalData().then(({ data }) => {
        const current = data.length ? data[0] : null
        if (current) {
          this.setCurrentOrg(current)
        }
        this.state.sOrgList = data.map((item: any) => ({
          sOrgId: item.sOrgId,
          sOrgName: item.sOrgName
        }))
        resolve(data)
      }).catch((error) => {
        reject(error)
      })
    })
  }
  // 获取用户的未读消息数量
  public getMessageData() {
    return new Promise((resolve, reject) => {
      getMessageData().then(({ data }) => {
        let num = 0
        if (data) {
          num = data.reduce((pre: number, curr: any) => {
            return pre + curr.nStockNum
          }, 0)
        }
        this.state.messageDataNum = num
        resolve(data)
      }).catch((error) => {
        reject(error)
      })
    })
  }

  protected data(): UserType {
    return state
  }
}

export default new UserStore()
