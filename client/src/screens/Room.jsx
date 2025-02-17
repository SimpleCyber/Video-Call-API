import React, { useState, useEffect, useCallback } from "react";
import { useSocket } from "../context/SocketProviders";
import PeerService from "../service/peer";
import { ReactPlayer } from "react-player";

const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState();

  const handleUserJoin = useCallback((email, id) => {
    console.log("email joined in room", email, id);
    setRemoteSocketId(id);
  }, []);



  const handleIncomingCall = useCallback( async ({ from, offer }) => {
    setRemoteSocketId(from);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
    console.log(`Incoming Call`, from, offer);
    const ans = await PeerService.getAnswer(offer);
    socket.emit("call:accepted", { to: from, ans });
  },
  [socket]);




  

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const offer = await PeerService.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  useEffect(() => {
    socket.on("user:joined", handleUserJoin);
    socket.on('incoming:call',handleIncomingCall);
    return () => {
      socket.off("user:joined", handleUserJoin);
      socket.off('incoming:call',handleIncomingCall);
    };
  }, [socket, handleUserJoin, handleIncomingCall]);

  return (
    <div>
      <h1>Room Page</h1>
      <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
      {remoteSocketId && <button onClick={handleCallUser}>Call</button>}

      {myStream && (
        <>
          <h1>My stream</h1>
          <ReactPlayer
            playing
            muted
            height="150px"
            width="250px"
            url={myStream}
          />
        </>
      )}
    </div>
  );
};

export default RoomPage;
