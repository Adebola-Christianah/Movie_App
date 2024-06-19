import { useContext, useState, useEffect } from "react";
import { Link, useLocation,useHistory} from "react-router-dom";
import "./movie.css";
import { Publish } from "@material-ui/icons";
import storage from "../../firebase"; // Import storage from your Firebase setup
import { updateMovie } from "../../context/movieContext/apiCalls"; // Update the path accordingly
import { MovieContext } from "../../context/movieContext/MovieContext";
import Swal from "sweetalert2"; // Import SweetAlert2

export default function Movie() {
  const location = useLocation();
  const history=useHistory()
  const movie = location.movie; // Using location.state for accessing movie
  const id = location.id;

  const { dispatch } = useContext(MovieContext);

  const [updatedMovie, setUpdatedMovie] = useState(movie || {});
  const [img, setImg] = useState(null);
  const [imgTitle, setImgTitle] = useState(null);
  const [imgSm, setImgSm] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [video, setVideo] = useState(null);
  const [uploaded, setUploaded] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!movie) {
      console.error("Movie not provided in location state");
    }
  }, [movie]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedMovie({ ...updatedMovie, [name]: value });
  };

  const handleFileChange = (e, setter) => {
    setter(e.target.files[0]);
  };

  const upload = (items) => {
    items.forEach((item) => {
      if (!item.file) {
        setUploaded((prev) => prev + 1);
        return;
      }

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
          Swal.fire({
            icon: "error",
            title: "Upload Error",
            text: `Failed to upload ${item.label}. Please try again.`,
          });
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((url) => {
            setUpdatedMovie((prev) => {
              return { ...prev, [item.label]: url };
            });
            setUploaded((prev) => prev + 1);
            if (uploaded + 1 === items.length) {
              Swal.fire({
                icon: "success",
                title: "Upload Complete",
                text: "All files uploaded successfully!",
              });
            }
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
    if (uploaded >= 5) {
      updateMovie(id, updatedMovie, dispatch)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Update Successful",
          text: "Movie updated successfully!",
        }).then(() => {
          history.push('/movies'); // Redirect to homepage on success
        });
      })
        .catch((error) => {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: "There was an error updating the movie. Please try again.",
          });
        });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Uploads",
        text: "Please upload all files before submitting.",
      });
    }
  };

  if (!movie) {
    return <div>Loading...</div>;
  }

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
              value={updatedMovie.title}
              onChange={handleChange}
            />
            <label>Year</label>
            <input
              type="text"
              name="year"
              value={updatedMovie.year}
              onChange={handleChange}
            />
            <label>Genre</label>
            <input
              type="text"
              name="genre"
              value={updatedMovie.genre}
              onChange={handleChange}
            />
            <label>Limit</label>
            <input
              type="text"
              name="limit"
              value={updatedMovie.limit}
              onChange={handleChange}
            />
            <label>Image</label>
            <input
              type="file"
              name="img"
              onChange={(e) => handleFileChange(e, setImg)}
            />
            <label>Image Title</label>
            <input
              type="file"
              name="imgTitle"
              onChange={(e) => handleFileChange(e, setImgTitle)}
            />
            <label>Thumbnail</label>
            <input
              type="file"
              name="imgSm"
              onChange={(e) => handleFileChange(e, setImgSm)}
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
            {uploaded >= 5 ? (
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
        {uploaded>0 && uploaded < 5 && (
          <div className="progressContainer">
            <div className="progressBar" style={{ width: `${progress}%` }}></div>
            <span>{progress}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
