
import { createStore } from 'redux';

const initialState = {
	aadResponse: null,
};

const rootReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'AAD_LOGIN_SUCCESS':
			return { ...state, aadResponse: action.payload };
		default:
			return state;
	}
};

export const basicReduxStore = createStore(rootReducer);