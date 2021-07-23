import React, {useState, useRef} from 'react'
import { IoIosSend } from "react-icons/io";
import { uuid } from 'uuidv4';

const Chat = ({roomID, username, streamId, socket}) => {
    const sendBtn = useRef();
    const messages = useRef();
    const inputElement = useRef();

    const checkInput = (input_val) => {
        if(input_val.trim() !== "") {sendBtn.current.disabled=false;sendBtn.current.addEventListener('click',sendMessage,{once: true});}
        else sendBtn.current.disabled=true;
    }

    const enterKey = (e) => {
        if(e.keyCode === 13) sendBtn.current.click();
    }
   
    const sendMessage = () => {
        let msg = inputElement.current.value.trim();
        
        let today = new Date();
        let hour = today.getHours() <= 9 ? '0'+today.getHours() : today.getHours();
        let min = today.getMinutes() <= 9 ? '0'+today.getMinutes() : today.getMinutes();
        var time = hour + ":" + min
        let msg_id = uuid();
        let msg_data = {msg,time,roomID,username,streamId,msg_id}
        displayMessgae(msg_data);
        socket.emit('message', msg_data);
        console.log("Ms : ",msg_data);
        inputElement.current.value = "";
        sendBtn.current.disabled=true;
    }
    const displayMessgae = (message) => {
        let li = document.createElement('li');li.className = "rounded-3 message message-own";
        let li_html = `<span>${message.msg}</span><br/>
        <small><span class="chat_username">you</span><span class="chat_time">${message.time}</span></small>`;
        li.innerHTML = li_html;
        messages.current.appendChild(li);
        document.getElementById('chat_window').scrollTop = document.getElementById('chat_window').scrollHeight
    }

    return (
        <div id="chat_div" className="root_chat" style={{display:'none', height: '100vh', backgroundColor: '#20232A',padding:'1rem',borderColor:'#242633'}}>
            <h4 className="chat_header" style={{marginTop:'1rem',lineHeight:'1rem'}}>Chat</h4><hr/>
            <div className="chat_window" id="chat_window">
                <ul ref={messages} className="messages" id="all_messages">
                    
                </ul>
            </div>
            <div className="message_container input-group rounded-pill" style={{marginTop:'1rem'}}>
                <input autoComplete='off' ref={inputElement} type="text" onKeyDown={(e) => {enterKey(e)}} onChange={(e) => {checkInput(e.target.value)}} className="form-control" id="chat_message" placeholder="Send a Message.." />
                <button id="send_btn" disabled ref={sendBtn} className="btn btn-primary"><IoIosSend style = {{fontSize:'1.4rem'}}/></button>
            </div>
      </div>
    )
}

export default Chat
