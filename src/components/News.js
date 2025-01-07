import React, { useEffect, useState } from 'react';
import NewsItem from './Newsitem';
import InfiniteScroll from 'react-infinite-scroll-component';
import PropTypes from 'prop-types';

const News = ({
  country = 'in',
  pageSize = 8,
  category = 'general',
  apiKey,
  setProgress,
}) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const capitalizeFirstLetter = (string) => 
    string.charAt(0).toUpperCase() + string.slice(1);

  const updateNews = async () => {
    setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`;
    setLoading(true);
    const response = await fetch(url);
    setProgress(30);
    const parsedData = await response.json();
  
    console.log('API Response:', parsedData); // Add this for debugging
  
    setProgress(70);
    setArticles(parsedData.articles || []);
    setTotalResults(parsedData.totalResults || 0);
    setLoading(false);
    setProgress(100);
  };
  
  const fetchMoreData = async () => {
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${page + 1}&pageSize=${pageSize}`;
    setPage(page + 1);
    const response = await fetch(url);
    const parsedData = await response.json();
  
    console.log('Fetch More Data Response:', parsedData); // Add this for debugging
  
    setArticles((prevArticles) => [...prevArticles, ...(parsedData.articles || [])]);
    setTotalResults(parsedData.totalResults || 0);
  };
  

  useEffect(() => {
    document.title = `${capitalizeFirstLetter(category)} - NewsMonkey`;
    updateNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  return (
    <>
      <h1 className="text-center" style={{ margin: '35px 0px', marginTop: '78px' }}>
        NewsMonkey - Top {capitalizeFirstLetter(category)} Headlines
      </h1>
      {loading && <div className="text-center">Loading...</div>}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
      >
        <div className="container">
          <div className="row">
          {articles.map((element, index) => {
  const title = element.title && element.title !== '[Removed]' ? element.title : 'Title not available';
  const description =
    element.description && element.description !== '[Removed]' ? element.description : 'Description not available';
  const author = element.author && element.author !== '[Removed]' ? element.author : 'Unknown';
  const source = element.source?.name && element.source.name !== '[Removed]' ? element.source.name : 'Unknown';

  return (
    <div className="col-md-4" key={element.url ? `${element.url}-${index}` : index}>
      <NewsItem
        title={title}
        description={description}
        imageUrl={element.urlToImage || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKXPGqdC8U6PlNnivO43alr7RvRFoW9umR6g&s'}
        newsUrl={element.url || '#'}
        author={author}
        date={element.publishedAt || 'Date not available'}
        source={source}
      />
    </div>
  );
})}

          </div>
        </div>
      </InfiniteScroll>
    </>
  );
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
  apiKey: PropTypes.string.isRequired,
  setProgress: PropTypes.func.isRequired,
};

export default News;
