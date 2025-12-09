// ManPerfume.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ManPerfume() {
  const navigate = useNavigate();

  // 🔥 DB데이터 저장할 state
  const [products, setProducts] = useState([]);

  // 🔥 남성 향수 목록 불러오기
  useEffect(() => {
    fetch("http://192.168.0.224:8080/api/products/man")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.data); // DB에서 받은 데이터 저장
        }
      })
      .catch(err => console.error("남성향수 불러오기 오류:", err));
  }, []);

  const handleClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div style={styles.allContainer}>
      
      {/* 로딩 */}
      {products.length === 0 && <p>Loading...</p>}

      {/* 상단 2개 */}
      <div style={styles.topRow}>
        {products.slice(0, 2).map(item => (
          <div
            key={item.product_id}
            style={styles.circleItem}
            onClick={() => handleClick(item.product_id)}
            onMouseEnter={(e) => {
              e.currentTarget.querySelector('img').style.transform = 'scale(1.08)';
              e.currentTarget.querySelector('img').style.boxShadow = '0 14px 26px rgba(0,0,0,0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.querySelector('img').style.transform = 'scale(1)';
              e.currentTarget.querySelector('img').style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
            }}
          >
            <img src={item.img} alt={item.name} style={styles.circleImg} />
          </div>
        ))}
      </div>

      {/* 가운데 타이틀 */}
      <div style={styles.middleRow}>
        <div 
          style={styles.titleBox}
          onClick={() => navigate("/")}
        >
          <h1 style={styles.allTitle}>Man's Perfume</h1>
        </div>
      </div>

      {/* 하단 2개 */}
      <div style={styles.bottomRow}>
        {products.slice(2, 4).map(item => (
          <div
            key={item.product_id}
            style={styles.circleItem}
            onClick={() => handleClick(item.product_id)}
            onMouseEnter={(e) => {
              e.currentTarget.querySelector('img').style.transform = 'scale(1.08)';
              e.currentTarget.querySelector('img').style.boxShadow = '0 14px 26px rgba(0,0,0,0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.querySelector('img').style.transform = 'scale(1)';
              e.currentTarget.querySelector('img').style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
            }}
          >
            <img src={item.img} alt={item.name} style={styles.circleImg} />
          </div>
        ))}
      </div>

    </div>
  );
}

const styles = {
  allContainer: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#fafafa',
    minHeight: '100vh',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '400px',
    padding: '20px',
    marginBottom: '20px',
  },
  middleRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    marginBottom: '20px',
  },
  bottomRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '400px',
    padding: '20px',
  },
  titleBox: {
    backgroundColor: '#e8e8e8',
    padding: '30px 60px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: '0.3s',
  },
  allTitle: {
    fontSize: '32px',
    fontWeight: '300',
    margin: '0',
    color: '#333',
    fontStyle: 'italic',
  },
  circleItem: {
    width: '160px',
    cursor: 'pointer',
    transition: '0.3s',
  },
  circleImg: {
    width: '160px',
    height: '160px',
    borderRadius: '50%',
    objectFit: 'cover',
    transition: '0.3s',
    boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
  },
};

export default ManPerfume;
