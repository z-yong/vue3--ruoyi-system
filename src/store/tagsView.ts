import { Store } from './index'
import { TagsType, TagsViewType } from '@/types/TagsView'
import { ref } from 'vue'

const state: TagsViewType = {
  visitedViews: [],
  cachedViews: []
}

class TagsViewStore extends Store<TagsViewType> {
  public addView(route: TagsType): void {
    this.addVisitedView(route)
    this.addCachedView(route)
  }

  public delView(route: TagsType) {
    return new Promise((resolve) => {
      Promise.all([
        this.delVisitedView(route),
        this.delCachedView(route)
      ]).then(() => {
        resolve({
          visitedViews: [...this.state.visitedViews],
          cachedViews: [...this.state.cachedViews]
        })
      })
    })
  }

  public addVisitedView(route: TagsType): void {
    if (this.state.visitedViews.some((v) => v.path === route.path)) {
      return
    }

    this.state.visitedViews.push(
      Object.assign({}, route, {
        title: route.meta ? route.meta.title || 'no-name' : 'no-name'
      })
    )
  }

  public delVisitedView(route: TagsType) {
    return new Promise((resolve) => {
      for (const [i, v] of this.state.visitedViews.entries()) {
        if (v.path === route.path) {
          this.state.visitedViews.splice(i, 1)
          break
        }
      }
      resolve([...this.state.visitedViews])
    })
  }

  public addCachedView(route: TagsType): void {
    if (!route.name || this.state.cachedViews.includes(route.name as string)) {
      return
    }
    if (route.meta && !route.meta.noCache) {
      this.state.cachedViews.push(route.name as string)
    }
  }

  public delCachedView(route: TagsType) {
    return new Promise((resolve) => {
      const index = this.state.cachedViews.indexOf(route.name as string)
      if (index > -1) {
        this.state.cachedViews.splice(index, 1)
      }
      resolve([...this.state.cachedViews])
    })
  }

  public delOthersViews(route: TagsType) {
    return new Promise((resolve) => {
      Promise.all([
        this.delOthersVisitedViews(route),
        this.delOthersCachedViews(route)
      ]).then(() => {
        resolve({
          visitedViews: [...this.state.visitedViews],
          cachedViews: [...this.state.cachedViews]
        })
      })
    })
  }

  public delOthersVisitedViews(route: TagsType) {
    return new Promise((resolve) => {
      this.state.visitedViews = this.state.visitedViews.filter((v) => {
        return (v.meta && v.meta.affix) || v.path === route.path
      })
      resolve([...this.state.visitedViews])
    })
  }
  public delOthersCachedViews(route: TagsType) {
    return new Promise((resolve) => {
      const index = this.state.cachedViews.indexOf(route.name as string)
      if (index > -1) {
        this.state.cachedViews = this.state.cachedViews.slice(index, index + 1)
      } else {
        this.state.cachedViews = []
      }
      resolve([...this.state.cachedViews])
    })
  }

  public delAllViews() {
    return new Promise((resolve) => {
      Promise.all([
        this.delAllVisitedViews(),
        this.delAllCachedViews()
      ]).then(() => {
        resolve({
          visitedViews: [...this.state.visitedViews],
          cachedViews: [...this.state.cachedViews]
        })
      })
    })
  }

  public delAllVisitedViews() {
    return new Promise((resolve) => {
      const affixTags = this.state.visitedViews.filter((tag) => tag.meta && tag.meta.affix)
      this.state.visitedViews = affixTags
      resolve([...this.state.visitedViews])
    })
  }

  public delAllCachedViews() {
    return new Promise((resolve) => {
      this.state.cachedViews = []
      resolve([])
    })
  }

  public updateVisitedView(route: TagsType): void {
    for (let v of this.state.visitedViews) {
      if (v.path === route.path) {
        v = Object.assign(v, route)
        break
      }
    }
  }

  protected data(): TagsViewType {
    return state
  }
}

export default new TagsViewStore()
