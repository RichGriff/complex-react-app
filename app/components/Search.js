import React, { useEffect, useContext } from "react";
import DispatchContext from "../DispatchContext";
import { useImmer } from "use-immer";
import Axios from "axios";
import { Link } from "react-router-dom";
import Post from "./Post";

function Search() {
  const [state, setState] = useImmer({
    searchTerm: "",
    results: [],
    show: "neither",
    requestCount: 0
  });

  const appDispatch = useContext(DispatchContext);

  // Watching for kypress event (Esca key)
  // Adds listener then removes it on clean up
  useEffect(() => {
    document.addEventListener("keyup", searchKeyPressHandler);
    return () => document.removeEventListener("keyup", searchKeyPressHandler);
  }, []);

  // Watching the search term input and adding a delay
  useEffect(() => {
    if (state.searchTerm.trim()) {
      setState(draft => {
        draft.show = "loading";
      });
      const delay = setTimeout(() => {
        setState(draft => {
          draft.requestCount++;
        });
      }, 750);
      // Clean up - clear timeout if more typing
      return () => clearTimeout(delay);
    } else {
      setState(draft => {
        draft.show = "neither";
      });
    }
  }, [state.searchTerm]);

  // Get results from database
  useEffect(() => {
    if (state.requestCount) {
      const ourRequest = Axios.CancelToken.source();
      async function fetchResults() {
        try {
          const res = await Axios.post("/search", { searchTerm: state.searchTerm }, { cancelToken: ourRequest.cancelToken });
          setState(draft => {
            draft.results = res.data;
            draft.show = "results";
          });
        } catch (error) {
          console.log(error);
        }
      }
      fetchResults();
      return () => ourRequest.cancel();
    }
  }, [state.requestCount]);

  function searchKeyPressHandler(e) {
    if (e.keyCode == 27) {
      appDispatch({ type: "closeSearch" });
    }
  }

  function handleSearchInput(e) {
    const value = e.target.value;
    setState(draft => {
      draft.searchTerm = value;
    });
  }

  return (
    <div className="search-overlay">
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input onChange={handleSearchInput} autoFocus type="text" autoComplete="off" id="live-search-field" className="live-search-field" placeholder="What are you interested in?" />
          <span onClick={e => appDispatch({ type: "closeSearch" })} className="close-live-search">
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div className={"circle-loader " + (state.show == "loading" ? "circle-loader--visible" : "")} />
          <div className={"live-search-results " + (state.show == "results" ? "live-search-results--visible" : "")}>
            {Boolean(state.results.length) && (
              <div className="list-group shadow-sm">
                <div className="list-group-item active">
                  <strong>Search Results</strong> ({state.results.length} {state.results.length > 1 ? "items" : "item"} found)
                </div>

                {state.results.map(post => {
                  return (
                    <Post
                      post={post}
                      key={post._id}
                      onClick={() =>
                        appDispatch({
                          type: "closeSearch"
                        })
                      }
                    />
                  );
                })}
              </div>
            )}
            {!Boolean(state.results.length) && <p className="alert alert-danger text-center shadown-sm">Sorry we could not find any results for that search</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
