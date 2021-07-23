import React,{useEffect,useRef, useState} from 'react'
import { FaAngleUp, FaCopy} from "react-icons/fa";
import {ToastsContainer, ToastsStore} from 'react-toasts';


const ShareDetails = (props) => {
    const copyText = useRef()
    useEffect(()=>{
        copyText.current.value = 'http://localhost:3000/'+props.roomid;
    },[]);
    const copyToClipboard = ()=>{
        copyText.current.select();
        copyText.current.setSelectionRange(0, 99999);
        document.execCommand("copy");
       ToastsStore.success("Copied to clipboard",2000,'toastup');
    }
    
    return (
        <>
            <button  type="button" className="btn" style={{color: 'white', borderColor: 'white', float: 'left',marginTop:'0.5rem'}} data-bs-toggle="modal" data-bs-target="#staticBackdrop">
            Share Details&nbsp; <FaAngleUp style={{verticalAlign: 'unset'}}/>
            </button>

            <div className="modal fade" id="staticBackdrop" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" style={{color: 'black'}} id="staticBackdropLabel">Share Meeting Details</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <div className="container input-group" style={{marginTop: '1rem',marginBottom: '1rem'}}>
                        <input className="form-control col-sm-9" readOnly={true} id="copyinput" ref={copyText} type="text"/>
                        <button className="btn btn-dark col-sm-3" onClick={copyToClipboard}>Copy&nbsp;&nbsp;<FaCopy/></button>
                    </div>
                </div>
                {/* <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary">Understood</button>
                </div> */}
                </div>
            </div>
            </div>
            <ToastsContainer store={ToastsStore}/>
        </>
    )
}

export default ShareDetails
