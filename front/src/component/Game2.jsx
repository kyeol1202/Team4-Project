import React, { useEffect, useState, useRef } from "react";
import "./Game2.css";

const GRID = 20;
const CELL = 20;

function Game2() {

  const [player, setPlayer] = useState({ x: 10, y: 10 });
  const [enemy, setEnemy] = useState({ x: 3, y: 3 });

  const [over, setOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(0.4);

  const dir = useRef({ x: 0, y: 0 });
  const playerRef = useRef(player);

  const [ranking, setRanking] = useState([]);


  // 최신 player 저장
  useEffect(() => {
    playerRef.current = player;
  }, [player]);


  // 키 입력 + 기본 스크롤 방지
  useEffect(() => {
    const handleDown = (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key))
        e.preventDefault();

      if (e.key === "ArrowUp") dir.current = { x: 0, y: -1 };
      if (e.key === "ArrowDown") dir.current = { x: 0, y: 1 };
      if (e.key === "ArrowLeft") dir.current = { x: -1, y: 0 };
      if (e.key === "ArrowRight") dir.current = { x: 1, y: 0 };
    };

    const handleUp = (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key))
        e.preventDefault();

      dir.current = { x: 0, y: 0 };
    };

    window.addEventListener("keydown", handleDown);
    window.addEventListener("keyup", handleUp);

    return () => {
      window.removeEventListener("keydown", handleDown);
      window.removeEventListener("keyup", handleUp);
    };
  }, []);


  // GAME LOOP (requestAnimationFrame)
  useEffect(() => {
  let last = 0;

  const gameLoop = (t) => {
    if (over) return;
    const dt = t - last;
    last = t;

    // 1) PLAYER 이동
    setPlayer(prev => {
      let nx = prev.x + dir.current.x * 0.006 * dt;
      let ny = prev.y + dir.current.y * 0.006 * dt;
      nx = Math.min(Math.max(nx, 0), GRID - 1);
      ny = Math.min(Math.max(ny, 0), GRID - 1);
      return { x: nx, y: ny };
    });

    // 2) ENEMY 이동
    setEnemy(prev => {
      const px = playerRef.current.x;
      const py = playerRef.current.y;

      const dx = px - prev.x;
      const dy = py - prev.y;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;

      let nx = prev.x + (dx / len) * (0.0045 * dt * speed);
      let ny = prev.y + (dy / len) * (0.0045 * dt * speed);

      nx = Math.min(Math.max(nx, 0), GRID - 1);
      ny = Math.min(Math.max(ny, 0), GRID - 1);

      return { x: nx, y: ny };
    });

    // ⭐⭐⭐ 3) 여기서 즉시 충돌 체크 (핵심)
    const px = playerRef.current.x;
    const py = playerRef.current.y;
    const ex = enemy.x;
    const ey = enemy.y;

    if (Math.abs(px - ex) < 0.18 && Math.abs(py - ey) < 0.18) {
      endGame();
      return;
    }

    // 4) 난이도 증가
    setScore(s => s + 1);
    setSpeed(s => Math.min(s + 0.00025, 1.6));

    requestAnimationFrame(gameLoop);
  };

  requestAnimationFrame(gameLoop);
}, [over]);


  // 게임 종료
  async function endGame() {
    setOver(true);
    saveRank();
  }


  // 랭킹 저장
  async function saveRank() {
    const user = JSON.parse(localStorage.getItem("user"));
    const name = user?.name || "Unknown";

    await fetch("http://192.168.0.224:8080/game2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, score })
    });
  }


  // 랭킹 불러오기 (게임 오버시 딱 1번)
  useEffect(() => {
    if (!over) return;

    async function loadRanking() {
      const res = await fetch("http://192.168.0.224:8080/game2");
      const data = await res.json();
      if (data.success) setRanking(data.data);
    }
    loadRanking();

  }, [over]);


  // 다시하기
  function restart() {
    setPlayer({ x: 10, y: 10 });
    setEnemy({ x: 3, y: 3 });
    setSpeed(0.4);
    setScore(0);
    setOver(false);
  }


  return (
    <div className="game2">
      <h2>⚡ 적 피하기 2 ⚡</h2>

      {over && (
        <div className="game-over-box2">
          <p>💀 GAME OVER 💀</p>
          <button className="restart-btn2" onClick={restart}>🔄 다시하기</button>
        </div>
      )}

      <div
        className="board2"
        style={{ width: GRID * CELL, height: GRID * CELL }}
      >
        <div
          className="player2"
          style={{ left: player.x * CELL, top: player.y * CELL }}
        />

        <div
          className="enemy2"
          style={{ left: enemy.x * CELL, top: enemy.y * CELL }}
        />
      </div>

      <div className="score-box2">🏆 SCORE: {score}</div>

      <div className="ranking-box2">
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
  );
}

export default Game2;
