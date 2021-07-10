const express = require('./config/express');
let PORT = 3001;

express().listen(PORT, () => {
	console.log(`${PORT} server on`);
});
