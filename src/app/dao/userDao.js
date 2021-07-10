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
		return res.json({ success: false, message: 'DB - 회원 찾기 실패' });
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
		return res.json({ success: false, message: 'DB - 이메일 중복 실패' });
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
		return res.json({ success: false, message: 'DB - 유저 등록 실패' });
	}
};

// 유저 정보 조회
exports.getUserInfo = async function (email) {
	try {
		const connection = await pool.getConnection(async conn => conn);
		const query = `
        select * from user where email = ?
        `;
		const params = [email];
		const [rows] = await connection.query(query, params);

		connection.release();

		return rows;
	} catch (err) {
		return res.json({ success: false, message: 'DB - 유저 정보 조회 실패' });
	}
};

// 토큰 업데이트
exports.patchToken = async function (token, userId) {
	try {
		const connection = await pool.getConnection(async conn => conn);
		const query = `
        update user set token = ? where id = ?
        `;
		const params = [token, userId];
		await connection.query(query, params);

		connection.release();
	} catch (err) {
		return res.json({ success: false, message: 'DB - 토큰 업데이트 실패' });
	}
};

// id로 유저정보 조회
exports.getUserById = async function (userId) {
	try {
		const connection = await pool.getConnection(async conn => conn);
		const query = `
        select id, name, email, nickname, sex, phone, nationality, address, photo, 
        isHost, isAdmin, token from user where id = ?
        `;
		const params = [userId];
		const [rows] = await connection.query(query, params);

		connection.release();
		return rows;
	} catch (err) {
		return res.json({ success: false, message: 'DB - id로 유저 검색 실패' });
	}
};

// 유저 정보 변경
exports.patchUser = async function (
	email,
	nickname,
	phone,
	address,
	nationality,
) {
	try {
		const connection = await pool.getConnection(async conn => conn);
		const query = `
        update user set nickname = "${nickname}", phone = "${phone}", address = "${address}", 
        nationality = "${nationality}" WHERE email = "${email}";
        `;
		const params = [email, nickname, phone, address, nationality];
		await connection.query(query, params);

		connection.release();
	} catch (err) {
		return res.json({ success: false, message: 'DB - 유저 정보 변경 실패' });
	}
};

// 유저 사진 변경
exports.patchUserPhoto = async function (url, userId) {
	try {
		const connection = await pool.getConnection(async conn => conn);
		const query = `
        update user set photo = ? where id = ?;
        `;
		const params = [url, userId];
		await connection.query(query, params);

		connection.release();
	} catch (err) {
		return res.json({
			success: false,
			message: 'DB - 유저 사진 변경 실패',
		});
	}
};

// 유저 사진 변경
exports.patchUserPW = async function (email, pw) {
	try {
		const connection = await pool.getConnection(async conn => conn);
		const query = `
        update user set pw = ? where email = ?;
        `;
		const params = [pw, email];
		await connection.query(query, params);

		connection.release();
	} catch (err) {
		return res.json({
			success: false,
			message: 'DB - 유저 비밀번호 변경 실패',
		});
	}
};

// 유저 탈퇴
exports.deleteUser = async function (userId) {
	try {
		const connection = await pool.getConnection(async conn => conn);
		const query = `
        delete from user where id = ?
        `;
		const params = [userId];
		await connection.query(query, params);

		connection.release();
	} catch (err) {
		return res.json({
			success: false,
			message: 'DB - 유저 탈퇴 실패',
		});
	}
};

// 유저 조회
exports.getUserList = async function () {
	try {
		const connection = await pool.getConnection(async conn => conn);
		const query = `
        select * from user;
        `;
		const [rows] = await connection.query(query);

		connection.release();

		return rows;
	} catch (err) {
		return res.json({
			success: false,
			message: 'DB - 유저 전체 조회 실패',
		});
	}
};

// 유저 조건 검색
exports.searchUser = async function (sql) {
	try {
		const connection = await pool.getConnection(async conn => conn);
		const query = sql;
		const [rows] = await connection.query(query);

		connection.release();

		return rows;
	} catch (err) {
		return res.json({
			success: false,
			message: 'DB - 유저 조건 검색 실패',
		});
	}
};
