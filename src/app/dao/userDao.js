const { pool } = require('../../../config/database');

// 회원 찾기
exports.findUser = async function (userId) {
	try {
		const connection = await pool.getConnection(async conn => conn);
		const query = `
        select id, name, email, nickname, sex, phone, nationality, address, photo, 
        isHost, isAdmin from user where id = ?
        `;
		const params = [userId];
		const [rows] = await connection.query(query, params);

		connection.release();

		return rows;
	} catch (err) {
		return console.log(err + 'DB - 회원찾기 실패');
	}
};

// 이메일 중복 체크
exports.checkEmail = async function (email) {
	try {
		const connection = await pool.getConnection(async conn => conn);
		const query = `
        select exists(select email from user where email = ?) as exist;
        `;
		const params = [email];
		const [rows] = await connection.query(query, params);

		connection.release();

		return rows[0]['exist'];
	} catch (err) {
		return console.log(err + 'DB - 이메일 중복 실패');
	}
};

// 유저 등록
exports.postUser = async function (
	email,
	pw,
	name,
	sex,
	nickname,
	phone,
	nationality,
	address,
) {
	try {
		const connection = await pool.getConnection(async conn => conn);
		const query = `
        insert into user(email, pw, name, sex, nickname, phone, nationality, address)
        values(?, ?, ?, ?, ?, ?, ?, ?);
        `;
		const params = [
			email,
			pw,
			name,
			sex,
			nickname,
			phone,
			nationality,
			address,
		];
		await connection.query(query, params);

		connection.release();
	} catch (err) {
		return console.log(err + 'DB - 회원가입 실패');
	}
};
