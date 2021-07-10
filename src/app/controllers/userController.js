const userDao = require('../dao/userDao');

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
	if (
		email === undefined ||
		pw === undefined ||
		name === undefined ||
		sex === undefined ||
		nickname === undefined ||
		phone === undefined ||
		nationality === undefined ||
		address === undefined
	)
		return res.json({ success: false, message: '모든 정보를 입력하세요.' });
	try {
		if (await userDao.checkEmail(email))
			return res.json({ success: false, message: '중복 된 이메일입니다.' });

		await userDao.postUser(
			email,
			pw,
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
