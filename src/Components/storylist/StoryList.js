/* eslint-disable eqeqeq */
import React, { useState, useEffect, useRef } from "react";
import "./StoryList.styles.scss";
import StoryPreview from "../storypreview/StoryPreview";
import firebase from "../../firebaseConfig";
import { v4 as uuidv4 } from "uuid";

const db = firebase.firestore();

function StoryList() {
  const [stories, setStories] = useState([]);
  const [storiesComp, setStoriesComp] = useState([]);
  const [genre, setGenre] = useState("All");
  const storyGenre = useRef("");
  const storyCompletion = useRef("");
  const [completion, setCompletion] = useState("All")
 
  const [like, setLike] = useState("By Newest");
  const storyLike = useRef("");


  useEffect(() => {
    retrieveAllStoriesByGenre(genre);
  }, [genre])

  useEffect(() => {
    retrieveAllStoriesByLikes(like);
  }, [like]);

  useEffect(() => {
    retrieveAllStoriesByCompletion(completion);
  }, [completion])

  const selectGenre = (event) => {
    setGenre(event.target.value)
  }
  const selectCompletion = (event) => {
    setCompletion(event.target.value)
  }
  const selectLike = (event) => {
    setLike(event.target.value)
  }

  const retrieveAllStoriesByGenre = async (genre) => {
      if (genre === "All" || genre === undefined) {
      setStories([]);
      const data = await db.collection('StoryDatabase').orderBy('dateCreated', 'desc').get();
      setStories(stories => stories.concat(data.docs.map((doc) => doc.data())));
    } else {
      const data = await db
        .collection("StoryDatabase")
        .where("genre", "==", genre)
        .orderBy('dateCreated', 'desc')
        .get();
      setStories([]);
      setStories((stories) =>
        stories.concat(data.docs.map((doc) => doc.data()))
      );
    }
  };

  const retrieveAllStoriesByLikes = async (genre) => {
    if (genre === "By Newest" || genre === undefined) {
      const data = await db
        .collection("StoryDatabase")
        .orderBy("dateCreated", "desc")
        .get();
      setStories([]);
      setStories((stories) =>
        stories.concat(data.docs.map((doc) => doc.data()))
      );
    } else {
      const data = await db
        .collection("StoryDatabase")
        .orderBy("likes", "desc")
        .get();
      setStories([]);
      setStories((stories) =>
        stories.concat(data.docs.map((doc) => doc.data()))
      );
    }
  };

  const retrieveAllStoriesByCompletion = async (completion) => {
    if (completion === "All" || completion === undefined) {
      const data = await db.collection('StoryDatabase').orderBy('dateCreated', 'desc').get();
      setStoriesComp([]);
      setStoriesComp(storiesComp => storiesComp.concat(data.docs.map((doc) => doc.data())));
    } else if (completion == "Finished") {
      const data = await db.collection('StoryDatabase').where('isCompleted', "==", true).orderBy("dateCreated", "desc").get();    
      setStoriesComp([]);
      setStoriesComp(storiesComp => storiesComp.concat(data.docs.map((doc) => doc.data())));
  } else if (completion == "Unfinished") {
      const data = await db.collection('StoryDatabase').where('isCompleted', "==", false).orderBy("dateCreated", "desc").get();
      setStoriesComp([]);
      setStoriesComp(storiesComp => storiesComp.concat(data.docs.map((doc) => doc.data())));
  }
};

  return (
    <div className="display-story">     
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 filter-wrapper">
            <button className="button">Filter Stories</button>
            <div className="genre-filter">
              <form>
                <label id="select-genre">Genre:</label>
                <select
                  labelId="select-genre"
                  id="select-dropdown"
                  value={genre}
                  onChange={selectGenre}
                  ref={storyGenre}
                >
                  <option value={"All"}>All</option>
                  <option value={"Crime"}>Crime</option>
                  <option value={"Fan Fiction"}>Fan Fiction</option>
                  <option value={"Fantasy"}>Fantasy</option>
                  <option value={"Historical"}>Historical</option>
                  <option value={"Horror"}>Horror</option>
                  <option value={"Humor"}>Humor</option>
                  <option value={"Romance"}>Romance</option>
                  <option value={"Sci-fi"}>Sci-fi</option>
                  <option value={"Thriller"}>Thriller</option>
                  <option value={"Other"}>Other</option>
                </select>
            </form>
            </div>

            <div className="sort-filter">
              <form>
                <label id="select-sort">Sort by:</label>
                <select
                  labelid="select-sort"
                  id="sort-dropdown"
                  value={like}
                  onChange={selectLike}
                  ref={storyLike}
                >
                  <option value={"By Newest"}>By Newest</option>
                  <option value={"Most Liked"}>By Likes</option>
                </select>
              </form>
            </div>
            
            <div className="completion-filter">
              <form>
                <label id="select-completion">Completion:</label>
                <select
                  labelid="select-completion"
                  id="completion-dropdown"
                  value={completion}
                  onChange={selectCompletion}
                  ref={storyCompletion}
                >
                  <option value={"All"}>All</option>
                  <option value={"Finished"}>Finished Stories</option>
                  <option value={"Unfinished"}>Unfinished Stories</option>
                </select>
              </form>
            </div>
         </div>
        </div>

        <div className="row">
          <div className="col-12">

            {
              completion != "All" ?
              storiesComp.map((story) => {
                return (
                  <div className="col-12" key={uuidv4()}>
                    <StoryPreview storyProp={story.id} />
                  </div>
                );
              })
              :
                stories.map((story) => {
                  return (
                    <div className="container" key={uuidv4()}>
                      <StoryPreview storyProp={story.id} />
                    </div>
                  );
                })
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoryList;
