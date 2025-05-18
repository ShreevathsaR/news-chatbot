import axios from "axios";
import { parseXML } from "../utils/xmlParser.js";
import { extract } from "@extractus/article-extractor";
import pkg from "he";
const { decode } = pkg;
import striptags from "striptags";
import { ingestArticlesToQdrant } from "../utils/ingestArticles.js";

const getNewsArticles = async (req, res) => {
  try {
    const rssURL = "https://timesofindia.indiatimes.com/rssfeedstopstories.cms";

    const rssRes = await axios.get(rssURL);
    const parsedRSS = await parseXML(rssRes.data);

    const items = parsedRSS.rss.channel[0].item;
    const articleURLs = items.slice(0, 50).map((item) => item.link[0]);
    console.log("Number of articles:", articleURLs.length);

    const articles = [];

    for (const url of articleURLs) {
      try {
        const article = await extract(url);

        if (article && article.content) {
          const cleanContent = striptags(decode(article.content));

          articles.push({
            url,
            title: article.title,
            content: cleanContent,
          });
        }
      } catch (err) {
        console.log("Skipping URL:", url, "Reason:", err.message);
      }
    }

    const response = await ingestArticlesToQdrant(articles);

    res.json(response);
  } catch (err) {
    console.error("Error fetching articles:", err.message);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
};

export { getNewsArticles };

