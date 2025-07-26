const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.post('/scrape', async (req, res) => {
  const { url, selectors } = req.body;

  if (!url || !selectors || !Array.isArray(selectors)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    const scrapedData = selectors.map(({ selector, label, attribute }) => {
      const elements = $(selector).toArray();
      const results = elements.map((el) => {
        const $el = $(el);
        if (attribute === 'text') return $el.text().trim();
        return $el.attr(attribute) || '';
      });
      return { selector, label, results };
    });

    res.json(scrapedData);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Scraping failed. Check URL and selectors.' });
  }
});

app.listen(PORT, () => {
  console.log(` server running on http://localhost:${PORT}`);
});
