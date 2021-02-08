let c;
let ctx;
let colors

window.onload = init;

function init(){
    c = document.querySelector('canvas')
    ctx = c.getContext('2d')
    resize()

    rx = random(-smallestDim/2, smallestDim/2-40)
    rw = random(50, 75)
    h = getHighScore()
    x = random(-smallestDim/2, smallestDim/2-5)
    background.src = './images/background.jpg'
    play.src = './images/play.png'
    pause.src = './images/pause.png'
    next.src = './images/next.png'
    last.src = './images/last.png'

    onYouTubePlayerAPIReady()
    window.requestAnimationFrame(gameLoop)
}

function gameLoop(timeStamp){
    window.onresize = resize()

    draw()

    window.requestAnimationFrame(gameLoop)
}

let smallestDim

function resize(){
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    if(c.width<=c.height - 60){
        smallestDim = c.width
    } else {
        smallestDim = c.height - 60
    }
}

function getHighScore(){
    let cookie = document.cookie
    for(let i = 0; i < cookie.length; i++){
        if(cookie[i] === 'h' && cookie[i+1] === '='){
            let v = ''
            for(let j = i+2; j<cookie.length; j++){
                v+=cookie[j]
            }
            return v
        }
    }
    return 0
}


const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let x
let d = 1
let s = 0
let b = 0
let rx
let rw
let h
let m = 0
let a = 0
let ytApiKey = "AIzaSyC19qX36WyFSiTJ1JHYVYMXEzz6y2HPoqA"
let newList = document.getElementById("Url")

document.addEventListener('click', click => {
    if(s===0){
        newList.style.visibility = "visible"
        s=5
        player.playVideo()
    }
    if(click.clientY >= c.height-80 && click.clientY <= c.height-25){
        if(click.clientX >= c.width-50){
            player.nextVideo()
        } else if(click.clientX >= c.width-100){
            player.pauseVideo()
        } else if(click.clientX >= c.width-150){
            player.playVideo()
        } else if(click.clientX >= c.width-200){
            player.previousVideo()
        }
    } else if(click.clientY >= c.height-25){
        if (click.clientX >= c.width-537 && click.clientX <= c.width-513){
            playerLoaded = false
            player.cuePlaylist({
                listType:'playlist',
                list: getID(newList.value)
            })
            setTimeout(() => {
                player.loadPlaylist({
                    listType:'playlist',
                    list: getID(newList.value)
                })
                setTimeout(() => {
                    player.setShuffle(true)
                    player.setLoop(true)
                    player.nextVideo()
                    player.playVideo()
                    playerLoaded = true

                }, 1000)
            }, 1000);
        }
    }
})

document.addEventListener("keydown", event => {
    if (event.isComposing || event.code === 229) {
      return;
    }
    if (event.code === 'Space') {
        flip()
    }
  })

function flip() {
    d*=-1
    if(x+20 >= rx && x <= rx+rw){
        b++
        m=0
        if(s < 10){
            s+=1
        }
        rx = random(-smallestDim/2, smallestDim/2-40)
        rw = random(50, 75)
        if(b > h){
            h=b
        }
        document.cookie = `h=${h}`
    } else if(s!=0){
        m++
        if(m > 1){
            rx = random(-smallestDim/2, smallestDim/2-40)
            rw = random(50, 75)
            b=0
            m=0
            s=5
        }
    }

}

let player
let playerLoaded
function onYouTubePlayerAPIReady() {
    player = new YT.Player('player', 
    {
        height: '390',
        width: '640',
        playerVars: 
        {
            listType:'playlist',
            list: 'PL6NdkXsPL07KiewBDpJC1dFvxEubnNOp1'
        },
        events: {
            onReady: function (e) {
                e.target.setShuffle(true)
                e.target.setLoop(true)
                e.target.nextVideo()
                e.target.pauseVideo()
                playerLoaded = true
            }
            
        }
    })
}

function getID(str) { 
    str = str.split('=')
    return str[str.length - 1]
}

function httpGet(url)
{
    var xmlHttp = new XMLHttpRequest()
    xmlHttp.open( "GET", url, false )
    xmlHttp.send( null )
    return xmlHttp.responseText
}

