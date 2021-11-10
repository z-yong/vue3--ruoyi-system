<template>
  <div ref="rightPanel" :class="{ show: show }" class="rightPanel-container">
    <div class="rightPanel-background" />
    <div class="rightPanel">
      <div class="rightPanel-items">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { computed, ref, reactive } from '@vue/reactivity'
import settingsStore from '@/store/settings'
import { addClass, removeClass } from '@/utils'
import { defineComponent } from 'vue'
import { watch, onMounted, onBeforeUnmount } from 'vue'
export default defineComponent({
  props: {
    clickNotClose: {
      default: false,
      type: Boolean,
    },
    buttonTop: {
      default: 250,
      type: Number,
    },
  },
  setup(props) {
    const show = computed({
      get() {
        return settingsStore.getState().showSettings
      },
      set(val) {
        settingsStore.changeSetting('showSettings', val as boolean)
      },
    })

    watch(
      () => show.value,
      (val) => {
        if (val && !props.clickNotClose) {
          addEventClick()
        }
        if (val) {
          addClass(document.body, 'showRightPanel')
        } else {
          removeClass(document.body, 'showRightPanel')
        }
      }
    )

    const addEventClick = () => {
      window.addEventListener('click', closeSidebar)
    }

    const closeSidebar = (evt) => {
      const parent = evt.target.closest('.rightPanel')
      if (!parent) {
        show.value = false
        window.removeEventListener('click', closeSidebar)
      }
    }

    const rightPanel = ref()
    const insertToBody = () => {
      const body = document.querySelector('body') as HTMLElement
      body.insertBefore(rightPanel.value, body.firstChild)
    }

    onMounted(() => {
      insertToBody()
      addEventClick()
    })

    onBeforeUnmount(() => {
      rightPanel.value.remove()
    })

    return { show, rightPanel }
  },
})
</script>

<style lang="scss" scoped>
.rightPanel-background {
  position: fixed;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
  background: rgba(0, 0, 0, 0.2);
  z-index: -1;
}

.rightPanel {
  width: 100%;
  max-width: 260px;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.05);
  transition: all 0.25s cubic-bezier(0.7, 0.3, 0.1, 1);
  transform: translate(100%);
  background: #fff;
  z-index: 40000;
}

.show {
  // transition: all 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);

  .rightPanel-background {
    z-index: 20000;
    opacity: 1;
    width: 100%;
    height: 100%;
  }

  .rightPanel {
    transform: translate(0);
  }
}

.handle-button {
  width: 48px;
  height: 48px;
  position: absolute;
  left: -48px;
  text-align: center;
  font-size: 24px;
  border-radius: 6px 0 0 6px !important;
  z-index: 0;
  pointer-events: auto;
  cursor: pointer;
  color: #fff;
  line-height: 48px;
  i {
    font-size: 24px;
    line-height: 48px;
  }
}
</style>
