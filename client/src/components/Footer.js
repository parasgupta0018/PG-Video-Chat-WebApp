import React from 'react'
import ShareDetails from './ShareDetails'
import Participants from './Participants'
import ChatBtn from './ChatBtn'

const Footer = (props) => {
    const toggleDiv = () => {
        let p = document.getElementById("participants_div");
        let c = document.getElementById("chat_div");
        if (p.style.display === "none") {
            p.style.display = "block";
            c.style.display = "none";
        } else {
            p.style.display = "none";
            c.style.display = "block";
        }
    }
    return (
        <div className="footer" style={{marginLeft: '0.7rem'}}>
            {props.children}
            <ShareDetails roomid = {props.roomID}></ShareDetails>
            {props.chatStatus ? <Participants setChatStatus={props.setChatStatus} toggle={toggleDiv}/> : <ChatBtn setNotify={props.setNotify} toggle={toggleDiv} notify={props.notify} setChatStatus={props.setChatStatus}/>}
        </div>
    )
}

export default Footer
