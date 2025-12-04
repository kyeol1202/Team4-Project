import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function Notice() {
    const navigate = useNavigate();
    const { id } = useParams();
    const users = JSON.parse(localStorage.getItem("loginName"));
    const [textList, setTextList] = useState([]);
    const [usertextlist, setUsertextlist] = useState([]);
    const [usertext, setUsertext] = useState('');
    const [openReplyText, setOpenReplyText] = useState(null);
    const [theme, setTheme] = useState('light');

    function write() {
        navigate('/' + id + '/write');
    }

    function re() {
        navigate('/');
    }

    function toggleTheme() {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    }

    useEffect(() => {
        fetch('http://192.168.0.25:8080/noticeText')
            .then(res => res.json())
            .then(data => {
                setTextList(Array.isArray(data) ? data : [data]);
                
            });
    }, [textList]);

    useEffect(() => {
        fetch('http://192.168.0.25:8080/userTextlist')
            .then(res => res.json())
            .then(data => {
                setUsertextlist(Array.isArray(data) ? data : [data]);
            });
    }, [usertextlist]);

    function deleteTodo(text, user) {
        fetch("http://192.168.0.25:8080/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, user })
        })
            .then(res => res.json())
            .then(data => setTextList(data));
    }

    function deleteUser(text, user) {
        fetch("http://192.168.0.25:8080/userdelete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, user })
        })
            .then(res => res.json())
            .then(data => setUsertextlist(data));
    }

    function editTodo(oldText, user) {
        const newText = prompt("수정할 내용을 입력하세요", oldText);
        if (!newText) return;

        fetch("http://192.168.0.25:8080/edit", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ oldText, newText, user })
        })
            .then(res => res.json())
            .then(data => setTextList(data));
    }

    function editUser(oldText, user) {
        const newText = prompt("수정할 내용을 입력하세요", oldText);
        if (!newText) return;

        fetch("http://192.168.0.25:8080/useredit", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ oldText, newText, user })
        })
            .then(res => res.json())
            .then(data => usertextList(data));
    }

    async function com(postNumber) {
        await fetch('http://192.168.0.25:8080/userText', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usertext,
                user: users,
                num: postNumber
            })
        });

        setUsertext('');
    }

    return (
        <div className="center-screen">
            <div className="card">
                <p className="welcome-text">로그인 상태: {users}님</p>
                <p className="welcome-text"> 공지 : 수정 완료</p>
                <button className="button button-primary" onClick={write}>게시글 작성</button>
                <button className="button button-secondary" onClick={re}>로그아웃</button>
                <button className="button button-secondary" onClick={toggleTheme}>
                    {theme === 'light' ? '다크 모드' : '라이트 모드'}
                </button>

                <p className="welcome-text" style={{ marginTop: "20px" }}>게시글 목록</p>
                <div style={{ width: "100%" }}>
                    {textList.map((item, index) => (
                        <div key={index} className="post-card">
                            <strong>{item.user}</strong>: {item.text}

                            {/* 댓글 리스트 */}
                            <div className="replies">
                                {usertextlist
                                    .filter(reply => reply.num === item.number)
                                    .map((reply, i) => (
                                        <div key={i} className="reply-card">
                                            <span className="reply-user">{reply.downuser}</span>: {reply.downtext}
                                            {reply.downuser === users && (
                                                <button className="reply-delete-btn" onClick={() => deleteUser(reply.downtext, reply.downuser)}>삭제</button>
                                            )}
                                            {reply.downuser === users && (
                                                <button className="reply-delete-btn" onClick={() => editUser(reply.downtext, reply.downuser)}>수정</button>
                                            )}
                                        </div>
                                    ))
                                }
                            </div>

                            {/* 답글 입력 */}
                            <button className="reply-toggle-btn" onClick={() =>
                                setOpenReplyText(openReplyText === item.text ? null : item.text)
                            }>
                                답글
                            </button>

                            {openReplyText === item.text && (
                                <div className="reply-input-area">
                                    <input
                                        className="input"
                                        value={usertext}
                                        onChange={(e) => setUsertext(e.target.value)}
                                        placeholder="댓글을 입력하세요..."
                                    />
                                    <button className="button button-primary" onClick={() => com(item.number)}>작성</button>
                                </div>
                            )}

                            {/* 게시글 삭제/수정 */}
                            {item.user === users && (
                                <button className="button button-primary" onClick={() => deleteTodo(item.text, item.user)}>삭제</button>
                            )}
                            {item.user === users && (
                                <button className="button button-primary" onClick={() => editTodo(item.text, item.user)}>수정</button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Notice;
