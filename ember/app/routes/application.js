import Ember from 'ember';

export default Ember.Route.extend({
    actions: {
        error: function (reason, transition) {
            console.log(reason);
            this.transitionTo('/login');
            return false;
        }
    }
});
