class EventManager {
    constructor() {
        this.data = {};
    }
    register(name, callback) {
        if (this.data[name] == undefined) {
            this.data[name] = [];
        }

        this.data[name].push(callback);
    }
    notify(name, params) {
        console.log('notify event', name);
        if (this.data[name] == undefined) {
            return;
        }

        for (var i in this.data[name]) {
            this.data[name][i](params);
        }
    }
}

var eventManager = new EventManager();

module.exports = eventManager;
