import React from 'react';
import { useNavigate } from 'react-router-dom';

function Category2() {
  const navigate = useNavigate();

  const products = [
    { id: 1, name: "AuRa Noverin", img: "/uploads/AuRa_Noverin_woman.png" },
    { id: 2, name: "AuRa Velese", img: "/uploads/AuRa_Velese_woman.png" },
    { id: 3, name: "AuRa ClairVent", img: "/uploads/AuRa_ClairVent_man.png" },
    { id: 4, name: "AuRa Elenique", img: "/uploads/AuRa_Elenique_woman.jpeg" },
    { id: 5, name: "AuRa Etherlune", img: "/uploads/AuRa_Etherlune_woman.png" },
    { id: 6, name: "AuRa Noctivale", img: "/uploads/AuRa_Noctivale_man.png" },
    { id: 7, name: "AuRa Primeveil", img: "/uploads/AuRa_Primeveil_woman.png" },
    { id: 8, name: "AuRa Silvaron", img: "/uploads/AuRa_Silvaron_man.png" },
    { id: 9, name: "AuRa Solivane", img: "/uploads/AuRa_Solivane_man.jpeg" },
  ];

  const handleClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div style={styles.allContainer}>
      <div style={styles.circleWrapper}>
        {products.slice(0, 4).map((item) => (
          <div
            key={item.id}
            style={styles.circleItem}
            onClick={() => handleClick(item.id)}
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

      <div style={styles.middleRow}>
        <div
          style={styles.circleItem}
          onClick={() => handleClick(products[4].id)}
        >
          <img src={products[4].img} alt={products[4].name} style={styles.circleImg} />
        </div>

        <div
          style={styles.titleBox}
          onClick={() => navigate("/")}
        >
          <h1 style={styles.allTitle}>Perfume</h1>
        </div>

        <div
          style={styles.circleItem}
          onClick={() => handleClick(products[5].id)}
        >
          <img src={products[5].img} alt={products[5].name} style={styles.circleImg} />
        </div>
      </div>

      <div style={styles.circleWrapper}>
        {products.slice(6, 9).map((item) => (
          <div
            key={item.id}
            style={styles.circleItem}
            onClick={() => handleClick(item.id)}
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
  circleWrapper: {
    display: 'flex',
    justifyContent: 'center',
    gap: '60px',
    padding: '20px',
    marginBottom: '20px',
  },
  middleRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '40px',
    padding: '20px',
    marginBottom: '20px',
  },
  titleBox: {
    backgroundColor: '#e8e8e8',
    padding: '30px 60px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: '0.3s',
  },
  allTitle: {
    fontSize: '36px',
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

export default Category2;
