const express = require('express');
const compression = require('compression');
const methodOverride = require('method-override');
let cors = require('cors');
const cookieParser = require('cookie-parser');

module.exports = function () {
	const app = express();
	app.use(compression());
	app.use(express.json());
	app.use(cookieParser());
	app.use(express.urlencoded({ extended: true }));
	app.use(methodOverride());
	app.use(cors());

	//라우트 설정;
	require('../src/app/routes/userRoute')(app);

	return app;
};
