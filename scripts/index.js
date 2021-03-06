//initialize

const firebaseConfig = {
  databaseURL: 'https://lazymanremotecontrol.firebaseio.com/',
  storageBucket: 'bucket.appspot.com'
}

const initialConfig = {
  playPause: false,
  volume: 50,
  channelStatus: 'none',
  inUse: false
}


let player = null,
    nowRef = null,
    database = null,
    hasLoaded = false


//Youtube API Function

const onPlayerReady = () => {
  if (hasLoaded) return
  nowRef = getNewUniqRef()
  nowRef.set(initialConfig)
  document.querySelector('.qrcode-block')
    .appendChild(buildQrcode(nowRef.key))

  bindingControlerHandler()
  bindingPlayBtnHandler()
  bindingVolumeHandler()
  bindingChannelHandler()
  hasLoaded = true;
}

const onYouTubeIframeAPIReady = () => {
  player = new YT.Player('myVideo', {
    events: {
      'onReady': onPlayerReady
    }
  })
}

//initialize

const initialize = () => {
  window.firebase.initializeApp(firebaseConfig)
  window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady
  window.loadingYTApi = loadingYTApi

  database = window.firebase.database()
  window.onbeforeunload = (e) => {
    if (nowRef) database.ref().child(nowRef.key).remove()
  }

  window.onload = () => {
    if (navigator.userAgent.match(/iPhone|Android/)) {
      displayErrorBlock({
        title: 'Does not support Mobile!',
        content: 'please use Desktop device to open this page.'
      })
    }
  }
}

//setting function

const getNewUniqRef = () => database.ref().push()

const buildQrcode = (postID) => {
  const img = document.createElement('img')
  const imgSize = window.screen.width > 1366 ? 150 : 120
  const url = `${window.location.origin}/EasyChannel/pages/remote_control?id=${postID}`
  img.src = `http://chart.apis.google.com/chart?cht=qr&chl=${url}&chs=${imgSize}x${imgSize}`

  return img
}

const displayErrorBlock = (msg) => {
  const errorBlock = document.getElementById('error-block')
  const root = document.querySelector('.root')

  root.style.setProperty('display', 'none')
  errorBlock.style.setProperty('visibility', 'visible')
  errorBlock.children[0].textContent = msg.title
  errorBlock.children[1].textContent = msg.content
}


//binding handler function

const bindingPlayBtnHandler = () => {
  database.ref(`${nowRef.key}/playPause`).on('value', res => {
    if (res.val()) {
      player.playVideo()
    } else {
      player.pauseVideo()
    }
  })
}

const bindingVolumeHandler = () => {
  player.setVolume(50) //default
  database.ref(`${nowRef.key}/volume`).on('value', res => {
    player.setVolume(res.val())
  })
}

const bindingChannelHandler = () => {
  database.ref(`${nowRef.key}/channelStatus`).on('value', res => {
    const action = {
      'next': () => { player.nextVideo() },
      'previous': () => { player.previousVideo() },
    }
    if (res.val() === 'none') return
    action[res.val()]()
    database.ref(`${nowRef.key}/channelStatus`).set(('none'))
  })
}

const bindingControlerHandler = () => {
  const remoteControl = document.querySelector('.control')
  remoteControl.addEventListener('click', () => {
    const qrcodeBlock = document.querySelector('.qrcode-block')
    if (qrcodeBlock.className.match(/active/)) {
      qrcodeBlock.classList.remove('active')
    } else {
      qrcodeBlock.classList.add('active')
    }
  })
}

//load youtube api

const loadingYTApi = () => {
  let tag = document.createElement('script')
  tag.src = 'https://www.youtube.com/iframe_api'
  let firstScriptTag = document.getElementsByTagName('script')[0]
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
}


initialize()
