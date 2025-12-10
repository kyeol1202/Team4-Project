import React, { useEffect } from "react";


function SnowEffect() {

  useEffect(() => {
    const snowContainer = document.querySelector(".snow-container");

    // 눈송이 60개 생성
    for (let i = 0; i < 20; i++) {
      const snow = document.createElement("div");
      snow.classList.add("snow");

      // 랜덤 위치
      snow.style.left = Math.random() * 100 + "vw";

      // 랜덤 크기
      const size = Math.random() * 4 + 2; 
      snow.style.width = size + "px";
      snow.style.height = size + "px";

      // 랜덤 떨어지는 시간 (천천히)
      snow.style.animationDuration = 4 + Math.random() * 6 + "s";

      // 랜덤 딜레이
      snow.style.animationDelay = Math.random() * 5 + "s";

      snowContainer.appendChild(snow);
    }
  }, []);

  return <div className="snow-container"></div>;
}

export default SnowEffect;
