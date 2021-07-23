import React,{useEffect, useState} from 'react'
import { FaVideoSlash,FaMicrophoneSlash} from "react-icons/fa";
import { TiMicrophoneOutline } from "react-icons/ti";
import { BsCameraVideo } from "react-icons/bs";

const ParticipantDiv = (props) => {
    const [muted, setMuted] = useState(props.stream.initAudio);
    const [vid, setVideo] = useState(props.stream.initVideo);

    useEffect(() => {
            
            props.socket.on("muteuser",(userid,mute)=>{
                if(userid == props.stream.id){
                    console.log(userid+" : "+mute)
                    setMuted(mute)
                }
            })
            props.socket.on("playvid",(userid,play)=>{
                if(userid == props.stream.id){
                    console.log(userid+" : "+play)
                    setVideo(play)
                }
            })

    },[])
    return (
        <div id={props.stream.id+ "-participant"} style={{marginBottom:'1rem'}}>
            {props.stream.name}
            {muted ? <TiMicrophoneOutline className="audIcon" /> : <FaMicrophoneSlash className="audIcon"/>} 
            {vid ? <BsCameraVideo className="vidIcon"/> : <FaVideoSlash className="vidIcon"/>}
        </div>
    )
}

export default ParticipantDiv
