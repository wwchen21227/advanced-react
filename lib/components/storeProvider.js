import React from 'react';
import PropTypes from 'prop-types';

const storeProvider = (extraProps = () => ({})) => (Component) => {
    return class extends React.PureComponent {
        static displayName = `${Component.name}Container`;
        static contextTypes = {
            store: PropTypes.object
        }

        usedState = () => {
            return extraProps(this.context.store, this.props);
        };

        state = this.usedState();

        onStoreChange = () => {
            if(this.subscriptionId) {
                this.setState(this.usedState());
            }
        }

        componentWillMount() {
            this.subscriptionId = this.context.store.subscribe(this.onStoreChange);
        }

        componentWillUnmount() {
            this.context.store.unsubscribe(this.subscriptionId);
        }

        render() {
            return <Component 
                {...this.props} 
                {...this.usedState()}
                store={this.context.store}/>;
        }
    };
};


// const storeProvider = (Component) => {
//     const withStore = (props, { store }) => 
//         <Component {...props} store={store}/>;

//     withStore.contextTypes = {
//         store: PropTypes.object
//     };

//     return withStore;
// };

export default storeProvider;