function wrapText(text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';

    for(var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = ctx.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.strokeText(line, x, y)
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      }
      else {
        line = testLine;
      }
    }
    ctx.strokeText(line, x, y)
    ctx.fillText(line, x, y);
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke, sWidth) {
    if (typeof stroke === 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
        let defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
        for (let side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.lineWidth = sWidth;
        ctx.stroke();
    }
  
  }

let videoId
let _videoId
let data
let background = new Image
let album = new Image
let play = new Image
let pause = new Image
let next = new Image
let last = new Image
let title
let googleProxyURL = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url='

function draw(){
    if(playerLoaded){
        videoId = getID(player.getVideoUrl())
        if(videoId!=_videoId){
            data = JSON.parse(httpGet("https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + videoId + "&key=" + ytApiKey))
            album.crossOrigin = 'Anonymous';
            album.src = googleProxyURL + data.items[0].snippet.thumbnails.standard.url
            title = data.items[0].snippet.title

            _videoId = videoId
        }
    }

    ctx.drawImage(background, 0, 0, c.width, c.height)    
    ctx.drawImage(last, c.width-200, c.height-80)
    ctx.drawImage(play, c.width-150, c.height-80)
    ctx.drawImage(pause, c.width-100, c.height-80)
    ctx.drawImage(next, c.width-50, c.height-80)


    roundRect(ctx, c.width-537, c.height-25, 24, 24, 4, false, true, 2)
   
    ctx.save()
    ctx.translate(c.width-537, c.height-25)

    ctx.beginPath()
    ctx.moveTo(7, 16)
    ctx.lineTo(17, 16)
    ctx.lineTo(12, 8)
    ctx.closePath()
    ctx.stroke()
    ctx.restore()

    ctx.translate(c.width/2,c.height/2)
    ctx.save()

    ctx.rotate(a)
    
    if(s!=0){a+=Math.PI/180}
    
    ctx.beginPath();
    ctx.arc(0, 0, smallestDim/2, 0, Math.PI * 2)
    ctx.clip()

    ctx.fillStyle = '#000000'
    ctx.fillRect(-smallestDim/2, -smallestDim/2, smallestDim, smallestDim)

    ctx.fillStyle = '#b330f0'
    ctx.fillRect(rx, (-c.width/2)-500, rw, c.width+1000)

    if(x > smallestDim/2){
        d*=-1
        x = smallestDim/2
    } else if( x < -smallestDim/2){
        d*=-1
        x = -smallestDim/2
    }
    ctx.fillStyle = '#6df030'
    ctx.fillRect(x, (-c.width/2)-500, 20, c.width+1000)

    for(let i = 0; i <= 7; i++){
        ctx.strokeStyle = '#454545'
        ctx.beginPath();
        ctx.arc(0, 0, smallestDim/6+i*35, 0, Math.PI * 2)
        ctx.stroke()
    }

    ctx.beginPath()
    ctx.arc(0, 0, smallestDim/6, 0, Math.PI * 2)
    ctx.clip()

    ctx.fillStyle = '#000000'
    let albumScale = 10/13
    ctx.fillRect(-smallestDim/6, -smallestDim/6, smallestDim/3, smallestDim/3)
    ctx.drawImage(album, -album.width*albumScale/2, -album.height*albumScale/2, album.width*albumScale, album.height*albumScale)
    
    ctx.strokeStyle = '#ffffff'

    ctx.font = 'bold 20px Verdana'
    ctx.textAlign = "center"
    if(title){
        wrapText(title, 0, -50, smallestDim/4, 24)
    }

    ctx.restore()
    ctx.resetTransform()

    ctx.fillStyle = '#000000'
    ctx.font = 'bold 20px Verdana'

    x+=s*d

    if(s===0){
        newList.style.visibility = "hidden"
        ctx.fillRect(0,0,c.width,c.height)
        ctx.textAlign = "center"
        ctx.translate(c.width/2,c.height/2)
        ctx.strokeStyle = '#ffffff'
        ctx.fillStyle = '#ffffff'
        ctx.lineWidth = 5
        ctx.strokeRect(0-90, -25, 180, 50)
        ctx.fillText('CLICK TO BEGIN', 0, 7, 150)
    }

    ctx.resetTransform()

    ctx.textAlign = "left"
    ctx.fillText(`MISSES: ${m}`, 20, 30)
    ctx.fillText(`CURRENT SCORE: ${b}`, 20, 60)
    ctx.fillText(`HIGHSCORE: ${h}`, 20, 90)
    ctx.fillText(`SPEED: ${s}`, 20, 120)

}