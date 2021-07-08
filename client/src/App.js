import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import Socket from "./Socket";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

function App() {
  // const [imgData, setImgData] = useState('');
  const [videos, setVideos] = useState("");

  useEffect(() => {
    // socket.on('img', (image) => {
    //   console.log(image)
    //   setImgData(image.img)
    // });
  }, []);

  const getFile = (e) => {
    console.log(e.target.files[0]);

    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      // log to console
      // logs data:<type>;base64,wL2dvYWwgbW9yZ...
      // socket.emit('img', reader.result)
    };
    reader.readAsDataURL(file);
  };

  navigator.mediaDevices
    .getUserMedia({ audio: true, video: true })
    .then(function (stream) {
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (event) => {
        const blob = event.data;

        const reader = new FileReader();
        reader.onloadend = () => {
          socket.emit("videotrack", reader.result);
        };
        reader.readAsDataURL(blob);
      };

      recorder.start(1000);

      // socket.emit('videotrack', JSON.stringify(stream))
      let video = document.getElementById("video-track");
      // Older browsers may not have srcObject
      if ("srcObject" in video) {
        video.srcObject = stream;
      } else {
        // Avoid using this in new browsers, as it is going away.
        video.src = window.URL.createObjectURL(stream);
      }
      video.onloadedmetadata = function (e) {
        video.play();
      };
    })
    .catch(function (err) {
      console.log(err.name + ": " + err.message);
    });

  // socket.emit('videotrack', stream)

  return (
    <div className="App">
      {/*<Socket/>*/}
      {/*<input type="file" onChange={getFile}/>*/}
      {/*<img style={{width: "50vw", height: "70vh"}} src={imgData} alt="img"/>*/}
      {/*<video controls src={`data:video/mp4;base64,${}`} />*/}
      <video controls autoPlay={true} id="receive_video" />
      <video id="video-track" />
    </div>
  );
}

export default App;
