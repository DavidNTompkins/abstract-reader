import React, { useState, useEffect } from 'react';

// Add custom styles
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#567568',
    padding: '0',
  },
  card: {
    backgroundColor: '#001a23',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    margin: '0 auto',
    maxWidth: '42rem',
    padding: '1rem',
  },
  progress: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    marginBottom: '0.75rem',
  },
  authors: {
    fontSize: '0.875rem',
    color: '#4b5563',
    marginBottom: '1.5rem',
  },
  metadata: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginBottom: '2rem',
  },
  abstract: {
    fontSize: '0.875rem',
    color: '#FCFCFC',
    marginBottom: '2rem',
    textAlign: 'left',
    padding: '0 5px',
    lineHeight: '1.6',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  buttonRow: {
    display: 'flex',
    gap: '0.5rem',
    width: '100%',
  },
  button: {
    flex: 1,
    color: 'white',
    backgroundColor: '#507DBC',
    fontSize: '0.875rem',
    padding: '0.5rem 1rem',
  },
  primaryButton: {
    backgroundColor: '#AA6373',
    color: 'white',
    '&:hover': {
      backgroundColor: '#1d4ed8',
    },
  },
};

const ArticleReader = () => {
  const [articles, setArticles] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Existing useEffect and handlers remain the same...
  useEffect(() => {
    const savedIndex = localStorage.getItem('currentArticleIndex');
    const savedArticles = localStorage.getItem('articles');
    
    if (savedIndex !== null) {
      setCurrentIndex(parseInt(savedIndex, 10));
    }
    if (savedArticles !== null) {
      setArticles(JSON.parse(savedArticles));
    }
  }, []);

  useEffect(() => {
    if (articles) {
      localStorage.setItem('currentArticleIndex', currentIndex.toString());
      localStorage.setItem('articles', JSON.stringify(articles));
    }
  }, [currentIndex, articles]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          setArticles(Array.isArray(jsonData) ? jsonData : [jsonData]);
          setCurrentIndex(0);
        } catch (error) {
          alert('Error reading JSON file. Please make sure it\'s properly formatted.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < articles.length - 1) {
      setCurrentIndex(curr => curr + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(curr => curr - 1);
    }
  };

  if (!articles) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>Upload Articles JSON</h2>
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            style={{ ...styles.button, ...styles.primaryButton, display: 'block', textAlign: 'center', cursor: 'pointer' }}
          >
            Choose JSON File
          </label>
          <button 
            onClick={() => localStorage.clear()}
            style={{ ...styles.button, marginTop: '1rem' }}
          >
            Clear Saved Data
          </button>
        </div>
      </div>
    );
  }

  const currentArticle = articles[currentIndex];

  return (
    <div 
      style={styles.container}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div style={styles.card}>
        {/* Progress indicator */}
        <div style={styles.progress}>
          Article {currentIndex + 1} of {articles.length}
        </div>

        {/* Header */}
        <div>
          <h2 style={styles.title}>{currentArticle.title}</h2>
          <div style={styles.authors}>
            {currentArticle.authors.join(', ')}
          </div>
          <div style={styles.metadata}>
            Volume {currentArticle.volume}, Issue {currentArticle.issue}
          </div>
        </div>

        {/* Content */}
        <div style={styles.abstract}>
          {currentArticle.abstract}
        </div>

        {/* Footer */}
        <div style={styles.buttonContainer}>
          <div style={styles.buttonRow}>
            <button 
              onClick={() => currentIndex > 0 && setCurrentIndex(curr => curr - 1)}
              disabled={currentIndex === 0}
              style={styles.button}
            >
              Previous
            </button>
            <button 
              onClick={() => currentIndex < articles.length - 1 && setCurrentIndex(curr => curr + 1)}
              disabled={currentIndex === articles.length - 1}
              style={styles.button}
            >
              Next
            </button>
          </div>
          <div style={styles.buttonRow}>
            <button 
              onClick={() => window.open(currentArticle.url, '_blank')}
              style={{ ...styles.button, ...styles.primaryButton }}
            >
              Read Full Article
            </button>
            <button 
              onClick={() => {
                setArticles(null);
                localStorage.clear();
              }}
              style={styles.button}
            >
              Change File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleReader;