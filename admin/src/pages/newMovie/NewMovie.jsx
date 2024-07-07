import { useContext, useState } from "react";
import "./newMovie.css";
import storage from "../../firebase";
import { createMovie } from "../../context/movieContext/apiCalls";
import { MovieContext } from "../../context/movieContext/MovieContext";

export default function NewMovie() {
  const [movie, setMovie] = useState({ isSeries: "false" });
  const [img, setImg] = useState(null);
  const [imgTitle, setImgTitle] = useState(null);
  const [imgSm, setImgSm] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [video, setVideo] = useState(null);
  const [episodes, setEpisodes] = useState([{ title: "", desc: "", video: null, thumbnail: null, duration: "" }]);
  const [uploaded, setUploaded] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const { dispatch } = useContext(MovieContext);

  const handleChange = (e) => {
    const value = e.target.value;
    setMovie({ ...movie, [e.target.name]: value });
  };

  const handleEpisodeChange = (index, e) => {
    const { name, value, files } = e.target;
    const updatedEpisodes = episodes.map((episode, i) =>
      i === index ? { ...episode, [name]: files ? files[0] : value } : episode
    );
    setEpisodes(updatedEpisodes);
  };

  const addEpisode = () => {
    setEpisodes([...episodes, { title: "", desc: "", video: null, thumbnail: null, duration: "" }]);
  };

  const upload = (items) => {
    setError(null);
    items.forEach((item) => {
      const fileName = new Date().getTime() + item.label + item.file.name;
      const uploadTask = storage.ref(`/items/${fileName}`).put(item.file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(Math.round(progress));
          console.log(item.file.name + progress + "% done");
        },
        (error) => {
          console.error(error);
          setError("Failed to upload some files. Please try again.");
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((url) => {
            if (item.label.startsWith('episodeVideo') || item.label.startsWith('episodeThumbnail')) {
              const index = parseInt(item.label.replace(/^\D+/g, ''), 10);
              const label = item.label.includes('Video') ? 'video' : 'thumbnail';
              setEpisodes((prev) => {
                const updatedEpisodes = [...prev];
                updatedEpisodes[index][label] = url;
                return updatedEpisodes;
              });
            } else {
              setMovie((prev) => {
                return { ...prev, [item.label]: url };
              });
            }
            setUploaded((prev) => prev + 1);
          });
        }
      );
    });
  };

  const handleUpload = (e) => {
    e.preventDefault();
    setProgress(0); // Reset progress before starting a new upload
    const itemsToUpload = [
      { file: img, label: "img" },
      { file: imgTitle, label: "imgTitle" },
      { file: imgSm, label: "imgSm" },
      { file: trailer, label: "trailer" },
      { file: video, label: "video" },
    ];

    episodes.forEach((episode, index) => {
      if (episode.video) {
        itemsToUpload.push({ file: episode.video, label: `episodeVideo${index}` });
      }
      if (episode.thumbnail) {
        itemsToUpload.push({ file: episode.thumbnail, label: `episodeThumbnail${index}` });
      }
    });

    console.log(itemsToUpload, 'items to upload');
    upload(itemsToUpload);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMovie({ ...movie, episodes }, dispatch);
  };

  return (
    <div className="newProduct">
      <h1 className="addProductTitle">New Movie</h1>
      <div className="tabs">
        <button type="button" className={`tab ${movie.isSeries === "false" && "active"}`} onClick={() => setMovie({ ...movie, isSeries: "false" })}>Movie</button>
        <button type="button" className={`tab ${movie.isSeries === "true" && "active"}`} onClick={() => setMovie({ ...movie, isSeries: "true" })}>Series</button>
      </div>
      <form>
        <div className="addProductForm">
          <div className="addProductItem">
            <label>Image</label>
            <input type="file" id="img" name="img" onChange={(e) => setImg(e.target.files[0])} />
          </div>
          <div className="addProductItem">
            <label>Title image</label>
            <input type="file" id="imgTitle" name="imgTitle" onChange={(e) => setImgTitle(e.target.files[0])} />
          </div>
          <div className="addProductItem">
            <label>Thumbnail image</label>
            <input type="file" id="imgSm" name="imgSm" onChange={(e) => setImgSm(e.target.files[0])} />
          </div>
          <div className="addProductItem">
            <label>Title</label>
            <input type="text" placeholder="John Wick" name="title" onChange={handleChange} />
          </div>
          <div className="addProductItem">
            <label>Description</label>
            <textarea type="text" placeholder="description" name="desc" onChange={handleChange} />
          </div>
          <div className="addProductItem">
            <label>Year</label>
            <input type="text" placeholder="Year" name="year" onChange={handleChange} />
          </div>
          <div className="addProductItem">
            <label>Genre</label>
            <input type="text" placeholder="Genre" name="genre" onChange={handleChange} />
          </div>
          <div className="addProductItem">
            <label>Limit</label>
            <input type="text" placeholder="limit" name="limit" onChange={handleChange} />
          </div>
          <div className="addProductItem">
            <label>Trailer</label>
            <input type="file" name="trailer" onChange={(e) => setTrailer(e.target.files[0])} />
          </div>
          <div className="addProductItem">
            <label>Video</label>
            <input type="file" name="video" onChange={(e) => setVideo(e.target.files[0])} />
          </div>
        </div>
        {movie.isSeries === "true" &&
          episodes.map((episode, index) => (
            <div key={index} className="addProductForm">
              <div className="addProductItem">
                <label>Episode {index + 1} Title</label>
                <input type="text" placeholder={`Episode ${index + 1} Title`} name="title" value={episode.title} onChange={(e) => handleEpisodeChange(index, e)} />
              </div>
              <div className="addProductItem">
                <label>Episode {index + 1} Duration</label>
                <input type="text" placeholder="Duration" name="duration" value={episode.duration} onChange={(e) => handleEpisodeChange(index, e)} />
              </div>
              <div className="addProductItem">
                <label>Episode {index + 1} Description</label>
                <textarea placeholder={`Episode ${index + 1} Description`} name="desc" value={episode.desc} onChange={(e) => handleEpisodeChange(index, e)} />
              </div>
              <div className="addProductItem">
                <label>Episode {index + 1} Video</label>
                <input type="file" name="video" onChange={(e) => handleEpisodeChange(index, e)} />
              </div>
              <div className="addProductItem">
                <label>Episode {index + 1} Thumbnail</label>
                <input type="file" name="thumbnail" onChange={(e) => handleEpisodeChange(index, e)} />
              </div>
            </div>
          ))}
        {movie.isSeries === "true" && (
          <button type="button" onClick={addEpisode}>
            Add Episode
          </button>
        )}
        {movie.isSeries !== "true" && (
          <div className="addProductItem">
            <label>Duration</label>
            <input type="text" placeholder="Duration" name="duration" onChange={handleChange} />
          </div>
        )}
        {uploaded === 5 + episodes.length * 2 ? (
          <button className="addProductButton" onClick={handleSubmit}>
            Create
          </button>
        ) : (
          <button className="addProductButton" onClick={handleUpload}>
            Upload
          </button>
        )}
        {uploaded > 0 && (
          <div className="progressContainer">
            <div className="progressBar" style={{ width: `${progress}%` }}></div>
            <span>{progress}%</span>
          </div>
        )}
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}
