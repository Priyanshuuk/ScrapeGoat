import React, { useState } from 'react';
import goat from './assets/goat.jpg';

import {
  Search, Download, Code2,
  AlertTriangle, CheckCircle, XCircle, Loader2
} from 'lucide-react';

interface SelectorConfig {
  selector: string;
  label: string;
  attribute: string;
}

interface ScrapedData {
  selector: string;
  label: string;
  results: string[];
}

function App() {
  const [url, setUrl] = useState('');
  const [selectors, setSelectors] = useState<SelectorConfig[]>([
    { selector: 'Always put  "."  in front of a class selector', label: '', attribute: 'alt' },
    
  ]);
  const [results, setResults] = useState<ScrapedData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const addSelector = () => {
    setSelectors(prev => [...prev, { selector: '', label: '', attribute: 'text' }]);
  };

  const updateSelector = (index: number, field: string, value: string) => {
    setSelectors(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const removeSelector = (index: number) => {
    setSelectors(prev => prev.filter((_, i) => i !== index));
  };

  const fetchScrapedData = async () => {
    setIsLoading(true);
    setError('');
    setResults([]);

    try {
      const response = await fetch('http://localhost:4000/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, selectors })
      });

      if (!response.ok) throw new Error('Failed to fetch data from the server.');

      const data: ScrapedData[] = await response.json();
      setResults(data);
    } catch (err) {
      setError('Could not scrape the website. Please check the URL and selectors.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadResults = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'scraped-data.json';
    link.click();
  };

  return (
    <div className="app-container">
      <header className="header">
       <img src={goat} alt="ScrapeGoat logo" className='logoimg' />
        <h1>ScrapeGoat</h1>
      </header>

      <div className="notice">
        <AlertTriangle className="icon amber" />
        <div>
          <p className="notice-title">Important</p>
          <p>Start your backend server at <code>localhost:4000</code> before scraping.</p>
        </div>
      </div>

      <div className="main-grid">
        <section className="panel config-panel">
          <h2><Code2 className="icon blue" /> Configuration</h2>

          <label>Target URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
          />

          <label>CSS Selectors</label>
          <div className="selectors-list">
            {selectors.map((sel, idx) => (
              <div key={idx} className="selector-item">
                <input
                  type="text"
                  placeholder="CSS Selector"
                  value={sel.selector}
                  onChange={(e) => updateSelector(idx, 'selector', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Label"
                  value={sel.label}
                  onChange={(e) => updateSelector(idx, 'label', e.target.value)}
                />
                <select
                  value={sel.attribute}
                  onChange={(e) => updateSelector(idx, 'attribute', e.target.value)}
                >
                  <option value="text">Text</option>
                  <option value="alt">Alt</option>
                  <option value="href">Href</option>
                  <option value="src">Src</option>
                  <option value="title">Title</option>
                </select>
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeSelector(idx)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button type="button" onClick={addSelector} className="add-btn">
            + Add Selector
          </button>

          <div className="actions">
            <button
              onClick={fetchScrapedData}
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? <Loader2 className="icon spin" /> : <Search className="icon" />}
              <span>{isLoading ? 'Scraping...' : 'Scrape Data'}</span>
            </button>
            {results.length > 0 && (
              <button
                onClick={downloadResults}
                className="btn-secondary"
              >
                <Download className="icon" />
                <span>Export</span>
              </button>
            )}
          </div>
        </section>

        <section className="panel results-panel">
          <h2><CheckCircle className="icon green" /> Results</h2>

          {error && (
            <div className="error-msg">
              <XCircle className="icon" />
              <span>{error}</span>
            </div>
          )}

          {!error && results.length > 0 && (
            <div className="results-list">
              {results.map((res, idx) => (
                <div key={idx} className="result-group">
                  <h3>{res.label}</h3>
                  <ul>
                    {res.results.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
