import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import './index.css';
import './style.css';
import Card from './Interview-Card';

function App() {
  const [candidateHistory, setCandidateHistory] = useState([]);
  const [interviewsToday, setInterviewsToday] = useState([]);
  const [interviewsTomorrow, setInterviewsTomorrow] = useState([]);
  const [interviewsOther, setInterviewsOther] = useState([]);
  const [newInterview, setNewInterview] = useState({
    name: '',
    role: '',
    date: '',
    // Add any additional fields for the interview form
    location: '',
  });


  useEffect(() => {
    axios.get('http://localhost:5000/api/interviews/today')
      .then(response => setInterviewsToday(response.data))
      .catch(error => console.error(error));
  
    axios.get('http://localhost:5000/api/interviews/tomorrow')
      .then(response => setInterviewsTomorrow(response.data))
      .catch(error => console.error(error));
  
    axios.get('http://localhost:5000/api/interviews/other')
      .then(response => setInterviewsOther(response.data))
      .catch(error => console.error(error));
  }, []);
  


  const handleReschedule = async (id, newDate) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/interviews/${id}`, { date: newDate });

      setInterviewsToday(prevInterviews => prevInterviews.map(interview => (interview._id === id ? response.data : interview)));
      setInterviewsTomorrow(prevInterviews => prevInterviews.map(interview => (interview._id === id ? response.data : interview)));
      setInterviewsOther(prevInterviews => prevInterviews.map(interview => (interview._id === id ? response.data : interview)));
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/interviews/${id}`);
      setInterviewsToday(prevInterviews => prevInterviews.filter(interview => interview._id !== id));
      setInterviewsTomorrow(prevInterviews => prevInterviews.filter(interview => interview._id !== id));
      setInterviewsOther(prevInterviews => prevInterviews.filter(interview => interview._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleJoinNow = async (id) => {
    // Add logic to handle the "Join Now" action
    console.log(`Join Now clicked for interview with ID: ${id}`);
  };

  const handleViewHistory = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/interviews/history/${id}`);
      setCandidateHistory(response.data);

      // Add code to display the history, e.g., show a modal
      console.log(`History for candidate with ID ${id}:`, response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    setNewInterview({
      ...newInterview,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateInterview = async () => {
    try {
      await axios.post('http://localhost:5000/api/interviews', newInterview);
      // Refresh the interview lists after creating a new interview
      axios.get('http://localhost:5000/api/interviews/today')
        .then(response => setInterviewsTomorrow(response.data))
        .catch(error => console.error(error));
      axios.get('http://localhost:5000/api/interviews/tomorrow')
        .then(response => setInterviewsTomorrow(response.data))
        .catch(error => console.error(error));

      axios.get('http://localhost:5000/api/interviews/other')
        .then(response => setInterviewsOther(response.data))
        .catch(error => console.error(error));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      
      <section>
        <h2>Create New Interview</h2>
        <div className="interview-card">
          <div>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" value={newInterview.name} onChange={handleInputChange} />
          </div>
          <div>
            <label htmlFor="role">Role:</label>
            <input type="text" id="role" name="role" value={newInterview.role} onChange={handleInputChange} />
          </div>
          <div>
            <label htmlFor="date">Date:</label>
            <input type="datetime-local" id="date" name="date" value={newInterview.date} onChange={handleInputChange} />
          </div>
          {/* Add any additional fields for the interview form */}
          <div>
            <label htmlFor="location">Location:</label>
            <input type="text" id="location" name="location" value={newInterview.location} onChange={handleInputChange} />
          </div>
          <button className='button' onClick={handleCreateInterview}>Create Interview</button>
        </div>
      </section>
     <div className='upcoming-interview-page'>

     <h1>Upcoming Interview</h1>
     </div>
  <section>
  <h2>Today</h2>
  {interviewsToday.length === 0 ? <p>No other interviews scheduled</p> :
    interviewsToday.map(interview => (
      <Card key={interview.id} handleCancel={handleCancel} handleJoinNow={handleJoinNow} handleReschedule={handleReschedule} interview={interview}/>

    ))
  }
</section>
      <section>
        <h2>Tomorrow</h2>
        {interviewsTomorrow.length === 0 ? <p>No interviews scheduled for tomorrow</p> :
          interviewsTomorrow.map(interview => (
            <Card key={interview.id} handleCancel={handleCancel} handleJoinNow={handleJoinNow} handleReschedule={handleReschedule} interview={interview}/>
          ))
        }
      </section>
  <section>
  <h2>Other dates</h2>
  {interviewsOther.length === 0 ? <p>No other interviews scheduled</p> :
    interviewsOther.map(interview => (
      <Card key={interview.id} handleCancel={handleCancel} handleJoinNow={handleJoinNow} handleReschedule={handleReschedule} interview={interview}/>
    ))
  }
</section>

    </div>
  );
}

export default App;