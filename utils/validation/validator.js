import {validation} from './index';
import validate from 'validate.js';


const validator = async (field, value) => {
  const lang = null;

  let object = new Object();
  object[field] = value;

  let constraint = new Object();
  constraint[field] = validation(lang)[field];
  var result = validate({}, constraint); //
  if (value != '' && value != null) {
    result = validate(object, constraint);
  }
  if (result) {
    return result[field][0];
  }

  return null;
};
export default validator;
