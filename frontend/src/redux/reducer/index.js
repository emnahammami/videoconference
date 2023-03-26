import { combineReducers } from "redux";
import Authreducer from "./Authreducer";
import errorreducer from "./errorreducer";
import userReducer from "../../store/reducer"


const rootReducer = combineReducers({
  Authreducer,
  errorreducer,userReducer


});
export default rootReducer;
