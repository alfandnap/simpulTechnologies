
export default function counterReducer(state = { guid: ''}, action) {
  switch (action.type) {
    case 'login':
      return {
        guid: action.guid
      }
    default:
      return state
  }
}