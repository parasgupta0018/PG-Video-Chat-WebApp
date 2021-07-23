import React from 'react'
import { FaUsers} from "react-icons/fa";


const Participants = (props) => {
    return (
        <>
        <button type="button" onClick={() => {props.toggle();props.setChatStatus(false)}} className="btn participant_btn" style={{width: '7rem',color: 'white',marginTop: '-0.5rem',lineHeight: '1rem',float: 'right'}}>
            <FaUsers style={{verticalAlign: 'unset',fontSize:'2rem'}}/><br/>
            Participants
        </button>
        </>
    )
}

export default Participants
