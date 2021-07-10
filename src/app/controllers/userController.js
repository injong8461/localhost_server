const userDao = require('../dao/userDao');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'wearelocalhost';

/***
 * update : 2021-07-10
 * 회원 찾기 API
 */
exports.find = async function (req, res) {
	const id = req.query.id || req.params.id;

	if (!id) res.json({ success: false, message: 'id를 입력하세요. ' });

	try {
		const userRow = await userDao.findUser(Number(id));
		res.json({ success: true, message: '유저 찾기 성공', user: userRow });
	} catch (err) {
		res.send({ success: false, message: '회원 찾기에 실패했습니다.' });
	}
};

/***
 * update : 2021-07-10
 * 회원 가입 API
 */
module.exports.register = async function (req, res) {
	const { email, pw, name, sex, nickname, phone, nationality, address } =
		req.body;

	if (!email) res.json({ success: false, message: '이메일을 입력해주세요.' });
	if (!pw) res.json({ success: false, message: '비밀번호 입력해주세요.' });
	if (!name) res.json({ success: false, message: '이름을 입력해주세요.' });
	if (!sex) res.json({ success: false, message: '성별을 입력해주세요.' });
	if (!nickname)
		res.json({ success: false, message: '닉네임을 입력해주세요.' });
	if (!phone) res.json({ success: false, message: '전화번호을 입력해주세요.' });
	if (!nationality)
		res.json({ success: false, message: '국적을 입력해주세요.' });
	if (!address) res.json({ success: false, message: '주소를 입력해주세요.' });

	try {
		if (await userDao.checkEmail(email))
			return res.json({ success: false, message: '중복 된 이메일입니다.' });

		const hashedPW = crypto.createHash('sha512').update(pw).digest('hex');
		await userDao.postUser(
			email,
			hashedPW,
			name,
			sex,
			nickname,
			phone,
			nationality,
			address,
		);

		return res.json({ success: true, message: '회원가입에 성공했습니다.' });
	} catch (err) {
		return res.json({ success: false, message: '회원가입에 실패했습니다.' });
	}
};

// 토큰 생성
async function createToken(user) {
	const token = jwt.sign(user, SECRET_KEY, { expiresIn: '1d' });

	return token;
}

/***
 * update : 2021-07-10
 * 로그인 API
 */
module.exports.login = async function (req, res) {
	const { email, pw } = req.body;

	if (!email) res.json({ success: false, message: '이메일을 입력해주세요.' });
	if (!pw) res.json({ success: false, message: '이메일을 입력해주세요.' });

	try {
		const userRow = await userDao.getUserInfo(email);
		if (!userRow) {
			res.json({ success: false, message: '등록되지 않은 이메일 입니다.' });
		} else {
			const hashedPW = crypto.createHash('sha512').update(pw).digest('hex');
			if (hashedPW === userRow[0].pw) {
				const user = {
					id: userRow[0].id,
					email: userRow[0].email,
					password: userRow[0].pw,
					name: userRow[0].name,
					nickname: userRow[0].nickname,
					phone: userRow[0].phone,
					address: userRow[0].address,
				};

				const token = await createToken(user);
				await userDao.patchToken(token, userRow[0].id);

				res
					.cookie('token', token, {
						httpOnly: true,
					})
					.status(200)
					.json({
						success: true,
						message: '로그인 성공',
						user: userRow[0],
					});
			} else {
				res.json({ success: false, message: '비밀번호가 틀립니다.' });
			}
		}
	} catch (err) {
		return res.json({ success: false, message: '로그인에 실패했습니다.' });
	}
};

/***
 * update : 2021-07-10
 * 토큰 비교 API
 */
module.exports.checkToken = async function (req, res) {
	const token = req.cookies.token || req.headers.cookie;
	jwt.verify(token, SECRET_KEY, async (err, decoded) => {
		if (err) return res.json({ success: false, message: err });

		let userRow;
		try {
			userRow = await userDao.getUserById(decoded.id);
		} catch (err) {
			return res.json({ success: false, message: '토큰 비교 실패' });
		}

		if (userRow[0].token === token) {
			const user = userRow[0];
			res.status(200).json({ success: true, message: '로그인 성공', user });
		} else {
			res.json({ success: false, message: '로그인 토큰 만료' });
		}
	});
};

/***
 * update : 2021-07-10
 * 로그아웃 API
 */
