## Easy Channel ( Youtube player with remote controller )
To help you control video easier

### Description

Easy Channel 能夠用手機控制 Desktop browser 達到遙控器的效果，讓使用者有更好的影片觀賞體驗，並解決了人與裝置間因距離無法溝通而產生的問題。

### Clone

```
git clone git@github.com:ShuuZhu/EasyChannel.git
```

### Enviroment

#### http-server

Install

```
npm install -g http-server --save
```

Use

```
http-server -S
```

### Features

1. Play / Pause
2. Volume up / Volume down
3. Next video / Previous video
4. One container has only one unique remote control
5. Block duplicate user (remote control)
6. Block desktop mode (remote control)
7. Block mobile mode (container)
8. User can input their own link in container and play (Add 2/19)


### TODO

1. ~~User can input their own link in container and play (DONE)~~
2. Fullscreen (must resolve user gesture problem)
3. Search video
4. Permission management of firebase database
5. Uglify and minify js code by package tool


### References

- [Firebase](https://firebase.google.com/?hl=zh-tw)  (Realtime database)
- [Vanilla JS](http://vanilla-js.com/)
- [Youtube API](https://developers.google.com/youtube/iframe_api_reference)
- [Google Charts API](https://developers.google.com/chart/?hl=zh-TW) (To Generate QR code)


### Demo

[EasyChannel]( https://shuuzhu.github.io/EasyChannel/)



