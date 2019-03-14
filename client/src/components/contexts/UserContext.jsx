import { createContext } from 'react';

const defaultUserState = { isLoggedIn: false, isAdmin:false, username: '' };
const { Consumer: UserConsumer, Provider: UserProvider } = createContext(defaultUserState);

export {
    UserConsumer,
    UserProvider,
    defaultUserState,
}