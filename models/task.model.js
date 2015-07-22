var mongoose = require('mongoose')
var _ = require('lodash')
var Task;
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
    // setup schema here
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Task'
    },
    name: {
        type: String,
        required: true
    },
    complete: {
        type: Boolean,
        required: true,
        default: false
    },
    due: Date

});

//virtuals

TaskSchema.virtual('timeRemaining').get(function() {
    return this.due - new Date() || Infinity;
})

TaskSchema.virtual('overdue').get(function() {
    if (this.complete) return false;
    return this.due - new Date() < 0;
})

//methods

TaskSchema.methods.addChild = function(params) {
    params.parent = this._id;
    return this.constructor.create(params)
        .then(null, function(err) {
            console.error(err);
        })
}

TaskSchema.methods.getChildren = function() {
    return this.constructor.find({
        parent: this._id
    }).exec()
}

TaskSchema.methods.getSiblings = function() {
    return this.constructor.find({
        parent: this.parent,
        _id: {
            $ne: this._id
        }
    }).exec()
}

Task = mongoose.model('Task', TaskSchema);


module.exports = Task;