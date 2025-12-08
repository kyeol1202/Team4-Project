import React from 'react';

function Category2() {
  const products = [
    { id: 1, name: "AuRa Primeveil", img: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop" },
    { id: 2, name: "AuRa Elenique", img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop" },
    { id: 3, name: "AuRa Vorelle", img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=400&fit=crop" },
    { id: 4, name: "AuRa Immeren", img: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&h=400&fit=crop" },
    { id: 5, name: "AuRa Noctivale", img: "https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=400&h=400&fit=crop" },
    { id: 6, name: "AuRa Solivane", img: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400&h=400&fit=crop" },
    { id: 7, name: "AuRa Freesia", img: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=400&fit=crop" },
    { id: 8, name: "AuRa Vanilla Musk", img: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop" },
    { id: 9, name: "AuRa Rose", img: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&h=400&fit=crop" },
  ];

  const handleClick = (id) => {
    alert(`Product ${id} clicked! (Navigation would happen here)`);
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
        
        <div 
          style={styles.titleBox}
          onClick={() => window.location.href = '/'}
        >
          <h1 style={styles.allTitle}>Perfume</h1>
        </div>
        
        <div
          style={styles.circleItem}
          onClick={() => handleClick(products[5].id)}
          onMouseEnter={(e) => {
            e.currentTarget.querySelector('img').style.transform = 'scale(1.08)';
            e.currentTarget.querySelector('img').style.boxShadow = '0 14px 26px rgba(0,0,0,0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.querySelector('img').style.transform = 'scale(1)';
            e.currentTarget.querySelector('img').style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
          }}
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