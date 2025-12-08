import React from 'react';

function ManPerfume() {
  const products = [
    { id: 1, name: "AuRa Noctivale", img: "https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=400&h=400&fit=crop" },
    { id: 2, name: "AuRa Solivane", img: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&h=400&fit=crop" },
    { id: 3, name: "AuRa Freesia", img: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=400&fit=crop" },
    { id: 4, name: "AuRa Blue", img: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop" },
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
          style={styles.circleItem}
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
      </div>
      
      <div style={styles.middleRow}>
        <div 
          style={styles.titleBox}
          onClick={() => window.location.href = '/'}
        >
          <h1 style={styles.allTitle}>Man's Perfume</h1>
        </div>
      </div>
      
      <div style={styles.bottomRow}>
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