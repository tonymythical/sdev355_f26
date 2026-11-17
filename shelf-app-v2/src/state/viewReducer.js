
export const initialState = {
    query: "",
    page: 1,
    hideFinished: false
}

export function viewReducer(state, action) {
    switch (action.type) {
        case "query_changed":
            return { 
                ...state,               //spread the old state
                query: action.query,    //add the new query
                page: 1                 //reset page to 1
            }
        case "page_changed":
            return {
                ...state,
                page: action.page
            }
        case "toggle_hide":
            return {
                ...state, 
                hideFinished: !state.hideFinished
            }
        default:
            throw new Error("Unknown action type!");
    }
}