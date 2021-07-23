import React from 'react'
import { BiChat } from "react-icons/bi";
import { GoPrimitiveDot } from "react-icons/go";
const ChatBtn = (props) => {
    return (
        <button type="button" onClick={() => {props.toggle();props.setChatStatus(true);props.setNotify(false)}} className="btn participant_btn" style={{width: '7rem',color: 'white',position:'relative',marginTop: '-0.5rem',lineHeight: '1rem',float: 'right'}}>
            {props.notify && <GoPrimitiveDot style={{fontSize:'1.4rem',color:'yellow',position:'absolute',top:'0',left:'20'}} />}
            <BiChat style={{verticalAlign: 'unset',fontSize:'2rem'}}/><br/>
            Chat
        </button>
    )
}

export default ChatBtn
