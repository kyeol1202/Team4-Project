import React, { useState, useEffect } from "react";
import "./Game.css";

const GRID_SIZE = 20;
const CELL_SIZE = 20;

function Game() {
  const [snake, setSnake] = useState([{ x: 5, y: 5 }]);
  const [food, setFood] = useState({ x: 10, y: 10 });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(150);

  // 방향키 입력
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowUp") setDirection({ x: 0, y: -1 });
      if (e.key === "ArrowDown") setDirection({ x: 0, y: 1 });
      if (e.key === "ArrowLeft") setDirection({ x: -1, y: 0 });
      if (e.key === "ArrowRight") setDirection({ x: 1, y: 0 });
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  
  // 게임 루프  ---<<< 여기가 핵심 수정!
  useEffect(() => {
    if (gameOver) return;

    const timer = setInterval(moveSnake, speed);
    return () => clearInterval(timer);
  }, [snake, speed, gameOver]);


  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    async function getRank() {
      const res = await fetch("http://192.168.0.224:8080/game");
      const data = await res.json();
      if (data.success) setRanking(data.data);
    }
    getRank();
  }, []);

  function restart() {
    setSnake([{ x: 5, y: 5 }]);
    setFood({ x: 10, y: 10 });
    setDirection({ x: 1, y: 0 });
    setGameOver(false);
    setSpeed(150);   // 👈 속도 초기화
  }

  
  async function rangking() {
    const user = JSON.parse(localStorage.getItem("user"));
    const name = user?.name || "Unknown";
    const score = snake.length - 1;

    const userData = { name, score };

    const response = await fetch("http://192.168.0.224:8080/game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });

    const result = await response.json();
    if (result.success) {
      alert("🎉 랭킹 저장 완료!");
    } else {
      alert("❌ 랭킹 저장 실패: " + result.message);
    }
  }


  function moveSnake() {
    const newSnake = [...snake];
    const head = {
      x: snake[0].x + direction.x,
      y: snake[0].y + direction.y,
    };

    // 벽 충돌
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      setGameOver(true);
      rangking();
      return;
    }

    // 자기 자신 충돌
    for (let s of newSnake) {
      if (s.x === head.x && s.y === head.y) {
        setGameOver(true);
        rangking();
        return;
      }
    }

    newSnake.unshift(head);

    // 먹이 충돌
    if (head.x === food.x && head.y === food.y) {
      setFood({
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      });

      // ⭐ 속도 점점 UP
      setSpeed(prev => Math.max(60, prev - 10));

    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }


  return (
    <div className="game">
      <h2>🐍 지렁이 게임</h2>

      {gameOver && (
        <div className="game-over-box">
          <p className="game-over">GAME OVER</p>
          <button onClick={restart} className="restart-btn">
            🔄 다시하기
          </button>
        </div>
      )}

      <div
        className="board"
        style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
      >
        {snake.map((s, i) => (
          <div
            key={i}
            className="snake"
            style={{
              left: s.x * CELL_SIZE,
              top: s.y * CELL_SIZE,
            }}
          />
        ))}

        <div
          className="food"
          style={{
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
          }}
        />

        <div className="ranking-box">
          <h3>🏆 Ranking</h3>
          <ul>
            {ranking.map((r, idx) => (
              <li key={idx}>
                {idx + 1}위 — {r.name} : {r.score}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Game;
