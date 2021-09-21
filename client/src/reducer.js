export default function login(state, action) {
  switch (action.type) {
    case 'JOIN':
      return {
        ...state,
        joined: true,
        roomID: action.payload.roomID,
        userName: action.payload.userName,
      }

    case 'SET_USERS':
      return {
        ...state,
        users: action.payload,
      }

    case 'SET_MESSAGES':
      return {
        ...state,
        messages: action.payload,
      }

    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      }

    default:
      return state
  }
}

