import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>404</h1>
      <h2 style={styles.subHeader}>Page Not Found</h2>
      <p style={styles.text}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" style={styles.button}>
        Go Back Home
      </Link>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '80vh',
    textAlign: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    fontSize: '100px',
    margin: '0',
    color: '#007bff'
  },
  subHeader: {
    fontSize: '32px',
    marginBottom: '20px',
    color: '#333'
  },
  text: {
    fontSize: '18px',
    color: '#666',
    maxWidth: '500px',
    marginBottom: '30px'
  },
  button: {
    padding: '12px 25px',
    background: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background 0.3s'
  }
};

export default NotFound;