module.exports.logout = async function (req, res) {
	jwt.verify(req.cookies.token, SECRET_KEY, async (err, decoded) => {
		if (err) return res.json({ success: false, message: err });

		try {
			await userDao.patchToken('', decoded.id);
		} catch {
			return res.json({ success: false, message: '로그아웃 실패' });
		}
		res.json({ success: true });
	});
};

/***
 * update : 2021-07-10
 * 유저 정보 변경 API
 */
module.exports.update = async function (req, res) {
	const email = req.body.email || req.query.email;
	const nickname = req.body.nickname || '';
	const phone = req.body.phone || '';
	const address = req.body.address || '';
	const nationality = req.body.nationality || '';

	try {
		await userDao.patchUser(email, nickname, phone, address, nationality);

		return res.json({ success: true, message: '유저 정보 변경 성공' });
	} catch (err) {
		return res.json({ success: false, message: '유저 정보 변경 실패' });
	}
};

/***
 * update : 2021-07-10
 * 유저 사진 변경 API
 */
module.exports.updatePhoto = async function (req, res) {
	const { url, userId } = req.body;
	try {
		await userDao.patchUserPhoto(url, userId);

		return res.json({ success: true, message: '유저 사진 변경 성공' });
	} catch (err) {
		return res.json({ success: false, message: '유저 사진 변경 실패' });
	}
};

/***
 * update : 2021-07-10
 * 유저 비밀번호 변경 API
 */
module.exports.updatePW = async function (req, res) {
	const { email, pw } = req.body;
	const hashPW = crypto.createHash('sha512').update(pw).digest('hex');

	try {
		await userDao.patchUserPW(email, hashPW);

		return res.json({ success: true, message: '유저 비밀번호 변경 성공' });
	} catch (err) {
		return res.json({ success: false, message: '유저 비밀번호 변경 실패' });
	}
};

/***
 * update : 2021-07-10
 * 유저 탈퇴 API
 */
module.exports.delete = async function (req, res) {
	const { userId } = req.body;
	try {
		await userDao.deleteUser(userId);

		return res.json({ success: true, message: '유저 탈퇴 성공' });
	} catch (err) {
		return res.json({ success: false, message: '유저 탈퇴 실패' });
	}
};

/***
 * update : 2021-07-10
 * 유저 전체 조회 API
 */
module.exports.list = async function (req, res) {
	try {
		const userRows = await userDao.getUserList();

		return res.json({
			success: true,
			message: '유저 전체 조회 성공',
			users: userRows,
		});
	} catch (err) {
		return res.json({ success: false, message: '유저 전체 조회 실패' });
	}
};

/***
 * update : 2021-07-10
 * 유저 조건 검색 API
 */
module.exports.search = async function (req, res) {
	const type = req.body.type || 'nickname';
	const item = req.body.item;

	try {
		let sql = '';
		switch (type) {
			case 'name':
				sql = `SELECT id, name, email, nickname, sex, phone, nationality, address, photo, 
        isHost, isAdmin FROM user WHERE name LIKE "%${item}%"`;
				break;
			case 'nickname':
				sql = `SELECT id, name, email, nickname, sex, phone, nationality, address, photo, 
        isHost, isAdmin FROM user WHERE nickname LIKE "%${item}%"`;
				break;
			case 'email':
				sql = `SELECT id, name, email, nickname, sex, phone, nationality, address, photo, 
        isHost, isAdmin FROM user WHERE email LIKE "%${item}%"`;
				break;
			default:
				sql = `SELECT id, name, email, nickname, sex, phone, nationality, address, photo, 
        isHost, isAdmin FROM user`;
				break;
		}

		const userRows = await userDao.searchUser(sql);

		return res.json({
			success: true,
			message: '유저 조건 검색 성공',
			users: userRows,
		});
	} catch (err) {
		return res.json({ success: false, message: '유저 조건 검색 실패' });
	}
};

/***
 * update : 2021-07-10
 * 유저 팔로우 조회 API
 */
module.exports.follow = async function (req, res) {
	const { userId, followerId } = req.body;

	if (!userId || !followerId)
		return res.json({ success: false, message: '비정삭적인 요청입니다.' });

	try {
		return res.json({
			success: true,
			message: '유저 전체 조회 성공',
			users: userRows,
		});
	} catch (err) {
		return res.json({ success: false, message: '유저 전체 조회 실패' });
	}
};
