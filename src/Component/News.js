import React, { useEffect, useState } from "react";

import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // constructor(props) {
  //   super(props);

  // }

  const updateNews = async () => {
    props.setProgress(10);

    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&category=${props.category}&apiKey=5c9dc9bee74842c3ad714408b042038b&page=${page}&pageSize=${props.pageSize}`;

    setLoading(true);

    let data = await fetch(url);
    props.setProgress(30);

    let parseData = await data.json();
    props.setProgress(70);

    setArticles(parseData.articles);
    setTotalResults(parseData.totalResults);
    setLoading(false);

    props.setProgress(100);
  };

  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)}- NewsHooter`;
    updateNews();
  }, []);

  const fetchMoreData = async () => {
    setPage(page + 1);
    let url = `https://newsapi.org/v2/top-headlines?country=${
      props.country
    }&category=${props.category}&category=${
      props.category
    }&apiKey=5c9dc9bee74842c3ad714408b042038b&page=${page + 1}&pageSize=${
      props.pageSize
    }`;
    setPage(page + 1);
    let data = await fetch(url);
    let parseData = await data.json();
    setArticles(articles.concat(parseData.articles));
    setTotalResults(parseData.totalResults);
  };

  return (
    <>
      <h1
        className="text-center"
        style={{ margin: "40px 0px", marginTop: "90px" }}
      >
        NewsHooter - Top {capitalizeFirstLetter(props.category)} Headlines
      </h1>

      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={<Spinner />}
      >
        <div className="container my-3">
          <div className="container">
            <div className="row">
              {articles.map((element) => {
                return (
                  <div className="col-md-4" key={element.url}>
                    <NewsItem
                      title={element.title ? element.title.slice(0, 45) : ""}
                      description={
                        element.description
                          ? element.description.slice(0, 80)
                          : ""
                      }
                      imageUrl={element.urlToImage}
                      newsUrl={element.url}
                      author={element.author}
                      date={element.publishedAt}
                      source={element.source.name}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </InfiniteScroll>
    </>
  );
};
const intialProps = {
  country: "in",
  pageSize: 8,
  category: "general",
};
intialProps.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
