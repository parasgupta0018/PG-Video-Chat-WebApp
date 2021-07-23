import 'logo.svg';
import React, { useRef, useState, useEffect} from 'react'

import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

const VideoStreamcomp = (props) => {
    
    const [stream, setStream] = useState(null);
    const [audio , setAudio] = useState(true);
    const [video , setVideo] = useState(true);

    const streamRef  = useRef();

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({
            video : true,
            audio: true
        }).then(stream => {
            setStream(stream);
            streamRef.current.srcObject = stream;
            streamRef.current.play();
            streamRef.current.muted =true;
        })
        
    }, [])

    const playVideo = () => {
        if(!video){
            stream.getVideoTracks()[0].enabled = true;
            setVideo(true);
            props.setVideo(true)
        }
        else{
            stream.getVideoTracks()[0].enabled = false;
            setVideo(false);
            props.setVideo(false)

        }
    }

    const muteVideo = () => {
        if(audio){
            setAudio(false);
            props.setAudio(false)
        }
        else{
            setAudio(true);
            props.setAudio(true)
        }
    }

    let vidBtn, audBtn;
    if(video) vidBtn = <button className="btn-av"  onClick={playVideo}><FaVideo style={{verticalAlign:'unset'}}/></button>

    else vidBtn = <button className="btn-av red" onClick={playVideo}><FaVideoSlash style={{verticalAlign:'unset'}}/> </button>

    if(audio) audBtn = <button className="btn-av" onClick={muteVideo}><FaMicrophone style={{verticalAlign:'unset'}}/></button>

    else audBtn = <button className="btn-av red" onClick={muteVideo}><FaMicrophoneSlash style={{verticalAlign:'unset'}}/></button>


    return (
        <div>
            <video className ="videoElementHome" ref={streamRef} width="92%" poster="./image.png"></video>
            <div className="container" style={{textAlign: 'center'}}>{vidBtn}
            {audBtn}</div>
        </div>
    )
}

export default VideoStreamcomp
