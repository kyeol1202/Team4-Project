import React, { useState, useEffect } from "react";
import "./ShootingGame.css";

const WIDTH = 400;
const HEIGHT = 500;

function ShootingGame() {
  const [playerX, setPlayerX] = useState(WIDTH / 2);
  const [bullets, setBullets] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // 키 입력
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") setPlayerX((x) => Math.max(0, x - 20));
      if (e.key === "ArrowRight") setPlayerX((x) => Math.min(WIDTH - 40, x + 20));
      if (e.key === " ") shoot();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // 총알 발사
  const shoot = () => {
  setBullets((prev) => [...prev, { x: playerX + 20, y: HEIGHT - 70 }]);
};

  // 총알 이동
  useEffect(() => {
    const timer = setInterval(() => {
      setBullets((prev) =>
        prev.map((b) => ({ ...b, y: b.y - 8 })).filter((b) => b.y > 0)
      );
    }, 50);
    return () => clearInterval(timer);
  });

  // 적 생성
  useEffect(() => {
    if (gameOver) return;
    const timer = setInterval(() => {
      setEnemies((prev) => [
        ...prev,
        {
          x: Math.random() * (WIDTH - 30),
          y: 0,
        },
      ]);
    }, 1500);
    return () => clearInterval(timer);
  }, [gameOver]);

  // 적 이동
  useEffect(() => {
    const timer = setInterval(() => {
      setEnemies((prev) => {
        const moved = prev.map((e) => ({ ...e, y: e.y + 4 }));
        // 바닥 닿으면 Game Over
        for (let e of moved) {
          if (e.y > HEIGHT - 60) {
            setGameOver(true);
            return prev;
          }
        }
        return moved;
      });
    }, 80);
    return () => clearInterval(timer);
  }, []);

  // 총알 & 적 충돌 체크
  useEffect(() => {
    const timer = setInterval(() => {
      setEnemies((prevEnemies) =>
        prevEnemies.filter((enemy) => {
          for (let bullet of bullets) {
            if (
              bullet.x < enemy.x + 30 &&
              bullet.x > enemy.x &&
              bullet.y < enemy.y + 30 &&
              bullet.y > enemy.y
            ) {
              setScore((s) => s + 1);
              return false;
            }
          }
          return true;
        })
      );
    }, 50);
    return () => clearInterval(timer);
  }, [bullets]);

  return (
    <div className="shoot-wrapper">
      <h2>🚀 슈팅게임</h2>
      <p>점수: {score}</p>
      {gameOver && <p className="over-text">GAME OVER</p>}

      <div className="shoot-board">
        {/* player */}
        <div
          className="player"
          style={{ left: playerX }}
        />

        {/* bullets */}
        {bullets.map((b, i) => (
          <div
            key={i}
            className="bullet"
            style={{ left: b.x, top: b.y }}
          />
        ))}

        {/* enemies */}
        {enemies.map((e, i) => (
          <div
            key={i}
            className="enemy"
            style={{ left: e.x, top: e.y }}
          />
        ))}
      </div>
    </div>
  );
}

export default ShootingGame;
