import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./movie.css";
import { Publish } from "@material-ui/icons";
import storage from "../../firebase"; // Import storage from your Firebase setup
import { updateMovie } from "../../context/movieContext/apiCalls"; // Update the path accordingly
import { MovieContext } from "../../context/movieContext/MovieContext";

export default function Movie() {
  const location = useLocation();
  const movie = location.state.movie; // Assuming the movie is passed via state
  const { dispatch } = useContext(MovieContext);

  const [updatedMovie, setUpdatedMovie] = useState(movie);
  const [img, setImg] = useState(null);
  const [imgTitle, setImgTitle] = useState(null);
  const [imgSm, setImgSm] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [video, setVideo] = useState(null);
  const [uploaded, setUploaded] = useState(0);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    const value = e.target.value;
    setUpdatedMovie({ ...updatedMovie, [e.target.name]: value });
  };

  const handleFileChange = (e, setter) => {
    setter(e.target.files[0]);
  };

  const upload = (items) => {
    items.forEach((item) => {
      const fileName = new Date().getTime() + item.label + item.file.name;
      const uploadTask = storage.ref(`/items/${fileName}`).put(item.file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(Math.round(progress));
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.log(error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((url) => {
            setUpdatedMovie((prev) => {
              return { ...prev, [item.label]: url };
            });
            setUploaded((prev) => prev + 1);
          });
        }
      );
    });
  };

  const handleUpload = (e) => {
    e.preventDefault();
    setProgress(0); // Reset progress before starting a new upload
    upload([
      { file: img, label: "img" },
      { file: imgTitle, label: "imgTitle" },
      { file: imgSm, label: "imgSm" },
      { file: trailer, label: "trailer" },
      { file: video, label: "video" },
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMovie(updatedMovie, dispatch);
  };

  return (
    <div className="product">
      <div className="productTitleContainer">
        <h1 className="productTitle">Movie</h1>
        <Link to="/newproduct">
          <button className="productAddButton">Create</button>
        </Link>
      </div>
      <div className="productTop">
        <div className="productTopRight">
          <div className="productInfoTop">
            <img src={movie.img} alt="" className="productInfoImg" />
            <span className="productName">{movie.title}</span>
          </div>
          <div className="productInfoBottom">
            <div className="productInfoItem">
              <span className="productInfoKey">id:</span>
              <span className="productInfoValue">{movie._id}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">genre:</span>
              <span className="productInfoValue">{movie.genre}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">year:</span>
              <span className="productInfoValue">{movie.year}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">limit:</span>
              <span className="productInfoValue">{movie.limit}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="productBottom">
        <form className="productForm" onSubmit={handleSubmit}>
          <div className="productFormLeft">
            <label>Movie Title</label>
            <input
              type="text"
              name="title"
              placeholder={movie.title}
              onChange={handleChange}
            />
            <label>Year</label>
            <input
              type="text"
              name="year"
              placeholder={movie.year}
              onChange={handleChange}
            />
            <label>Genre</label>
            <input
              type="text"
              name="genre"
              placeholder={movie.genre}
              onChange={handleChange}
            />
            <label>Limit</label>
            <input
              type="text"
              name="limit"
              placeholder={movie.limit}
              onChange={handleChange}
            />
            <label>Trailer</label>
            <input
              type="file"
              name="trailer"
              onChange={(e) => handleFileChange(e, setTrailer)}
            />
            <label>Video</label>
            <input
              type="file"
              name="video"
              onChange={(e) => handleFileChange(e, setVideo)}
            />
          </div>
          <div className="productFormRight">
            <div className="productUpload">
              <img src={movie.img} alt="" className="productUploadImg" />
              <label htmlFor="file">
                <Publish />
              </label>
              <input
                type="file"
                id="file"
                style={{ display: "none" }}
                onChange={(e) => handleFileChange(e, setImg)}
              />
            </div>
            {uploaded === 5 ? (
              <button className="productButton" type="submit">
                Update
              </button>
            ) : (
              <button className="productButton" onClick={handleUpload}>
                Upload
              </button>
            )}
          </div>
        </form>
        {uploaded < 5 && (
          <div className="progressContainer">
            <div className="progressBar" style={{ width: `${progress}%` }}></div>
            <span>{progress}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
