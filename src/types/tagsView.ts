import { RouteLocationNormalizedLoaded } from 'vue-router'

export type TagsType = RouteLocationNormalizedLoaded & {
  title?: string;
  fullPath?: string;
  to?: TagsType
}

export interface TagsViewType extends Object {
  visitedViews: TagsType[];
  cachedViews: string[];
}
