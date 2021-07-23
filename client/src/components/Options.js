import React, {useRef,useState,useEffect} from 'react'
import { useHistory } from "react-router-dom";
import { uuid } from 'uuidv4';
import VideoStreamcomp from './VideoStreamcomp';
import logo from '../pg_video_call.png'


const Options = (props) => {
    const joinId = useRef();
    const joinName = useRef();
    
    const [audio , setAudio] = useState(true);
    const [video , setVideo] = useState(true);

    useEffect(() => {
        sessionStorage.clear();
    },[]);

    const newRoom = () => {
        let roomid = uuid();
        window.location.href = `/${roomid}`;
        if( joinName.current.value === "") sessionStorage.setItem("Name", "Guest");
        else sessionStorage.setItem("Name", joinName.current.value);
        sessionStorage.setItem("initaudio", audio);
        sessionStorage.setItem("initvideo", video);
    }
    const goToRoom = () => {
        window.location.href = `/${joinId.current.value}`;
        if( joinName.current.value === "") sessionStorage.setItem("Name", "Guest");
        else sessionStorage.setItem("Name", joinName.current.value);
        sessionStorage.setItem("initaudio", audio);
        sessionStorage.setItem("initvideo",video);
    }
    const setAudiofn = (val) => {setAudio(val)}
    const setVideofn = (val) => {setVideo(val)}

    return (
        <div className="row" style={{ height: '99vh'}}>
            <div className="col-sm-6" style={{ height: 'min-content',marginTop: 'auto',marginBottom: 'auto'}}>
                <div className="container" style={{marginTop: '1rem',marginBottom: '1rem'}}>
                    <div className="input-group">
                        <span className="input-group-text">Enter Username</span>
                        <input className="form-control" ref={joinName} type="text" placeholder="Guest" />
                    </div>
                    
                </div>
                <VideoStreamcomp setAudio={setAudiofn} setVideo={setVideofn}/>
            </div>
            <div className="col-sm-6" style={{ height: 'min-content',marginTop: 'auto',marginBottom: 'auto'}}>
                <div style={{display: 'flex',marginBottom: '5rem', justifyContent: 'center'}}>
                    <img src={logo}></img><p style={{fontSize: '3.6rem', fontWeight: 'bold'}}>PG VIDEO CHAT</p>
                </div>
                <div className="container input-group" style={{marginTop: '1rem',marginBottom: '1rem'}}>
                    <input className="form-control col-sm-9" ref={joinId} type="text" placeholder="Enter room Id" />
                    <button className="btn btn-primary col-sm-3"onClick={goToRoom}>Join Room</button>
                </div >
                <pre style={{textAlign: 'center',fontFamily:'system-ui'}}>-------------------OR--------------------</pre>
                <div className="container input-group" style={{marginTop: '1rem',marginBottom: '1rem'}}><button style={{width: '100%'}} className="btn btn-primary"onClick={newRoom}>Create Room</button></div>
            </div>
        </div>
    )
}

export default Options
