//initialize

const firebaseConfig = {
  databaseURL: 'https://lazymanremotecontrol.firebaseio.com/',
  storageBucket: 'bucket.appspot.com'
}

const initailConfig = {
  playPause: false,
  volume: 50,
  channelStatus: 'none',
  inUse: false
}

window.firebase.initializeApp(firebaseConfig)

let player = null,
  nowRef = null,
  database = window.firebase.database()

window.onbeforeunload = () => {
  database.ref().child(nowRef.key).remove()
}

window.onload = () => {
  if (navigator.userAgent.match(/iPhone|Android/)) {
    displayErrorBlock({
      title: 'Does not support Mobile!',
      content: 'please use Desktop device to open this page.'
    })
  }
}

//Youtube API Function

const onPlayerReady = event => {
  nowRef = getNewUniqRef()
  nowRef.set(initailConfig)
  document.querySelector('.qrcode-block')
    .appendChild(buildQrcode(nowRef.key))

  bindingPlayBtnHandler()
  bindingVolumeHandler()
  bindingChannelHandler()
}

const onYouTubeIframeAPIReady = () => {
  player = new YT.Player('myVideo', {
    events: {
      'onReady': onPlayerReady
    }
  })
}

window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady

//setting function

const getNewUniqRef = () => database.ref().push()

const buildQrcode = (postID) => {
  const img = document.createElement('img')
  const imgSize = window.screen.width > 1366 ? 150 : 120
  const url = `${window.location.origin}/RemoteControl/pages/remote_control?id=${postID}`
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

//load youtube api

let tag = document.createElement('script')
tag.src = 'https://www.youtube.com/iframe_api'
let firstScriptTag = document.getElementsByTagName('script')[0]
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
