import React, { useState } from 'react';
import PropTypes from 'prop-types';

const MemberForm = (props) => {
  //Form
  const [formFields, setFormFields] = useState({
    "id": (props.id ? props.id : null),
    "name": (props.name ? props.name : ""),
    "birthdate": (props.birthdate ? props.birthdate : "1985-01-01"),
    "class": (props.class ? props.class : 'Welcomed'),
    "email": (props.email ? props.email : ""),
    "funds_raised": (props.fundsRaised ? props.fundsRaised : "100.00"),
    "organization_id": props.orgID,
  });

  const onNameChange = (event) => {
    console.log(`name field updated ${event.target.value}`);
    setFormFields({
      ...formFields,
      "name": event.target.value,
    });
  };

  const onBirthdateChange = (event) => {
    console.log(`birthdate field updated ${event.target.value}`);
    setFormFields({
      ...formFields,
      "birthdate": event.target.value,
    });
  };
  const onClassChange = (event) => {
    console.log(`class field updated ${event.target.value}`);
    setFormFields({
      ...formFields,
      "class": event.target.value,
    });
  };
  const onEmailChange = (event) => {
    console.log(`email field updated ${event.target.value}`);
    setFormFields({
      ...formFields,
      "email": event.target.value,
    });
  };
  const onFundsChange = (event) => {
    console.log(`funds_raised field updated ${event.target.value}`);
    setFormFields({
      ...formFields,
      "funds_raised": event.target.value.substring(1),
    });
  };
  
//callback func to an http req for posting org.
  const onFormSubmit = (event) => {
    event.preventDefault();
    props.onSubmitCallback();
    if (formFields["funds_raised"]) {
      const beforeFunds = formFields["funds_raised"].toString().substr(0);
      formFields["funds_raised"] = beforeFunds.replace(/[^\d]/gi, '');
    }

    props.submitMemberCallback(formFields);
    
  };

  return (
    <div className={ props.visibility ? "py-3" : "hidden"}>
      <form className="" onSubmit={""}>
        <div className="form-group">
          <small className="open-sans form-text text-muted">Member's Name</small>
          <input
            className="open-sans form-control"
            name="name"
            type="text"
            placeholder="Joe Shmoe"
            value={formFields["name"]}
            onChange={onNameChange}
          />
        </div>
        <div className="form-group">
          <small className="open-sans form-text text-muted">Member's Birthday</small>
          <input
            className="open-sans form-control"
            name="birthdate"
            type="date"
            value={formFields["birthdate"]}
            onChange={onBirthdateChange}
          />
        </div>
        <div className="form-group">
          <small className="open-sans form-text text-muted">Member's Class</small>
          <select className="open-sans form-control" 
            name="class"
            value={formFields["class"]}
            onChange={onClassChange}
          >
            <option>Revered</option>
            <option>Respected</option>
            <option>Welcomed</option>
            <option>Tolerated</option>
            <option>Shamed</option>
          </select>
        </div>
        <div className="form-group">
          <small className="open-sans form-text text-muted">Member's Email</small>
          <input
            className="open-sans form-control"
            name="email"
            type="email"
            placeholder="joe@shmoe.com"
            value={formFields["email"]}
            onChange={onEmailChange}
          />
        </div>
        <div className="form-group">
        <small className="open-sans form-text text-muted">Funds raised by this member</small>
          <input
            className="open-sans form-control"
            name="funds_raised"
            type="text"
            placeholder="50.00"
            value={"$"+formFields["funds_raised"].toString()}
            onChange={onFundsChange}
          />
        </div>
        <div className="btn-group w-100">
          <input 
            className="btn btn-success text-center w-75" 
            type="submit"
            value="Save"
            onClick={onFormSubmit}
          />
          <input 
            className="btn btn-light text-center w-25" 
            type="submit"
            value="Cancel"
            onClick={props.onSubmitCallback}
          />
          <input 
            className={ props.id ? "btn btn-danger delete-button float-right" : "hidden"} 
            type="submit"
            value="Delete"
            onClick={props.deleteMemberCallback}
          />
        </div>
      </form>
    </div>
)
}

MemberForm.propTypes = {
  orgID: PropTypes.number,
  visibility: PropTypes.bool,
};

export default MemberForm;