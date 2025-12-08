import React from 'react';

function WomanPerfume() {
  const products = [
    { id: 1, name: "AuRa Elenique", img: "/image/AuRa_Elenique_woman.jpeg" },
    { id: 2, name: "AuRa Etherlune", img: "/image/AuRa_Etherlune_woman.png" },
    { id: 3, name: "AuRa Noverin", img: "/image/AuRa_Noverin_woman.png" },
    { id: 4, name: "AuRa Primeveil", img: "/image/AuRa_Primeveil_woman.png" },
    { id: 5, name: "AuRa Velese", img: "/image/AuRa_Velese_woman.png" },
  ];

  const handleClick = (id) => {
    alert(`Product ${id} clicked! (Navigation would happen here)`);
  };

  return (
    <div style={styles.allContainer}>
      <div style={styles.topRow}>
        <div
          style={styles.circleItem}
          onClick={() => handleClick(products[0].id)}
          onMouseEnter={(e) => {
            e.currentTarget.querySelector('img').style.transform = 'scale(1.08)';
            e.currentTarget.querySelector('img').style.boxShadow = '0 14px 26px rgba(0,0,0,0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.querySelector('img').style.transform = 'scale(1)';
            e.currentTarget.querySelector('img').style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
          }}
        >
          <img src={products[0].img} alt={products[0].name} style={styles.circleImg} />
        </div>
        
        <div
          style={styles.circleItemTop}
          onClick={() => handleClick(products[1].id)}
          onMouseEnter={(e) => {
            e.currentTarget.querySelector('img').style.transform = 'scale(1.08)';
            e.currentTarget.querySelector('img').style.boxShadow = '0 14px 26px rgba(0,0,0,0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.querySelector('img').style.transform = 'scale(1)';
            e.currentTarget.querySelector('img').style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
          }}
        >
          <img src={products[1].img} alt={products[1].name} style={styles.circleImg} />
        </div>
        
        <div
          style={styles.circleItem}
          onClick={() => handleClick(products[2].id)}
          onMouseEnter={(e) => {
            e.currentTarget.querySelector('img').style.transform = 'scale(1.08)';
            e.currentTarget.querySelector('img').style.boxShadow = '0 14px 26px rgba(0,0,0,0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.querySelector('img').style.transform = 'scale(1)';
            e.currentTarget.querySelector('img').style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
          }}
        >
          <img src={products[2].img} alt={products[2].name} style={styles.circleImg} />
        </div>
      </div>
      
      <div style={styles.middleRow}>
        <div 
          style={styles.titleBox}
          onClick={() => window.location.href = '/'}
        >
          <h1 style={styles.allTitle}>Woman's Perfume</h1>
        </div>
      </div>
      
      <div style={styles.bottomRow}>
        <div
          style={styles.circleItem}
          onClick={() => handleClick(products[3].id)}
          onMouseEnter={(e) => {
            e.currentTarget.querySelector('img').style.transform = 'scale(1.08)';
            e.currentTarget.querySelector('img').style.boxShadow = '0 14px 26px rgba(0,0,0,0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.querySelector('img').style.transform = 'scale(1)';
            e.currentTarget.querySelector('img').style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
          }}
        >
          <img src={products[3].img} alt={products[3].name} style={styles.circleImg} />
        </div>
        
        <div
          style={styles.circleItem}
          onClick={() => handleClick(products[4].id)}
          onMouseEnter={(e) => {
            e.currentTarget.querySelector('img').style.transform = 'scale(1.08)';
            e.currentTarget.querySelector('img').style.boxShadow = '0 14px 26px rgba(0,0,0,0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.querySelector('img').style.transform = 'scale(1)';
            e.currentTarget.querySelector('img').style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
          }}
        >
          <img src={products[4].img} alt={products[4].name} style={styles.circleImg} />
        </div>
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
    alignItems: 'flex-end',
    gap: '80px',
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
    gap: '200px',
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
  circleItemTop: {
    width: '160px',
    cursor: 'pointer',
    transition: '0.3s',
    marginBottom: '40px',
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

export default WomanPerfume;