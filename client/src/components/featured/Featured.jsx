import { 
  InfoOutlined, 
  PlayArrow,
  Add,
  ThumbUpAltOutlined,
  ArrowBackOutlined,
  ThumbDownOutlined } from "@material-ui/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import "./featured.scss";
import { Link } from 'react-router-dom';

export default function Featured({ type, setGenre, showContent, setShowContent }) {
  const [content, setContent] = useState({});
  const [showMore, setShowMore] = useState(false);
  
  const handleMoreClick = () => {
    setShowMore(!showMore);
  };

  useEffect(() => {
    const getRandomContent = async () => {
      try {
        const res = await axios.get(`https://movie-app-a4bl.onrender.com/api/movies/random?type=${type}`, {
          headers: {
            token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
        });
        setContent(res.data[0]);
        console.log(res.data[0],'content')
      } catch (err) {
        console.log(err);
      }
    };
    getRandomContent();
  }, [type]);

  console.log(type,'type')

  return (
    <div className={`featured ${showContent ? "fullHeight" : ""}`}>
      {type && (
        <div className="category">
          <span>{type === "movie" ? "Movies" : "Series"}</span>
          <select name="genre" id="genre" onChange={(e) => setGenre(e.target.value)}>
            <option>Genre</option>
            <option value="adventure">Adventure</option>
            <option value="comedy">Comedy</option>
            <option value="crime">Crime</option>
            <option value="fantasy">Fantasy</option>
            <option value="historical">Historical</option>
            <option value="horror">Horror</option>
            <option value="romance">Romance</option>
            <option value="sci-fi">Sci-fi</option>
            <option value="thriller">Thriller</option>
            <option value="western">Western</option>
            <option value="animation">Animation</option>
            <option value="drama">Drama</option>
            <option value="documentary">Documentary</option>
          </select>
        </div>
      )}
      {showContent ? (
        <div className="item-info">
          <video src={content.trailer} autoPlay={true} />
          <div className="itemInfo">
            <div className="icons">
            <ArrowBackOutlined onClick={() => setShowContent(false)} style={{cursor:'pointer', marginRight:'5px'}}/>
              <Link to={{ pathname: "/watch", movie: content }} className="link">
                <PlayArrow className="icon" />
              </Link>
              <Add className="icon" />
              <ThumbUpAltOutlined className="icon" />
              <ThumbDownOutlined className="icon" />
            </div>
            <div className="itemInfoTop">
              <span>{content.duration}</span>
              <span className="limit">+{content.limit}</span>
              <span>{content.year}</span>
            </div>
            <div className="desc">{content.desc}</div>
            <span className="more" onClick={handleMoreClick}>
              {!showMore && "More..." }
            </span>
            {showMore && type === "series" && (
              <div className="episodeList">
                {content.episodes?.map((episode, index) => (
                  <div key={index} className="episode">
                    <h4 className=""style={{marginBottom:'5px'}}>Episode {index+1}</h4>
                   <div className="flex">
                   <Link to={{ pathname: "/watch", movie: episode }} className="link">
                   <video
  src={episode.video}
  className="responsive-video"
  style={{ height: '150px', objectFit: 'cover' }}
  controls
/>

                    </Link>
                    <p className="paragraph">{episode.desc}</p>
                    </div> 
                    
                    <h3 style={{marginBottom:'5px'}}>{episode.title}</h3>
                  </div>
                ))}

                {showMore && <span className="more" onClick={handleMoreClick}>Less</span> }
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <img src={content.img} alt="" />
          <div className="info">
            <img src={content.imgTitle} alt="" />
            <span className="desc">{content.desc}</span>
            <div className="buttons">
              <Link to={{ pathname: "/watch", movie: content }} className="play">
                <PlayArrow />
                <span>Play</span>
              </Link>
              <button
                className="more"
                onClick={() => setShowContent(true)}
              >
                <InfoOutlined />
                <span>Info</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
