const mongoose = require('mongoose')

const Tasks = mongoose.model('Task', {
	name: { type: String, required: true },
})

module.exports = Tasks