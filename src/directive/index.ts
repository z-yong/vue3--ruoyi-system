import userStore from '@/store/user'

export default (app) => {
  // v-dialogDrag 弹窗拖拽位置
  app.directive('dialogDrag', {
    mounted(el, binding, vnode) {
      const dragDom: HTMLElement | null = document.querySelector(`.${binding.arg}`);
      if (!dragDom) {
        return
      }
      const dialogHeaderEl: HTMLElement | null = dragDom.querySelector('.el-dialog__header');
      if (!dialogHeaderEl) {
        return
      }
      // dialogHeaderEl.style.cursor = 'move';
      dialogHeaderEl.style.cssText += ';cursor:move;'
      dragDom.style.cssText += ';top:0px;'

      // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
      const sty = (() => {
        // if (window.document && window.document.currentStyle) {
        //   return (dom, attr) => dom.currentStyle[attr];
        // } else {
        return (dom, attr) => getComputedStyle(dom)[attr];
        // }
      })()

      dialogHeaderEl.onmousedown = (e) => {
        // 鼠标按下，计算当前元素距离可视区的距离
        const disX = e.clientX - dialogHeaderEl.offsetLeft;
        const disY = e.clientY - dialogHeaderEl.offsetTop;

        const screenWidth = document.body.clientWidth; // body当前宽度
        const screenHeight = document.documentElement.clientHeight; // 可见区域高度(应为body高度，可某些环境下无法获取)

        const dragDomWidth = dragDom.offsetWidth; // 对话框宽度
        const dragDomheight = dragDom.offsetHeight; // 对话框高度

        const minDragDomLeft = dragDom.offsetLeft;
        const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth;

        const minDragDomTop = dragDom.offsetTop;
        const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight;


        // 获取到的值带px 正则匹配替换
        let styL: string | number = sty(dragDom, 'left');
        let styT: string | number = sty(dragDom, 'top');

        // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
        if (styL.includes('%')) {
          styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100);
          styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100);
        } else {
          styL = +styL.replace(/\px/g, '');
          styT = +styT.replace(/\px/g, '');
        };

        document.onmousemove = (event) => {
          // 通过事件委托，计算移动的距离
          let left = event.clientX - disX;
          let top = event.clientY - disY;

          // 边界处理
          if (-(left) > minDragDomLeft) {
            left = -(minDragDomLeft);
          } else if (left > maxDragDomLeft) {
            left = maxDragDomLeft;
          }

          if (-(top) > minDragDomTop) {
            top = -(minDragDomTop);
          } else if (top > maxDragDomTop) {
            top = maxDragDomTop;
          }

          // 移动当前元素
          dragDom.style.cssText += `;left:${left + Number(styL)}px;top:${top + Number(styT)}px;`;
        };

        document.onmouseup = () => {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      }
    }
  })

  // v-dialogDragSize 改变弹窗尺寸(右下角)
  app.directive('dialogDragSize', (el, binding) => {
    const dragDom: HTMLElement | null = document.querySelector(`.${binding.arg}`)
    if (!dragDom) {
      return
    }
    const lineEl = document.createElement('div')
    // @ts-ignore
    lineEl.style = 'width: 6px; background: inherit; height: 10px; position: absolute; right: 0; bottom: 0; margin: auto; z-index: 1; cursor: nwse-resize;';
    lineEl.addEventListener('mousedown',
      (e) => {
        console.log(el, el.offsetLeft)
        // 鼠标按下，计算当前元素距离可视区的距离
        const disX = e.clientX - el.offsetLeft;
        const disY = e.clientY;
        // 当前宽度 高度
        const curWidth = dragDom.offsetWidth;
        const curHeight = dragDom.offsetHeight;
        // tslint:disable-next-line
        document.onmousemove = (e) => {
          e.preventDefault(); // 移动时禁用默认事件
          // 通过事件委托，计算移动的距离
          const xl = e.clientX - disX;
          const yl = e.clientY - disY
          dragDom.style.width = `${curWidth + xl}px`;
          dragDom.style.height = `${curHeight + yl}px`;
        };
        document.onmouseup = () => {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      }, false);
    dragDom.appendChild(lineEl);
  })

  // v-hasPermi 按钮权限控制
  app.directive('hasPermi', (el, binding, vnode) => {
    const { value } = binding
    const allPermission = '*:*:*';
    const permissions = userStore.getState().permissions

    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value

      const hasPermissions = permissions.some((permission) => {
        return allPermission === permission || permissionFlag.includes(permission)
      })

      if (!hasPermissions) {
        // tslint:disable-next-line
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`请设置操作权限标签值`)
    }
  })
}
