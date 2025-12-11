// src/component/Game2.jsx
import React, { useEffect, useState, useRef } from "react";
import "./Game2.css";
import enemyImg from "../assets/enemy2.jpg";

const GRID = 20;
const CELL = 20;

function Game2() {
  const [player, setPlayer] = useState({ x: 10, y: 10 });
  const [enemy, setEnemy] = useState({ x: 3, y: 3 });
  const [enemy2, setEnemy2] = useState(null);

  const [over, setOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(0.4);

  const dashCool = useRef(0);
  const isDashing = useRef(false);

  const dir = useRef({ x: 0, y: 0 });
  const playerRef = useRef(player);
  const enemyRef = useRef(enemy);
  const enemy2Ref = useRef(enemy2);

  const [burst, setBurst] = useState(false);
  const burstTimer = useRef(0);

  const [ranking, setRanking] = useState([]);

  const scoreRef = useRef(0);
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => { playerRef.current = player; }, [player]);
  useEffect(() => { enemyRef.current = enemy; }, [enemy]);
  useEffect(() => { enemy2Ref.current = enemy2; }, [enemy2]);


  /* ========================================
     🔥 키 입력
  ======================================== */
  useEffect(() => {
    const handleDown = (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key))
        e.preventDefault();

      if (e.key === "ArrowUp") dir.current = { x: 0, y: -1 };
      if (e.key === "ArrowDown") dir.current = { x: 0, y: 1 };
      if (e.key === "ArrowLeft") dir.current = { x: -1, y: 0 };
      if (e.key === "ArrowRight") dir.current = { x: 1, y: 0 };

      if (e.key === "Shift") tryDash();
    };

    const handleUp = (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        // 방향 유지 — 멈추지 않음
      }
    };

    window.addEventListener("keydown", handleDown);
    window.addEventListener("keyup", handleUp);

    return () => {
      window.removeEventListener("keydown", handleDown);
      window.removeEventListener("keyup", handleUp);
    };
  }, []);



  /* ========================================
     🔥 GAME LOOP
  ======================================== */
  useEffect(() => {
    if (over) return;

    let lastTime = null;
    let frameId;

    const gameLoop = (timestamp) => {
      if (over) return;

      if (lastTime == null) {
        lastTime = timestamp;
        frameId = requestAnimationFrame(gameLoop);
        return;
      }

      const dt = timestamp - lastTime;
      lastTime = timestamp;

      // 대쉬 쿨타임 감소
      if (dashCool.current > 0) {
        dashCool.current -= dt;
        if (dashCool.current < 0) dashCool.current = 0;
      }

      /* 플레이어 이동 */
      setPlayer((prev) => {
        let nx = prev.x + dir.current.x * 0.006 * dt;
        let ny = prev.y + dir.current.y * 0.006 * dt;

        nx = Math.min(Math.max(nx, 0), GRID - 1);
        ny = Math.min(Math.max(ny, 0), GRID - 1);
        return { x: nx, y: ny };
      });

      // 난이도 증가
      const difficulty = Math.min(scoreRef.current / 3000, 2.5);
      const baseEnemySpeed = 0.006 * (1 + difficulty);

      burstTimer.current += dt;

      // 돌진
      if (!burst && burstTimer.current > 300) {
        const prob = Math.min(0.15 + difficulty * 0.2, 0.45);
        if (Math.random() < prob) {
          setBurst(true);
          burstTimer.current = 0;
        }
      }

      if (burst && burstTimer.current > 500) {
        setBurst(false);
        burstTimer.current = 0;
      }

      setSpeed((s) => Math.min(s * 1.0012, 3.0));

      const burstBoost = burst ? 3.0 : 1;

      /* 적1 이동 */
      setEnemy((prev) => {
        const px = playerRef.current.x;
        const py = playerRef.current.y;

        const predictX = px + dir.current.x * 0.4;
        const predictY = py + dir.current.y * 0.4;

        const dx = predictX - prev.x;
        const dy = predictY - prev.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;

        let nx = prev.x + (dx / len) * (baseEnemySpeed * dt * speed * burstBoost);
        let ny = prev.y + (dy / len) * (baseEnemySpeed * dt * speed * burstBoost);

        nx = Math.min(Math.max(nx, 0), GRID - 1);
        ny = Math.min(Math.max(ny, 0), GRID - 1);

        return { x: nx, y: ny };
      });

      setScore((s) => s + 1);

      // 적2 생성
      if (!enemy2Ref.current && scoreRef.current > 4000) {
        setEnemy2({ x: 18, y: 18 });
      }

      // 적2 이동
      if (enemy2Ref.current) {
        setEnemy2((prev) => {
          const px = playerRef.current.x;
          const py = playerRef.current.y;

          const dx = px - prev.x;
          const dy = py - prev.y;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;

          let nx = prev.x + (dx / len) * (baseEnemySpeed * 1.2 * dt * speed);
          let ny = prev.y + (dy / len) * (baseEnemySpeed * 1.2 * dt * speed);

          nx += (Math.random() - 0.5) * 0.04;
          ny += (Math.random() - 0.5) * 0.04;

          nx = Math.min(Math.max(nx, 0), GRID - 1);
          ny = Math.min(Math.max(ny, 0), GRID - 1);

          return { x: nx, y: ny };
        });
      }

      const px = playerRef.current.x;
      const py = playerRef.current.y;
      const e1 = enemyRef.current;
      const e2 = enemy2Ref.current;

      const hit1 = Math.abs(px - e1.x) < 0.22 && Math.abs(py - e1.y) < 0.22;
      const hit2 = e2 && Math.abs(px - e2.x) < 0.22 && Math.abs(py - e2.y) < 0.22;

      if (hit1 || hit2) {
        endGame();
        return;
      }

      frameId = requestAnimationFrame(gameLoop);
    };

    frameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(frameId);
  }, [over]);


  /* ========================================
     🔥 대쉬 (Shift)
  ======================================== */
  function tryDash() {
    if (isDashing.current || dashCool.current > 0) return;
    if (dir.current.x === 0 && dir.current.y === 0) return;

    isDashing.current = true;
    dashCool.current = 3000;

    const dist = 1.5;

    setPlayer((prev) => {
      let nx = prev.x + dir.current.x * dist;
      let ny = prev.y + dir.current.y * dist;

      nx = Math.min(Math.max(nx, 0), GRID - 1);
      ny = Math.min(Math.max(ny, 0), GRID - 1);

      return { x: nx, y: ny };
    });

    setTimeout(() => {
      isDashing.current = false;
    }, 80);
  }


  /* ========================================
     🔥 게임 종료
  ======================================== */
  async function endGame() {
    setOver(true);
    saveRank();
  }

  async function saveRank() {
    const user = JSON.parse(localStorage.getItem("user"));
    const name = user?.name || "Guest_" + Math.floor(Math.random() * 9999);
    const finalScore = scoreRef.current;

    try {
      await fetch("http://192.168.0.224:8080/game2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, score: finalScore }),
      });
    } catch (err) {
      console.log("랭킹 저장 실패", err);
    }
  }


  /* ========================================
     🔥 랭킹 불러오기
  ======================================== */
  useEffect(() => {
    if (!over) return;

    async function loadRanking() {
      const res = await fetch("http://192.168.0.224:8080/game2");
      const data = await res.json();
      if (data.success) setRanking(data.data);
    }

    loadRanking();
  }, [over]);


  /* ========================================
     🔥 restart
  ======================================== */
  function restart() {
    setPlayer({ x: 10, y: 10 });
    setEnemy({ x: 3, y: 3 });
    setEnemy2(null);

    burstTimer.current = 0;
    setBurst(false);

    dashCool.current = 0;
    isDashing.current = false;

    setSpeed(0.4);
    setScore(0);
    scoreRef.current = 0;

    setOver(false);
  }


  /* ========================================
     🔥 RENDER
  ======================================== */
  return (
    <div className="game2">
      <h2>⚡ 지웅이 피하기 ⚡</h2>

      <div className="dash-ui">
        {dashCool.current === 0
          ? "🟦 Dash Ready (SHIFT)"
          : `⏳ Dash Cooldown: ${(dashCool.current / 1000).toFixed(1)}s`}
      </div>

      {over && (
        <div className="game-over-box2">
          <p>💀 GAME OVER 💀</p>
          <p>최종 점수: {score}</p>
          <button className="restart-btn2" onClick={restart}>🔄 다시하기</button>
        </div>
      )}

      <div className="board2" style={{ width: GRID * CELL, height: GRID * CELL }}>
        <div className="player2" style={{ left: player.x * CELL, top: player.y * CELL }} />

        <div
          className={`enemy2 ${burst ? "burst" : ""}`}
          style={{
            left: enemy.x * CELL,
            top: enemy.y * CELL,
            backgroundImage: `url(${enemyImg})`,
          }}
        />

        {enemy2 && (
          <div
            className="enemy2 enemy2-second"
            style={{
              left: enemy2.x * CELL,
              top: enemy2.y * CELL,
              backgroundImage: `url(${enemyImg})`,
            }}
          />
        )}
      </div>

      <div className="score-box2">🏆 SCORE: {score}</div>

      <div className="ranking-box2">
        <h3>🏆 Ranking</h3>
        <ul>
          {ranking.map((r, idx) => (
            <li key={idx}>{idx + 1}위 — {r.name} : {r.score}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Game2;
