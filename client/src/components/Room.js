import React, { useEffect, useRef, useState } from 'react'
import { validate } from 'uuid';
import Peer from "peerjs";
import { io } from 'socket.io-client';
import OtherVideos from './OtherVideos'
import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash, FaPhoneAlt } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import Footer from './Footer';
import ParticipantsPanel from './ParticipantsPanel';
import { ToastsContainer, ToastsStore } from 'react-toasts';
import ParticipantDiv from './ParticipantDiv';
import { TiMicrophoneOutline } from "react-icons/ti";
import { BsCameraVideo } from "react-icons/bs";
import { MdScreenShare } from "react-icons/md";
import Swal from 'sweetalert2'
import Chat from './Chat'
import logo from '../pg_video_call.png'

const Room = (props) => {

    const roomID = props.match.params.roomID
    const [streamId, setStreamID] = useState(null)
    const [streamData, setStream] = useState(null);
    const [chatStatus, setChatStatus] = useState(false)
    const [notify, setNotify] = useState(false);
    const [name, setName] = useState(sessionStorage.getItem('Name'))

    const [screenShareStatus, setSSStatus] = useState(false)
    const ssStatus = useRef()
    const ownStatus = useRef()

    const [ssStream, setSSStream] = useState(null);
    const [ssId, setSSId] = useState(null)

    const [audio, setAudio] = useState(sessionStorage.getItem('initaudio') === "true");
    const [video, setVideo] = useState(sessionStorage.getItem('initvideo') === "true");

    const [streams, setStreams] = useState([]);
    const streamRef = useRef();

    let peersRef = [];
    let answercalls = [];
    const ssbtn = useRef();
    const socketRef = useRef();

    var peer = new Peer();

    if (!validate(roomID)) {
        alert('Invalid room!! Redirect to Homepage?');
        window.location.href = "/";
    }

    const customAlert = async() => {
        try{  
            if(sessionStorage.getItem('Name')) return;  
            const name_res = await Swal.fire({
                title: 'Enter your Name: ',
                input: 'text',
                inputAttributes: {
                    style : 'color: black !important'
                },
                showCancelButton: true,
                allowOutsideClick: false,
                confirmButtonText: 'Enter Call',
                showLoaderOnConfirm: true,
                preConfirm: (name) => {
                    if(name.trim() === "") Swal.showValidationMessage(`Name is Required`)
                    else {sessionStorage.setItem('Name', name); return;}
                }
            }).then((result) => {
                if (result.isConfirmed) {window.location.reload()}
                if (result.dismiss === Swal.DismissReason.cancel) {
                window.location.href = "/";
                }
            })
        }
        catch(e){
            console.log('error',e);
        }
    }

    useEffect(() => {
        customAlert()
    },[])

    let username = sessionStorage.getItem('Name');
    useEffect(() => {

        if(name){

            socketRef.current = io('http://localhost:5000');       
            ssStatus.current = false;ownStatus.current = false;
            streamRef.current.muted = true;

            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {


                stream.getVideoTracks()[0].enabled = video
                stream.getAudioTracks()[0].enabled = audio

                setStream(stream);
                streamRef.current.srcObject = stream;
                streamRef.current.play();


                peer.on("call", (call) => {
                    call.answer(stream, { metadata: { name: username } });

                    call.on("stream", (userVideoStream) => {
                        if (call.metadata.ss) {
                            setSSStream(userVideoStream);
                            ssStatus.current = true;
                            changeLayoutSS(userVideoStream, call.peer, call.metadata.name);
                        } else {
                            if (!answercalls[call.peer]) {
                                setStreams(streams => [...streams, { id: call.peer, name: call.metadata.name, stream: userVideoStream, initAudio: call.metadata.audio, initVideo: call.metadata.video }]);
                                answercalls[call.peer] = true;
                                if (!ssStatus.current) changeLayout()
                            }
                        }
                    });
                });

                socketRef.current.on("user-connected", (user) => {
                    connectToNewUser(user, stream);
                });

                const connectToNewUser = (user, stream_rec) => {
                    var call = peer.call(user.id, stream_rec, { metadata: { ss: false, name: username, audio: stream_rec.getAudioTracks()[0].enabled, video: stream_rec.getVideoTracks()[0].enabled } });
                    
                    let li = document.createElement('li');li.className="user_connect_msg";
                    li.innerHTML = `<li class="user_connect_msg"><i>${user.name} has joined the chat</i></li>`
                    document.getElementById('all_messages').appendChild(li);

                    call.on("stream", (userVideoStream) => {
                        if (!peersRef[user.id]) {
                            setStreams(streams => [...streams, { id: user.id, name: user.name, stream: userVideoStream, initAudio: user.initAudio, initVideo: user.initVideo }]);
                            peersRef[user.id] = call;
                            if (!ssStatus.current) changeLayout()
                            ToastsStore.success(user.name + " has Connected", 2000, 'toastup');
                        }
                    });

                };

                socketRef.current.on('screenShare', (user) => {
                    let callss = peer.call(user.id, stream)
                    callss.on("stream", (ssStream) => {
                        setSSStream(ssStream);
                        ssStatus.current = true;
                        peersRef[user.id] = callss;
                        changeLayoutSS(ssStream, user.id, user.username);
                    })
                })

            });

            peer.on("open", (id) => {
                let initAudio = audio;
                let initVideo = video;
                var name = sessionStorage.getItem('Name');
                socketRef.current.emit("join-room", roomID, { name, id, initAudio, initVideo }, false);
                setStreamID(id);
            });

            socketRef.current.on("user-disconnected", (userId,name) => {
                if (peersRef[userId]) { peersRef[userId].close();}
                var element = document.getElementById(userId);
                var element_name = document.getElementById(userId + '-name');
                var element_participant = document.getElementById(userId + '-participant');
                if (element != null) element.remove();
                if (element_name != null) { element_name.remove(); }
                if (element_participant != null) { element_participant.remove(); }

                let li = document.createElement('li');li.className="user_connect_msg";
                li.innerHTML = `<li class="user_connect_msg"><i>${name} left the chat</i></li>`
                document.getElementById('all_messages').appendChild(li);

                if (!ssStatus.current) changeLayout()
            });
            socketRef.current.on("user-disconnected-ss", (userId) => {
                if (peersRef[userId]) { peersRef[userId].close();}
                ssStatus.current = false;
                var element = document.getElementById(userId + '-ss');
                var element_participant = document.getElementById(userId + '-ss-participant');
                if (element != null) element.remove();
                if (element_participant != null) { element_participant.remove(); }
                document.getElementById('videoGrid').style.marginTop = "1rem";
                changeLayout()
            });
            const createMessage = (message) => {
                let li = document.createElement('li');li.className = "rounded-3 message message-other";
                let li_html = `<span>${message.msg}</span><br/>
                <small><span class="chat_username">${message.username}</span><span class="chat_time">${message.time}</span></small>`;
                li.innerHTML = li_html;
                document.getElementById('all_messages').appendChild(li);
                if(!chatStatus) setNotify(true);
                let chat_window = document.getElementById('chat_window');
                chat_window.scrollTop = chat_window.scrollHeight
            }
            socketRef.current.off('createMessage', (message) => createMessage(message)).on('createMessage',(message) => createMessage(message))

            const shareScreen = () => {
                if(ssStatus.current) {alert('Someone is already sharing screen...');return;}
                
                navigator.mediaDevices.getDisplayMedia({ video: { cursor: "always" }, audio: { echoCancellation: true, noiseSuppression: true } })
                    .then((stream) => {
                        let peerss = new Peer()
                        peerss.on('open', (id) => {
                            
                            socketRef.current.emit("join-room", roomID, { id, username}, true)
                            setSSId(id);
                            ownStatus.current = true;
                            stream.getVideoTracks()[0].onended = () => {
                                socketRef.current.emit('disconnectss', roomID, id)
                                ownStatus.current = false
                            }
                        })
                        peerss.on('call', (call) => {
                            call.answer(stream)
                        })
                        socketRef.current.on("user-connected", (user) => {
                            if (ownStatus.current) peerss.call(user.id, stream, { metadata: { ss: true, name: username } });
                        });
        
                    })
            }
            ssbtn.current.addEventListener('click',shareScreen)
        }
        return function cleanup() {
            socketRef.current.removeAllListeners();
        };

    }, []);

    if(!name){
        return <div/>
    }
    
    const changeLayoutSS = (stream, id, name) => {
        let main = document.getElementById("main");
        let videogrid = document.getElementById("videoGrid")

        let div = document.createElement("div");
        let video = document.createElement("video");
        video.id = id + '-ss';
        video.className = "sharedScreen";
        video.srcObject = stream;
        video.play();

        let nameTag = document.createElement("div");
        nameTag.className = "name-tag"
        nameTag.innerHTML = name+" is Sharing Screen";

        div.id = id + "-ss-participant";
        div.className = "ss col-12"
        div.appendChild(video);
        div.appendChild(nameTag)

        main.insertBefore(div, main.firstElementChild)

        videogrid.style.gridTemplateColumns = "repeat(auto-fit, 18%)";
        videogrid.style.gridTemplateRows = "90%";
        videogrid.style.marginTop = "-11rem"
    }
    const changeLayout = () => {
        let elms = document.getElementsByTagName("video").length;
        let main = document.getElementById("videoGrid");
        if (elms === 1) {
            main.style.gridTemplateColumns = "65%"
            main.style.gridTemplateRows = "80%"
        } else if (elms === 2) {
            main.style.gridTemplateColumns = "45% 45%"
            main.style.gridTemplateRows = "90%"
        } else if (elms === 3 || elms === 4) {
            main.style.gridTemplateColumns = "31% 31%"
            main.style.gridTemplateRows = "40% 40%"
        } else {
            main.style.gridTemplateColumns = "30% 30% 30%"
            main.style.gridTemplateRows = "40% 40%"
        }
    }
    const playVideo = () => {
        if (video) {
            streamData.getVideoTracks()[0].enabled = false;
            setVideo(false)
            socketRef.current.emit('playVideo', roomID, streamId, false)

        } else {
            setVideo(true)
            streamData.getVideoTracks()[0].enabled = true;
            socketRef.current.emit('playVideo', roomID, streamId, true)
        }
    }

    const muteVideo = () => {
        if (audio) {
            streamData.getAudioTracks()[0].enabled = false;
            setAudio(false);
            socketRef.current.emit('muteVideo', roomID, streamId, false)
        } else {
            setAudio(true);
            streamData.getAudioTracks()[0].enabled = true;
            socketRef.current.emit('muteVideo', roomID, streamId, true)
        }
    }
    const endMeet = () => {
        window.location.href = "/";
    }
    

    let vidBtn, audBtn, mictag;
    if (video) vidBtn = < button className = "btn-av"data-bs-toggle = "tooltip" data-bs-placement = "top" title = "Stop Video" onClick = { playVideo } > < FaVideo style = {{ verticalAlign: 'unset' } }/></button > ;
    else vidBtn = < button data-bs-toggle = "tooltip" data-bs-placement = "top" title = "Resume Video" className = "btn-av red" onClick = { playVideo } > < FaVideoSlash style = {{ verticalAlign: 'unset' } }/> </button >

    if (!audio) {
        audBtn = <button data-bs-toggle = "tooltip" data-bs-placement = "top" title = "Unmute Audio" className = "btn-av red" onClick = { muteVideo } > < FaMicrophoneSlash style = {{ verticalAlign: 'unset' } }/></button >
        mictag = <FaMicrophoneSlash style = {{ color: 'red' } }/>
    } else {
        audBtn = <button data-bs-toggle = "tooltip" data-bs-placement = "top" title = "Mute Audio" className = "btn-av" onClick = { muteVideo } > < FaMicrophone style = {{ verticalAlign: 'unset' } }/></button > ;
        mictag = <BsThreeDots />
    }

    return ( 
        <>
        {
            (!name ? <div/> : <>
                <div className = "row" style = {{ display: 'flex', flexDirection: 'row' }} >
                <img src={logo} className="brand-logo"/>
                    <div className = "col-sm-9 col-xl-10" > 
                        <div id = "main" style = {{ width: '100%', height: '100%' }} className = "row" >
                            <div className = "col-12" id = "videoGrid" style = {{ display: 'grid', gridTemplateColumns: '65%', gridTemplateRows: '80%' } } >    
                                <div className = "participants" >
                                    <video className = "videoElement" width = "100%" ref = { streamRef } > </video> 
                                    <div className = "name-tag"> { username }(you) </div> 
                                    <div className = "mic-tag" > { mictag } </div> 
                                </div>                   
                                {streams.map(stream => <OtherVideos key = { stream.id } socket = { socketRef.current } stream = { stream }/>)} 
                            </div> 
                        </div> 
                        <ToastsContainer store = { ToastsStore }/> 
                    </div> 
                    <div className = "col-sm-3 col-xl-2" >
                        <Chat roomID = {roomID} username={username} streamId={streamId} socket = { socketRef.current } />
                        <ParticipantsPanel streams = { streams } socket = { socketRef.current } >
                            <div style = {{ marginBottom: '1rem' } } > { username }(you) { audio ? < TiMicrophoneOutline className = "audIcon" /> : < FaMicrophoneSlash className = "audIcon" /> } { video ? < BsCameraVideo className = "vidIcon" /> : < FaVideoSlash className = "vidIcon" /> } </div> 
                            {streams.map(stream => <ParticipantDiv key = { stream.id } socket = { socketRef.current } stream = { stream }/>)} 
                        </ParticipantsPanel>
                        
                    </div>
                    <Footer roomID = {roomID} notify={notify} setNotify = {setNotify} chatStatus = {chatStatus} setChatStatus = {setChatStatus}> 
                        { vidBtn } 
                        { audBtn } 
                        <button data-bs-toggle = "tooltip"data-bs-placement = "top"title = "End Meeting"className = "btn-av"onClick = { endMeet }><FaPhoneAlt style = {{verticalAlign: 'unset', color: '#BF2A21', backgroundColor: 'white' } }/></button >
                        <button data-bs-toggle = "tooltip"data-bs-placement = "top"title = "Share Screen"className = "btn-av" ref={ssbtn}><MdScreenShare style = {{verticalAlign: 'unset', backgroundColor: 'white' } }/></button >
                    </Footer> 
                </div> 
            </>)
        }
        </>
    )
}

export default Room