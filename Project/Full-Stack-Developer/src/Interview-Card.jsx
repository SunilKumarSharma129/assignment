import React,{useState} from "react"

export default function Card({interview, handleCancel, handleJoinNow, handleReschedule}){
    const [showOptions, setShowOptions]=useState(false)
    return (
<div key={interview._id} className="interview-card">
      <div>
        <h2>{interview.name}</h2>
        <p>Role: {interview.role}</p>
      </div>
      <div className='bt1'>
        <p>Date: {new Date(interview.date).toLocaleString()}</p>
       
        <p className='view-history'>
          View History
        </p>
        <button className='button' onClick={() => handleJoinNow(interview._id)}>Join Now</button>
      </div>
      <div className="options-btn" onClick={()=>setShowOptions(f=>!f)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16"> <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/> </svg></div>
     {showOptions && <div className="options"> <button className="join-button" onClick={() => handleReschedule(interview._id, prompt('Enter new date:'))}>
          Reschedule
        </button>
        <button className="join-button" onClick={() => handleCancel(interview._id)}>
          Cancel
        </button></div>}
    </div>
    )
}