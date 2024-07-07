import { Link, useLocation } from "react-router-dom";
import "./list.css";
import { useState, useContext, useEffect } from "react";
import { updateList } from "../../context/listContext/apiCalls";
import { ListContext } from "../../context/listContext/ListContext";
import Swal from "sweetalert2";
import { getMovies } from "../../context/movieContext/apiCalls";
import { MovieContext } from "../../context/movieContext/MovieContext";

export default function List() {
  const location = useLocation();
  const { list, id } = location || {}; // Ensure list and id are passed via location.state
  const { dispatch } = useContext(ListContext);

  const [currentList, setCurrentList] = useState(list || {});
  const { movies, dispatch: movieDispatch } = useContext(MovieContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        await getMovies(movieDispatch);
      } catch (error) {
        console.error("Failed to fetch movies", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [movieDispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentList((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (e) => {
    const value = Array.from(e.target.selectedOptions, (option) => option.value);
    setCurrentList((prev) => ({ ...prev, content: value }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    console.log("Updating list with:", currentList); // Add logging
    try {
      await updateList(id, currentList, dispatch);
      Swal.fire("Success", "List updated successfully", "success");
    } catch (err) {
      console.error("Failed to update list", err);
      Swal.fire("Error", "Failed to update list", "error");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="product">
      <div className="productTitleContainer">
        <h1 className="productTitle">List</h1>
        <Link to="/newList">
          <button className="productAddButton">Create</button>
        </Link>
      </div>
      <div className="productTop">
        <div className="productTopRight">
          <div className="productInfoTop">
            <span className="productName">{currentList?.title}</span>
          </div>
          <div className="productInfoBottom">
            <div className="productInfoItem">
              <span className="productInfoKey">id:</span>
              <span className="productInfoValue">{currentList?._id}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">genre:</span>
              <span className="productInfoValue">{currentList?.genre}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">type:</span>
              <span className="productInfoValue">{currentList?.type}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="productBottom">
        <form className="productForm">
          <div className="productFormLeft">
            <label>List Title</label>
            <input
              type="text"
              name="title"
              value={currentList?.title}
              onChange={handleChange}
            />
            <label>Type</label>
            <input
              type="text"
              name="type"
              value={currentList?.type}
              onChange={handleChange}
            />
            <label>Genre</label>
            <input
              type="text"
              name="genre"
              value={currentList?.genre}
              onChange={handleChange}
            />
          </div>
          <div className="formRight">
            <div className="addProductItem">
              <label>Content</label>
              <select
                multiple
                name="content"
                value={currentList?.content}
                onChange={handleSelect}
                style={{ height: "280px" }}
              >
                {movies?.map((movie) => (
                  <option key={movie._id} value={movie._id}>
                    {movie.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="productFormRight">
            <button className="productButton" type="submit" onClick={handleUpload}>
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
