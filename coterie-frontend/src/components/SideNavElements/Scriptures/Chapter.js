import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ChapterForm from './ChapterForm';

const Chapter = (props) => {
  const [updateMode, setUpdateMode] = useState(false);

  const updateChapter = (chapObj) => {
    props.submitChapterCallback(chapObj)
  }

  const deleteChapter = () => {
    props.deleteChapterCallback(props.id);
  }

  const setUpdate = () => {
    setUpdateMode(!updateMode);
  }

  return (
    <section>
      <button onClick={setUpdate} className={ updateMode ? "hidden" : "btn border-0 bg-light list-group-item list-group-item-action"}>
        <div className="card-body row justify-content-between">
          <div>
            <h5 className="card-title font-weight-bolder text-left">{props.name}</h5>
            <p className="open-sans card-text text-left">{props.text}</p>
          </div>
        </div>
      </button>
      <ChapterForm 
        id={props.id}
        name={props.name}
        text={props.text}
        scripID={props.scripID}
        scripLength={props.scripLength}
        visibility={updateMode}
        submitChapterCallback={updateChapter}
        onSubmitCallback={setUpdate}
        deleteChapterCallback={deleteChapter}
        />
    </section>
  )
}

Chapter.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  text: PropTypes.string,
  position: PropTypes.string,
  scripLength: PropTypes.number,
  scripID: PropTypes.number
};


export default Chapter;