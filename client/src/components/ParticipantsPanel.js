import React from 'react'

// import ParticipantDiv from 'ParticipantDiv';

const ParticipantsPanel = (props) => {
    return (
        <div id="participants_div" style={{height: '100vh', backgroundColor: '#20232A',padding:'1rem',borderColor:'#242633'}}>
            <h4 style={{marginTop:'1rem',lineHeight:'1rem'}}>Participants</h4><hr/>
            {props.children}
            {/* <div style={{marginBottom:'1rem'}}>Paras Gupta<FaMicrophoneSlash style={{fontSize:'1.4rem',float:'right',marginLeft:'0.6rem'}}/><FaVideoSlash style={{fontSize:'1.4rem',float:'right'}}/></div>
            <div style={{marginBottom:'1rem'}}>Paras<TiMicrophoneOutline style={{fontSize:'1.4rem',float:'right',marginLeft:'0.6rem'}}/><BsCameraVideo style={{fontSize:'1.4rem',float:'right'}}/></div>
            <div style={{marginBottom:'1rem'}}>Paras Gupta<FaMicrophoneSlash style={{fontSize:'1.4rem',float:'right',marginLeft:'0.6rem'}}/><FaVideoSlash style={{fontSize:'1.4rem',float:'right'}}/></div> */}

        </div>
    )
}

export default ParticipantsPanel
