import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ScriptureForm from './ScriptureForm';
import Chapter from './Chapter';
import ChapterForm from './ChapterForm';
import axios from 'axios';

const Scripture = (props) => {
  const [chaptersList, setChaptersList] = useState(null);
  const [addChapterMode, setAddChapterMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [updateScriptureMode, setUpdateScriptureMode] = useState(false);

  //Scripture
  const updateScripture = (scripObj) => {
    props.submitScriptureCallback(scripObj)
  }

  const setUpdateScripture = () => {
    setUpdateScriptureMode(!updateScriptureMode);
  }

  const deleteScripture = () => {
    props.deleteScriptureCallback(props.id);
  }

  //Chapters
  const setAddChapter = () => {
    setAddChapterMode(!addChapterMode);
  }

  const url = `${process.env.REACT_APP_API_BASE_URL}/scriptures/${props.id}/chapters`

  const updateURL = `${process.env.REACT_APP_API_BASE_URL}/chapters`

  const addChapter = (chapObj) => {
    //remove unnecessary id property
    delete chapObj["id"];

    axios.post(url, chapObj)
    .then((response) => {
      setErrorMessage(`Chapter ${chapObj["name"]} added`);
      window.location.reload();
    })
    
    .catch((error) => {
      setErrorMessage(error.message);
      console.log(`Unable to add scripture: ${errorMessage}`);
    })
  }

  const updateChapter = (chapObj) => {
    axios.put(`${updateURL}/${chapObj.id}`, chapObj)
    .then((response) => {
      setErrorMessage(`Chapter ${chapObj["name"]} was updated`);
      window.location.reload();
    })
    
    .catch((error) => {
      setErrorMessage(error.message);
      console.log(`Unable to add scripture: ${errorMessage}`);
    })
  }

  const deleteChapter = (chapID) => {
    axios.delete(`${updateURL}/${chapID}`)
    .then((response) => {
      setErrorMessage(`Chapter ${chapID["name"]} was deleted`);
      window.location.reload();
    })
    
    .catch((error) => {
      setErrorMessage(error.message);
      console.log(`Unable to delete chapter: ${errorMessage}`);
    })
  }

  useEffect(() => {
    axios.get(url)
      .then( (response) => {
        const list = response.data;
        setChaptersList(list);
      })
      .catch((error) => {
        console.log(`There was an error retrieving chapters: ${error}`)
      });
  },[url])
  
  let chapterComponents = undefined
  if (chaptersList !== null && chaptersList.length > 0) {
    chapterComponents = chaptersList.map((chap) => {
    return (
      <Chapter 
      key={chap.id}
      id={chap.id}
      name={chap.name}
      text={chap.text}
      position={chap.position}
      scripID={chap.scripture_id}
      scripLength={chapterComponents !== undefined ? chapterComponents.length : 0}
      submitChapterCallback={updateChapter}
      deleteChapterCallback={deleteChapter}
      />)
    })
  }


  return (
    <section>
      <button className={ "btn list-group-item list-group-item-action"}>
        <div className="row">
          <div className="card-body  justify-content-between">
          <ScriptureForm 
            id={props.id}
            name={props.name}
            orgID={props.orgID}
            visibility={updateScriptureMode}
            submitScriptureCallback={updateScripture}
            onSubmitCallback={setUpdateScripture}
            deleteScriptureCallback={deleteScripture}

          />
            <button onClick={setUpdateScripture} className={ updateScriptureMode ? "hidden" : "border-0 btn w-100 mt-n2"}><h5 className="card-title font-weight-bolder text-left">{props.name}</h5></button>
            
          </div>
          <div className="">
            <button className="btn btn-outline-secondary mr-2" onClick={setAddChapter}>{ addChapterMode ? "-" : "+"}</button>
          </div>
        </div>

        <p className={ chapterComponents !== undefined ? "hidden" : "open-sans" }>There are no chapters in this scripture...</p>

        <ChapterForm 
        orgID={props.orgID}
        visibility={addChapterMode}
        scripLength={chapterComponents !== undefined ? chapterComponents.length : 0}
        submitChapterCallback={addChapter}
        onSubmitCallback={setAddChapter}
        />
        <div className="list-group-flush">
          {chapterComponents}
        </div>
        

      </button>
    </section>
  )
}

Scripture.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  orgID: PropTypes.number,
  visibility: PropTypes.bool,
};

export default Scripture;