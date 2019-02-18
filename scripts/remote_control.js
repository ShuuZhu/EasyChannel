//initialize

const config = {
  databaseURL: 'https://lazymanremotecontrol.firebaseio.com/',
  storageBucket: 'bucket.appspot.com'
}

const errorMsg = {
  controlNotFound: {
    title: 'No Remote Control Found!!',
    content: `Your video page should be closed or refresh, 
              please open new video page and get uniq remote control key.`
  },
  duplicateUser: {
    title: 'Already In Use',
    content: `Your remote control is already in use,
              please close it in another device and try again`
  },
  usingDesktop: {
    title: 'Please open by your mobile device!!',
    content: 'to get your uniq remote control in your video page and open by mobile device.'
  }
}



window.firebase.initializeApp(config)
let isPlaying = false,
  nowVolume = 50,
  nowRef = null,
  database = window.firebase.database(),
  lastTouchEnd = 0,
  device = navigator.userAgent


window.onload = () => {
  if (!device.match(/iPhone|Android/)) {
    displayErrorBlock(errorMsg.usingDesktop)
  }
  nowRef = getNowRef()
  bindingRefEvent(nowRef)
  bindingCloseEvent()
  if(device.match(/iPhone|iPad/)) {
    blockDoubleTapAndPinch()
  }
}

//Binding

const blockDoubleTapAndPinch = () => {
  document.addEventListener('touchmove', event => {
    if (event.scale !== 1) { event.preventDefault() }
  }, false)

  document.addEventListener('touchend', event => {
    let now = (new Date()).getTime()
    if (now - lastTouchEnd <= 100) {
      event.preventDefault()
    }
    lastTouchEnd = now
  }, false)
}

const bindingCloseEvent = () => {
  let event = device.match(/iPhone|iPad/) ? 'unload' : 'beforeunload'
  window.addEventListener(event, () => {
    nowRef.child('inUse').set(false)
  })
}

const bindingRefEvent = ref => {
  ref.once('value', res => {
    if (res.exists()) {
      bindingPlayBtn()
      bindingVolumeBtn()
      bindingChannelBtn()
      showBtnArea()
    } else {
      displayErrorBlock(errorMsg.controlNotFound)
    }
  })

  ref.on('value', res => {
    if (!res.exists()) {
      displayErrorBlock(errorMsg.controlNotFound)
    }
  })

  ref.child('inUse').once('value', res => {
    if (res.val()) {
      displayErrorBlock(errorMsg.duplicateUser)
    } else {
      ref.child('inUse').set(true)
    }
  })

}

const bindingPlayBtn = () => {
  const playBtn = document.getElementById('playBtn')

  playBtn.addEventListener('click', () => {
    videoPlay(!isPlaying)
  })

  nowRef.child('playPause').on('value', res => {
    changePlayingState(res.val())
  })
}

const bindingVolumeBtn = () => {
  const volumeUpBtn = document.getElementById('volumeUpBtn')
  const volumeDownBtn = document.getElementById('volumeDownBtn')

  volumeUpBtn.addEventListener('click', () => {
    changeVolume(10)
  })
  volumeDownBtn.addEventListener('click', () => {
    changeVolume(-10)
  })

  nowRef.child('volume').on('value', res => {
    nowVolume = res.val()
  })
}

const bindingChannelBtn = () => {
  const nextVideoBtn = document.getElementById('nextVideoBtn')
  const prevVideoBtn = document.getElementById('prevVideoBtn')

  nextVideoBtn.addEventListener('click', () => {
    changeChannel('next')
  })
  prevVideoBtn.addEventListener('click', () => {
    changeChannel('previous')
  })
}

// Action

const videoPlay = (status) => {
  nowRef.child('playPause').set(status)
}

const changeVolume = (changeNum) => {
  nowVolume += changeNum
  nowRef.child('volume').set((nowVolume > 100 ? 100 : nowVolume < 0 ? 0 : nowVolume))
}

const changeChannel = (status) => {
  nowRef.child('channelStatus').set((status))
  changePlayingState(true)
  videoPlay(true)
}

const changePlayingState = (status) => {
  isPlaying = status
  const playIcon = document.getElementById('playIcon')
  const pauseIcon = document.getElementById('pauseIcon')

  playIcon.style.setProperty('display', isPlaying ? 'none' : 'block')
  pauseIcon.style.setProperty('display', isPlaying ? 'block' : 'none')
}

const displayErrorBlock = (msg) => {
  const errorBlock = document.getElementById('error-block')
  errorBlock.style.setProperty('visibility', 'visible')
  errorBlock.children[0].textContent = msg.title
  errorBlock.children[1].textContent = msg.content
}

const getNowRef = () => {
  let url = new URL(window.location.href)
  let params = {}
  let urlsp = new URLSearchParams(url.search.replace('?', ''))
  for (let pair of urlsp.entries()) {
    params[pair[0]] = pair[1]
  }
  return database.ref(params.id || "noUser")
}

const showBtnArea = () => {
  document.querySelector('.button-area').style.setProperty('visibility', 'visible')
}

