import { combineReducers } from 'redux'
import todos from './todos'
import visibilityFilter from './visibilityFilter'


//联结所有的reducers
export default combineReducers({
  todos,
  visibilityFilter
})