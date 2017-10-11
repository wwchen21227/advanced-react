class StateApi {
    constructor(rawData) {
        this.data = {
            articles: this.mapIntoObject(rawData.articles),
            authors: this.mapIntoObject(rawData.authors),
            searchTerm: '',
            timestamp: new Date()
        };
        this.subscriptions = {};
        this.lastSubscriptionId = 0;
    }
    
    mapIntoObject(arr) {
        return arr.reduce((acc, curr) => {
            acc[curr.id] = curr;
            return acc;
        }, {});
    }

    lookupAuthor = (authorId) => {
        return this.data.authors[authorId];
    }

    getState = () => {
        return this.data;
    }

    subscribe = (cb) => {
        this.lastSubscriptionId++;
        this.subscriptions[this.lastSubscriptionId] = cb;
        return this.lastSubscriptionId;
    }

    unsubscribe = (subscriptionId) => {
        delete this.subscriptions[subscriptionId];
    }

    notifySubscribers = () => {
        Object.values(this.subscriptions).forEach((cb) => cb());
    }

    mergetWithState = (stateChange) => {
        this.data = {
            ...this.data,
            ...stateChange
        };
        this.notifySubscribers();
    }

    setSearchTerm = (searchTerm) => {
        this.mergetWithState({
            searchTerm,
        });
    };

    startClock = () => {
        setInterval(() => {
            this.mergetWithState({
                timestamp: new Date()
            });
        }, 1000);
    }
}

export default StateApi;