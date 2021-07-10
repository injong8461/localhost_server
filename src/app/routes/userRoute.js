module.exports = function (app) {
	const user = require('../controllers/userController');

	app.route('/user/:id').get(user.find);
	app.route('/user/register').post(user.register);
	app.route('/user/update').post(user.update);
	app.route('/user/updatePW').post(user.updatePW);
	app.route('/user/update/photo').post(user.updatePhoto);
	app.route('/user/delete').post(user.delete);
	app.route('/user/list').get(user.list);
	app.route('/user/search').post(user.search);

	app.route('/auth/login').post(user.login);
	app.route('/auth/check').get(user.checkToken);
	app.route('/auth/logout').get(user.logout);
};
