import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useParams, Link } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";

function ProfileFollow(props) {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [follows, setFollows] = useState([]);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function fetchPosts() {
      try {
        const res = await Axios.get(`/profile/${username}/${props.action}`, { cancelToken: ourRequest.token });
        setFollows(res.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchPosts();
    return () => {
      ourRequest.cancel();
    };
  }, [props.action]);

  if (isLoading) return <LoadingDotsIcon />;

  return (
    <div className="list-group">
      {props.action == "followers" && follows.length == 0 ? <p className="text-muted">No followers here!</p> : ""}
      {props.action == "following" && follows.length == 0 ? <p className="text-muted">This user isn't following anyone</p> : ""}
      {follows.map((follow, index) => {
        return (
          <Link key={index} to={`/profile/${follow.username}`} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={follow.avatar} />
            {follow.username}
          </Link>
        );
      })}
    </div>
  );
}

export default ProfileFollow;
