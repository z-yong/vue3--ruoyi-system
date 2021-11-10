import Cookies from 'js-cookie'

const settingKey = 'SETTING'

export function getSetting(key: string = ''): any {
  let setting: string = Cookies.get(settingKey)
  if (!key) {
    return setting
  }
  let value = null
  if (setting) {
    setting = JSON.parse(setting)
    value = setting[key]
  }
  return value
}

export function setSetting(key: string, value: string | number | boolean) {
  let setting: any = Cookies.get(settingKey) || '{}'
  if (setting) {
    setting = JSON.parse(setting)
  } else {
    setting = {}
  }
  setting[key] = value
  setting = JSON.stringify(setting)
  Cookies.set(settingKey, setting, {
    expires: 365
  })
}

export function removeSetting() {
  return Cookies.remove(settingKey)
}
