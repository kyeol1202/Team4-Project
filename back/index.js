app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  console.log("🔍 로그인 요청:", username, password);

  // 입력값 확인
  if (!username || !password) {
    return res.json({ success: false, message: "아이디와 비밀번호를 입력하세요." });
  }

  try {
    // DB 조회 (username + password)
    const rows = await pool.query(
      "SELECT * FROM member WHERE username = ? AND password = ?",
      [username, password]
    );

    // 로그인 실패
    if (rows.length === 0) {
      return res.json({ success: false, message: "아이디 또는 비밀번호가 올바르지 않습니다." });
    }

    // 로그인 성공
    const user = rows[0];

    return res.json({
      success: true,
      message: "로그인 성공",
      user: {
        member_id: user.member_id,
        username: user.username,
        name: user.name,
        role: user.role
      }
    });

  } catch (err) {
    console.error("로그인 오류:", err.message);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
});
