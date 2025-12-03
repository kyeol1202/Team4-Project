const mariadb = require('mariadb')
require('dotenv').config();

const pool = mariadb.createPool({
    host:process.env.DB_HOST,
    port:3306,
    user:process.env.DB_USER,    // 사용자 아이디
    password:process.env.DB_PASS,  //사용자 비밀번호
    database:process.env.DB_NAME
})

module.exports = pool;