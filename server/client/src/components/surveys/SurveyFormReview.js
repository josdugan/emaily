import { connect } from 'react-redux';
import formFields from './formFields';
import * as actions from '../../actions';
import withNavigate from '../hoc/react-router-dom-adapter';

const SurveyFormReview = ({ onCancel, formValues, submitSurvey, navigate }) => {
  const reviewFields = formFields.map((field) => {
    return (
      <div key={field.name}>
        <label htmlFor="">{field.label}</label>
        <div>{formValues[field.name]}</div>
      </div>
    );
  });

  return (
    <div>
      <h5>Please confirm your entries</h5>
      {reviewFields}
      <button
        className="yellow darken-3 white-text btn-flat"
        onClick={onCancel}
      >
        Back
      </button>
      <button
        className="green btn-flat right white-text"
        onClick={() => submitSurvey(formValues, navigate)}
      >
        Send Survey<i className="material-icons right">email</i>
      </button>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    formValues: state.form.surveyForm.values,
  };
};

export default withNavigate(
  connect(mapStateToProps, actions)(SurveyFormReview)
);
