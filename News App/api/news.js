export default async function handler(req, res) {
    const { query, page } = req.query;
    const API_KEY = "d967f5a37053448fb4e553c62d53d64a";

    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query || "India")}&page=${page || 1}&pageSize=10&sortBy=publishedAt&apiKey=${API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch news." });
    }
}
