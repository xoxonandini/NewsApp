
const fetch = require('node-fetch');  

exports.handler = async function (event, context) {
  const { country = 'us', category = 'general', page = 1, pageSize = 5 } = event.queryStringParameters;
  const apiKey = process.env.REACT_APP_NEWS_API; 
  const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.message || 'Error fetching news' })
      };
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
