const mariadb = require('mariadb')
require('dotenv').config();

const pool = mariadb.createPool({
    host:process.env.DB_HOST,
    port:3306,
    user:process.env.DB_USER,    // 사용자 아이디
    password:process.env.DB_PASS,  //사용자 비밀번호
    database:process.env.DB_NAME, //사용자 이름
<<<<<<< HEAD
    // database:process.env.DB_ADDRESS, //사용자 주소
    // database:process.env.DB_NUMBER, //사용자 폰번호
    // database:process.env.DB_EMAIL, //사용자 이메일
    // database:process.env.DB_HBD //사용자 생년월일
=======
>>>>>>> back-dev
})

module.exports = pool;