import { Provider } from 'react-redux';
import { RootRouter } from './router/RootRouter';
import { store } from './store/store';

export const NxtpManager = () => {
    return (
        <Provider store={store}>
            <RootRouter/>
        </Provider>
    )
}
