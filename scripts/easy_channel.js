const bindingURLClickHandler = val => {
  /* 目前只支援播放清單 單一影片支援功能預計之後補上 */

  if (val.match('//www.youtube.com/') && val.match('list')) {
    setIframeSrc(document.querySelector('#myVideo'), val)
  } else {
    inputErrorHandler()
  }
  return false
}

const setIframeSrc = (iframe, val) => {
  if(!iframe) return

  const url = convertToEmbed(val)
  iframe.src = `${url}&enablejsapi=1&html5=1&loop=1`
  window.loadingYTApi()
  hide(document.querySelector('.customer-input'))

  iframe.onload = () => {
    show(iframe)
  }
}

const convertToEmbed = url => {
  if (url.match('embed')) {
    return url
  }
  /* 目前只支援播放清單 單一影片支援功能預計之後補上 */

  if (url.match('list')) {
    url = url.replace(url.substr(url.indexOf('?'), url.indexOf('&') - url.indexOf('?')), '')
             .replace(url.match('playlist') ? 'playlist?' : 'watch', 'embed/videoseries?')
  } else if (url.match('youtu.be')){
    url = url.replace('youtu.be','www.youtube.com/embed')
  }

  return url
}

const inputErrorHandler = () => {
  alert('Please input correct url of your playlist!!')
  document.querySelector('#urlInput').value = ''
}

const show = elem => {
  elem.classList.add('show')
}

const hide = elem => {
  elem.classList.add('hide')
}

