const app = require("express")();
const http = require("http").createServer(app);
const child_process = require("child_process");
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const fs = require("fs");

// const imgFile = fs.readFileSync('./SampleVideo.mp4');
// const imgBase64 = new Buffer.from(imgFile).toString('base64')

// app.get('/', function (req, res) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.send({video: imgBase64});
// });

io.on("connection", (socket) => {
  // socket.on('image', ({name, message}) => {
  //   console.log({name, message})
  //   io.emit('message', {name, message})
  // })

  const ffmpeg = child_process.spawn("ffmpeg", [
    "-f",
    "lavfi",
    "-i",
    "anullsrc",
    "-i",
    "-",
    "-vcodec",
    "libx264",
    "-acodec",
    "aac",
    "-f",
    "flv",
    "rtmp://192.168.43.124/live/test",
  ]);

  ffmpeg.on("close", (code, signal) => {
    console.log(
      "FFmpeg child process closed, code " + code + ", signal " + signal
    );
  });

  ffmpeg.stdin.on("error", (e) => {
    console.log("FFmpeg STDIN Error", e);
  });

  ffmpeg.stderr.on("data", (data) => {
    console.log("FFmpeg STDERR:", data.toString());
  });

  socket.on("videotrack", (videotracks) => {
    // console.log("got tracks");
    ffmpeg.stdin.write(videotracks);
  });

  // socket.on('img', (image) => {
  //   console.log('got the image')
  //   io.emit('img', {img: image})
  //   console.log('sent the image')
  // })

  // socket.on('message', ({name, message}) => {
  //   console.log({name, message})
  //   io.emit('message', {name, message})
  // })
});

http.listen(4000, () => {
  console.log("server listening to port 4000");
});
