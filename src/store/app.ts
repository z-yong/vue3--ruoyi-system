import { Store } from './index'
import Cookies from 'js-cookie'
import { AppType } from '@/types/app'

const state: AppType = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!Number(Cookies.get('sidebarStatus')) : true,
    withoutAnimation: false
  },
  device: 'desktop',
  size: Cookies.get('size') || 'medium'
}

class AppStore extends Store<AppType> {
  public toggleSidebar(): void {
    const opened = this.state.sidebar.opened
    this.state.sidebar = {
      opened: !opened,
      withoutAnimation: false
    }
    Cookies.set('sidebarStatus', opened ? '1' : '0')
  }

  public closeSideBar(withoutAnimation: boolean): void {
    Cookies.set('sidebarStatus', '0')
    this.state.sidebar = {
      opened: false,
      withoutAnimation
    }
  }

  public toggleDevice(device: string): void {
    this.state.device = device
  }

  public setSize(size: string): void {
    this.state.size = size
    Cookies.set('size', size)
  }

  protected data(): AppType {
    return state
  }
}

export default new AppStore()
