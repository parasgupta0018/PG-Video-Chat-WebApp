import React,{useState, useEffect, useRef} from 'react'
import { FaMicrophoneSlash } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";

const OtherVideos = (props) => {
    const ref = useRef();
    const [muted, setMuted] = useState(props.stream.initAudio);

    useEffect(() => {
            ref.current.srcObject = props.stream.stream;
            ref.current.addEventListener('loadedmetadata', () => {
                ref.current.play()
            })
            props.socket.on("muteuser",(userid,mute)=>{
                if(userid === props.stream.id){
                    setMuted(mute)
                }
            })
            console.log(props.stream.stream.getVideoTracks()[0]);

    },[])
    return (
        <div className="participants" id={props.stream.id+ "-name"} >
            <video className="videoElement" id={props.stream.id} ref={ref} width="100%"></video>                
            <div className="name-tag">{props.stream.name}</div>
            <div className="mic-tag">{muted ? <BsThreeDots/> : <FaMicrophoneSlash style={{color:'red'}}/>}</div>
        </div>
            
    )
}

export default OtherVideos
