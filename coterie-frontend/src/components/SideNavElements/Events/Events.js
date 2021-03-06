import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Event from './Event';
import EventForm from './EventForm';


const Events = (props) => {
  const [eventsList, setEventsList] = useState(null);
  const [visibility, setVisibility] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const orgID = sessionStorage.getItem('orgID');

  const url = `${process.env.REACT_APP_API_BASE_URL}/users/${props.userID}/organizations/${orgID}/events`

  const updateURL = `${process.env.REACT_APP_API_BASE_URL}/events`

  const addEvent = (eventObj) => {
    //remove unnecessary id property
    delete eventObj["id"];

    axios.post(url, eventObj)
    .then((response) => {
      setErrorMessage(`Event ${eventObj["name"]} added`);
      window.location.reload();
    })
    
    .catch((error) => {
      setErrorMessage(error.message);
      console.log(`Unable to add event: ${errorMessage}`);
    })
  }

  const updateEvent = (eventObj) => {
    axios.put(`${updateURL}/${eventObj.id}`, eventObj)
    .then((response) => {
      setErrorMessage(`Event ${eventObj["name"]} was updated`);
      window.location.reload();
    })
    
    .catch((error) => {
      setErrorMessage(error.message);
      console.log(`Unable to add event: ${errorMessage}`);
    })
  }
  
  const deleteEvent = (eventID) => {
    axios.delete(`${updateURL}/${eventID}`)
    .then((response) => {
      setErrorMessage(`Event ${eventID["name"]} was deleted`);
      window.location.reload();
    })
    
    .catch((error) => {
      setErrorMessage(error.message);
      console.log(`Unable to delete event: ${errorMessage}`);
    })
  }

  //toggle visibility of event form component
  const toggleFormVisibility = () => {
    setVisibility(!visibility);
    return;
  }

  

  useEffect(() => {
    axios.get(url)
      .then( (response) => {
        const list = response.data;
        setEventsList(list);
      })
      .catch((error) => {
        setErrorMessage(error);
        console.log(`There was an error retrieving events: ${error}`)
      });
  },[url])

  let eventComponents = undefined
  if (eventsList !== null && eventsList.length > 0) {
    eventComponents = eventsList.map((e) => {
    return(
      <Event
      key={e.id}
      id={e.id}
      name={e.name}
      occasion={e.occasion}
      date={e.date}
      description={e.description}
      orgID={e.organization_id}
      submitEventCallback={updateEvent}
      deleteEventCallback={deleteEvent}
      />
    )
  })
}


  return (
    <div className="container">
      <div className="d-flex list-group">
        <div className="d-flex py-2 justify-content-between">
          <h4>Events</h4>
          <button className="btn btn-secondary" onClick={toggleFormVisibility}>{ visibility ? "-" : "+"}</button>
        </div>
        <p className={ eventComponents !== undefined ? "hidden" : "open-sans" }>You haven't created any events yet.</p>
        <EventForm 
        orgID={orgID}
        visibility={visibility}
        submitEventCallback={addEvent}
        onSubmitCallback={toggleFormVisibility}
        />
        {eventComponents}
      </div>
    </div>
  )
}

export default Events;

