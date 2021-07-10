module.exports = function (app) {
	const user = require('../controllers/userController');

	app.route('/:id').get(user.find);
	app.route('/register').post(user.register);
};
