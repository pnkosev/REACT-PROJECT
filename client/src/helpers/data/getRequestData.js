export default function getRequestData(state, defaultState) {
    let data = {};
    
    for (let key of Object.keys(defaultState)) {
        data[key] = state[key];
    }

    return data;
}