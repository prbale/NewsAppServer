const express = require('express');
const axios = require('axios');
const SummarizerManager = require("node-summarizer").SummarizerManager;

const app = express();
const port = 3000;
const NEWS_API_KEY = 'b46cd64b5e7a412e983a289e36e5c430';

app.get('/summarized-news', async (req, res) => {

    try {

        // Get page and limit from query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;


        // const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=in&apiKey=${NEWS_API_KEY}`);

        // Fetch news articles from NewsAPI
        const response = await axios.get(`https://newsapi.org/v2/top-headlines`, {
            params: {
                country: 'in',
                apiKey: NEWS_API_KEY,
                pageSize: limit,
                page: page
            }
        });

        const articles = response.data.articles;

        const summarizedArticles = articles.map(article => {

            let Summarizer = new SummarizerManager(article.description || '', 500);
            let summary = Summarizer.getSummaryByFrequency().summary;

            //const summary = summarizer(article.content || article.description || '', 50); // Summarize to 50 words
            return {
                title: article.title,
                summary: summary,
                url: article.url,
                urlToImage: article.urlToImage
            };
        });

        // res.json(summarizedArticles);

        res.json({
            page: page,
            limit: limit,
            totalPages: Math.ceil(response.data.totalResults / limit),
            totalArticles: response.data.totalResults,
            articles: summarizedArticles
        });
    }
    catch (error) {
        console.error('Error fetching news: ', error);
        res.status(500).send('Error fetching news');
    }
});

app.listen(port, () => {
    console.log(`News summarization server running at http://localhost:${port}`);
});