import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const Socket = () => {
  const [chat, setChat] = useState({ name: "", message: "" });
  const [allChat, setAllChat] = useState([]);
  const [chunk, setChunk] = useState("");
  const socket = io("http://localhost:4000");

  useEffect(() => {
    socket.on("message", ({ name, message }) => {
      setAllChat([...allChat, { name, message }]);
    });

    // socket.on('img-chunk', (chunk) => {
    // 	console.log(`data:image/jpeg;base64,${chunk}`)
    // 	setChunk(`data:image/jpeg;base64,${chunk}`)
    // })
  }, [socket]);

  const submit = (e) => {
    e.preventDefault();
    socket.emit("message", chat);
    setChat({ name: "", message: "" });
  };

  return (
    <div>
      <h1>room</h1>
      <input
        value={chat.name}
        name="name"
        onChange={(e) => setChat({ ...chat, name: e.target.value })}
        type="text"
      />
      <input
        value={chat.message}
        name="message"
        onChange={(e) => setChat({ ...chat, message: e.target.value })}
        type="text"
      />
      <button onClick={submit}>submit</button>
      {allChat.map((item, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h3>{item.name} :</h3>
          <h7>{item.message}</h7>
        </div>
      ))}
    </div>
  );
};

export default Socket;
