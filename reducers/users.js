import {
  FETCH_COURSE,
  ADD_COURSE_STAFF,
} from '../constants/ActionTypes'

const defaultState = {
  users: [],
  isFetching: false,
}

const reduceUsers = users => users.reduce((obj, item) => {
  // eslint-disable-next-line no-param-reassign
  obj[item.id] = item
  return obj
}, {})

const users = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_COURSE.REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case FETCH_COURSE.FAILURE:
      return {
        ...state,
        isFetching: false,
      }
    case FETCH_COURSE.SUCCESS:
      return {
        ...state,
        isFetching: false,
        users: {
          ...state.users,
          ...reduceUsers(action.course.staff),
        },
      }
    case ADD_COURSE_STAFF.SUCCESS:
      return {
        ...state,
        users: {
          ...state.users,
          [action.user.id]: action.user,
        },
      }
    default:
      return state
  }
}

export default users