import { Store } from './index'
import { SettingType } from '@/types/setting'
import variables from '@/assets/styles/variables.scss'
import variablesElement from '@/assets/styles/element-variables.scss'
import defaultSettings from '@/settings'
import {
  setSetting,
  getSetting
} from '@/utils/setting'

const settings = getSetting()
if (!settings) {
  setSetting('theme', variablesElement.theme)
  setSetting('sideTheme', defaultSettings.sideTheme)
  setSetting('showSettings', defaultSettings.showSettings)
  setSetting('tagsView', defaultSettings.tagsView)
  setSetting('fixedHeader', defaultSettings.fixedHeader)
  setSetting('sidebarLogo', defaultSettings.sidebarLogo)
  setSetting('menuDrag', defaultSettings.menuDrag)
  setSetting('menuWidth', variables.sideBarWidthNumber)
}

const state: SettingType = {
  theme: getSetting('theme'),
  sideTheme: getSetting('sideTheme'),
  showSettings: getSetting('showSettings'),
  tagsView: getSetting('tagsView'),
  fixedHeader: getSetting('fixedHeader'),
  sidebarLogo: getSetting('sidebarLogo'),
  menuDrag: getSetting('menuDrag'),
  menuWidth: getSetting('menuWidth')
}

class SettingsStore extends Store<SettingType> {
  public changeSetting(key: string, value: string | number | boolean): void {
    if (this.state.hasOwnProperty(key)) {
      this.state[key] = value
      setSetting(key, value)
    }
  }

  protected data(): SettingType {
    return state
  }
}

export default new SettingsStore()
