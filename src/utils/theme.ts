import Message from '@/utils/message'

const ORIGINAL_THEME = '#409EFF'; // default color
let chalk
// tslint:disable-next-line
export default async function (val, callback: any = 'init') {
  const oldVal = chalk ? val : ORIGINAL_THEME;
  if (typeof val !== 'string') {
    return
  }
  const themeCluster = getThemeCluster(val.replace('#', ''));
  const originalCluster = getThemeCluster(oldVal.replace('#', ''));
  let $message
  if (callback !== 'init') {
    $message = Message({
      message: ' 主题颜色更改中...',
      customClass: 'theme-message',
      type: 'success',
      duration: 0,
      iconClass: 'el-icon-loading',
    })
  }
  const getHandler = (id) => {
    return () => {
      // tslint:disable-next-line
      const originalCluster = getThemeCluster(
        ORIGINAL_THEME.replace('#', '')
      )
      const newStyle = updateStyle(
        chalk,
        originalCluster,
        themeCluster
      );

      let styleTag = document.getElementById(id);
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.setAttribute('id', id);
        document.head.appendChild(styleTag);
      }
      styleTag.innerText = newStyle;
    };
  };

  if (!chalk) {
    const url = `./css/element.css`;
    await getCSSString(url);
  }

  const chalkHandler = getHandler('chalk-style');

  chalkHandler();

  const styles = [].slice.call(document.querySelectorAll('style')).filter((style: HTMLElement) => {
    const text = style.innerText;
    return (
      new RegExp(oldVal, 'i').test(text) && !/Chalk Variables/.test(text)
    );
  });
  styles.forEach((style: HTMLElement) => {
    const {
      innerText
    } = style;
    if (typeof innerText !== 'string') {
      return
    }
    style.innerText = updateStyle(
      innerText,
      originalCluster,
      themeCluster
    );
  });
  if (typeof callback === 'function') {
    callback()
  }
  if ($message) {
    $message.close();
  }
}


function updateStyle(style, oldCluster, newCluster) {
  let newStyle = style;
  oldCluster.forEach((color, index) => {
    newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index]);
  });
  return newStyle;
}

function getCSSString(url) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        chalk = xhr.responseText.replace(/@font-face{[^}]+}/, '');
        resolve('ok')
      }
    };
    xhr.open('GET', url);
    xhr.send();
  });
}

function getThemeCluster(theme): any {
  const tintColor = (color, tint) => {
    let red: string | number = parseInt(color.slice(0, 2), 16);
    let green: string | number = parseInt(color.slice(2, 4), 16);
    let blue: string | number = parseInt(color.slice(4, 6), 16);

    if (tint === 0) {
      // when primary color is in its rgb space
      return [red, green, blue].join(',');
    } else {
      red += Math.round(tint * (255 - red));
      green += Math.round(tint * (255 - green));
      blue += Math.round(tint * (255 - blue));

      red = red.toString(16);
      green = green.toString(16);
      blue = blue.toString(16);

      return `#${red}${green}${blue}`;
    }
  };

  const shadeColor = (color, shade) => {
    let red: string | number = parseInt(color.slice(0, 2), 16);
    let green: string | number = parseInt(color.slice(2, 4), 16);
    let blue: string | number = parseInt(color.slice(4, 6), 16);

    red = Math.round((1 - shade) * red);
    green = Math.round((1 - shade) * green);
    blue = Math.round((1 - shade) * blue);

    red = red.toString(16);
    green = green.toString(16);
    blue = blue.toString(16);

    return `#${red}${green}${blue}`;
  };

  const clusters = [theme];
  for (let i = 0; i <= 9; i++) {
    clusters.push(tintColor(theme, Number((i / 10).toFixed(2))));
  }
  clusters.push(shadeColor(theme, 0.1));
  return clusters;
}
