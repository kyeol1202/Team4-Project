const express = require('express')
const cors = require('cors')
const app = express();
const pool = require('./db')
app.use(cors());
app.use(express.json());

// app.get('/', async (req, res) => {

//     const rows = await pool.query('SELECT * FROM ex');
//     res.send(rows);

// });

app.get('/noticeText', async (req, res) => {

    const rows2 = await pool.query('SELECT * FROM ex_02 ORDER BY number DESC');
    // console.log(rows2);
    res.json(rows2);
});

app.get('/userTextlist', async (req, res) => {

    const rows3 = await pool.query('SELECT * FROM ex_03')
    res.json(rows3);
})



app.post('/add', async (req, res) => {

    // console.log("받은 body:", req.body);


    const { id, pw, Name } = req.body;

    // 1. DB에서 중복 체크
    const rows = await pool.query('SELECT id FROM ex WHERE id = ? OR Name = ?', [id, Name]);

    if (rows.length == 0) {

        await pool.query('INSERT INTO ex(id, pw , Name) VALUES(?, ? , ?)', [id, pw, Name]);
        console.log("중복 체크 결과:", rows);
        res.send({ message: "회원가입 성공" });

    }
    else {
        res.status(400).send({ error: "아이디나 닉네임이 중복되었습니다." });
    }



})

app.put('/notice', async (req, res) => {


    const { text, user } = req.body;
    await pool.query('INSERT INTO ex_02(text , user) VALUES(? , ?)', [text, user]);
    res.send({ success: true });
})

app.post('/userText', async (req, res) => {
    const { usertext, user, num } = req.body;

    await pool.query(
        'INSERT INTO ex_03(downtext, downuser, num) VALUES(?,?,?)',
        [usertext, user, num]
    );

    res.send({ success: true });
});

app.delete('/userdelete', async (req, res) => {
    const { text, user } = req.body;

    await pool.query(
        'DELETE FROM ex_03 WHERE downuser = ? AND downtext = ?',
        [user, text] 
    );

    const rows3 = await pool.query('SELECT * FROM ex_03');
    res.send(rows3);
});

app.delete('/delete', async (req, res) => {
    const { text, user } = req.body;

    await pool.query(
        'DELETE FROM ex_02 WHERE user = ? AND text = ?',
        [user, text]
    );

    const rows2 = await pool.query('SELECT * FROM ex_02');
    res.send(rows2);
});

app.put('/edit', async (req, res) => {
    const { oldText, newText, user } = req.body;

    // 실제 update
    await pool.query(
        'UPDATE ex_02 SET text = ? WHERE text = ? AND user = ?',
        [newText, oldText, user]
    );

    // 수정 후 최신 데이터 다시 보내기
    const rows = await pool.query(
        'SELECT * FROM ex_02 WHERE user = ?',
        [user]
    );

    res.send(rows);
});

app.put('/useredit', async (req, res) => {
    const { oldText, newText, user } = req.body;

    // 실제 update
    await pool.query(
        'UPDATE ex_03 SET downtext = ? WHERE downtext = ? AND downuser = ?',
        [newText, oldText, user]
    );

    // 수정 후 최신 데이터 다시 보내기
    const rows = await pool.query(
        'SELECT * FROM ex_02 WHERE user = ?',
        [user]
    );

    res.send(rows);
});

app.post('/login', async (req, res) => {

    const { id, pw } = req.body;

    // 1. DB 조회
    const rows = await pool.query('SELECT * FROM ex WHERE id = ? AND pw = ?', [id, pw]);

    // 2. 결과 확인
    if (rows.length > 0) {
        const user = rows[0]
        res.send({ message: "로그인 성공", name: user.Name });
    } else {
        res.status(401).send({ error: "아이디 또는 비밀번호가 틀립니다." });
    }


});



// app.put('/', async (req, res) => {

//     await pool.query(
//         'UPDATE ex SET pw=? WHERE id=?',
//         [req.body.pw, req.body.id]
//     )
// })

// app.delete('/', async (req, res) => {

//     await pool.query(
//         'DELETE FROM ex WHERE id=?',
//         [req.body.id]
//     )
// })

app.listen(8080, '0.0.0.0',() => {

    console.log("서버 실행")

})