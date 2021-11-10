import Cookies from 'js-cookie'

const RecentlyUsedKey = 'recentlyUsed'

export function getRecentlyUsed() {
  if (Cookies.get(RecentlyUsedKey)) {
    return JSON.parse(Cookies.get(RecentlyUsedKey))
  }
  return []
}

export function setRecentlyUsed(userList) {
  return Cookies.set(RecentlyUsedKey, userList, {
    expires: 7
  })
}

export function removeRecentlyUsed() {
  return Cookies.remove(RecentlyUsedKey)
}
