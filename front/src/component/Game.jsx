import React, { useState, useEffect } from "react";
import "./Game.css";

const GRID_SIZE = 20;
const CELL_SIZE = 20;

function Game() {
  const [snake, setSnake] = useState([{ x: 5, y: 5 }]);
  const [food, setFood] = useState({ x: 10, y: 10 });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);

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

  // 게임 루프
  useEffect(() => {
    if (gameOver) return;
    const timer = setInterval(moveSnake, 150);
    return () => clearInterval(timer);
  });

  function moveSnake() {
    const newSnake = [...snake];
    const head = {
      x: snake[0].x + direction.x,
      y: snake[0].y + direction.y,
    };

    // 벽 충돌
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      setGameOver(true);
      return;
    }

    // 자기 자신 충돌
    for (let s of newSnake) {
      if (s.x === head.x && s.y === head.y) {
        setGameOver(true);
        return;
      }
    }

    newSnake.unshift(head);

    // 먹이 먹으면 길이 증가
    if (head.x === food.x && head.y === food.y) {
      setFood({
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      });
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }

  return (
    <div className="game">
      <h2>🐍 지렁이 게임</h2>
      {gameOver && <p className="game-over">GAME OVER</p>}
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
      </div>
    </div>
  );
}

export default Game;
