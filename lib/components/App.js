import React from 'react';
import PropTypes from 'prop-types';
import pickBy from 'lodash.pickby';
import Perf from 'react-addons-perf';

if(typeof window !== 'undefined') {
    window.perf = Perf;
}

import ArticleList from './ArticleList';
import SearchBar from './SearchBar';
import Timestamp from './Timestamp';

class App extends React.Component {
    static childContextTypes = {
        store: PropTypes.object
    };

    getChildContext() {
        return {
            store: this.props.store
        };
    }
    
    appState = () => {
        const {articles, searchTerm} = this.props.store.getState();
        return {articles, searchTerm};
    }

    state = this.appState();
    
    onStoreChange = () => {
        this.setState(this.appState());
    }

    componentWillMount() {
        this.subscriptionId = this.props.store.subscribe(this.onStoreChange);
        this.props.store.startClock();
    }

    componentWillUnmount() {
        this.props.store.unsubscribe(this.subscriptionId);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            nextState.articles !== this.state.articles 
            || nextState.searchTerm !== this.state.searchTerm
        );
    }

    render() {
        let { articles, searchTerm } = this.state;
        const searchRE = new RegExp(searchTerm, 'i');
        if(searchTerm) {
            articles = pickBy(articles, (value) => {
                return value.title.match(searchRE) ||
                        value.body.match(searchRE);
            });
        }
        return (
            <div>
                <Timestamp />
                <SearchBar />
                <ArticleList
                    articles={articles}
                    store={this.props.store}/>
            </div>
        );
    }
    getState() {
        return {
            articles: this.getArticles(),
            authors: this.getAuthors()
        };
    }
}

export default App;