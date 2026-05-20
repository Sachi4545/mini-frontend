import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API = "https://mini-n54f.onrender.com";

function Dashboard() {

  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);

  const [commentText, setCommentText] = useState({});
  const [showCommentBox, setShowCommentBox] = useState({});



  // USER

  const storedUser = localStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  const username = user?.name;




  // FETCH POSTS

  const fetchPosts = async () => {

    try {

      const res = await axios.get(
        "https://mini-n54f.onrender.com/posts"
      );

      setPosts(res.data);

    } catch(error){

      console.log(error);

    }

  };



  useEffect(() => {

    fetchPosts();

  }, []);




  // CREATE POST

  const createPost = async () => {

    try {

      const formData = new FormData();

      formData.append("user", username);
      formData.append("caption", caption);

      if(image){

        formData.append("image", image);

      }

      await axios.post(
        "https://mini-n54f.onrender.com/posts/create",
        formData
      );

      alert("Post Created");

      setCaption("");
      setImage(null);

      fetchPosts();

    } catch(error){

      console.log(error);

      alert("Error creating post");

    }

  };




  // ADD COMMENT

  const addComment = async (postId) => {

    if(!commentText[postId]){
      return;
    }

    try {

      await axios.post(

        `https://mini-n54f.onrender.com/posts/comment/${postId}`,

        {
          user: username,

          text: `@${posts.find(
            (p) => p._id === postId
          )?.user} ${commentText[postId]}`
        }

      );

      setCommentText({
        ...commentText,
        [postId]: ""
      });

      fetchPosts();

    } catch(error){

      console.log(error);

    }

  };




  // LIKE POST

  const likePost = async (postId) => {

    try {

      await axios.put(
        `https://mini-n54f.onrender.com/posts/like/${postId}`
      );

      fetchPosts();

    } catch(error){

      console.log(error);

    }

  };




  // SHARE POST

  const sharePost = async (post) => {

    const shareData = {

      title: `${post.user}'s Post`,

      text: post.caption,

      url: `https://mini-n54f.onrender.com/uploads/${post.image}`

    };

    try {

      if(navigator.share){

        await navigator.share(shareData);

      } else {

        navigator.clipboard.writeText(
`${post.caption}
https://mini-n54f.onrender.com/uploads/${post.image}`
        );

        alert("Post copied!");

      }

    } catch(error){

      console.log(error);

    }

  };




  // DELETE POST

  const deletePost = async (postId) => {

    try {

      await axios.delete(
        `https://mini-n54f.onrender.com/posts/delete/${postId}`
      );

      fetchPosts();

    } catch(error){

      console.log(error);

    }

  };




  // LOGOUT

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");

  };




  return (

    <div
      style={{
        background: "#f0f2f5",
        minHeight: "100vh"
      }}
    >


      {/* NAVBAR */}

      <div
        style={{
          background: "white",
          padding: "15px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
        }}
      >


        {/* LEFT */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px"
          }}
        >

          <div
            style={{
              position: "relative"
            }}
          >

            <img
              src={`https://mini-n54f.onrender.com/uploads/${user?.profilePic}`}
              alt="profile"
              style={{
                width: "55px",
                height: "55px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #1877f2"
              }}
            />



            <label
              htmlFor="profileUpload"
              style={{
                position: "absolute",
                bottom: "-2px",
                right: "-2px",
                width: "22px",
                height: "22px",
                background: "#1877f2",
                color: "white",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "18px"
              }}
            >
              +
            </label>



            <input
              type="file"
              id="profileUpload"
              accept="image/*"
              style={{
                display: "none"
              }}

            onChange={async (e) => {

                const file = e.target.files[0];

                if(!file){
                    return;
                }

                try {

                    const formData = new FormData();

                    formData.append("profilePic", file);

                    const response = await axios.put(

                    `https://mini-n54f.onrender.com/users/update-profile/${user._id}`,

                    formData

                    );



                    localStorage.setItem(
                    "user",
                    JSON.stringify(response.data)
                    );



                    window.location.reload();

                } catch(error){

                    console.log(error.response?.data);

                    alert("Upload failed");

                }

            }}
            />

          </div>



          <div
            style={{
              fontSize: "18px",
              fontWeight: "bold"
            }}
          >
            {username}
          </div>

        </div>



        {/* RIGHT */}

        <button
          onClick={logout}
          style={{
            background: "red",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>

      </div>




      {/* FEED */}

      <div
        style={{
          width: "500px",
          margin: "30px auto"
        }}
      >


        {/* CREATE POST */}

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
          }}
        >

          <textarea
            rows="4"
            placeholder="What's on your mind?"
            value={caption}
            onChange={(e) =>
              setCaption(e.target.value)
            }
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              resize: "none",
              boxSizing: "border-box"
            }}
          />

          <br /><br />

          <input
            type="file"
            onChange={(e) =>
              setImage(e.target.files[0])
            }
          />

          <br /><br />

          <button
            onClick={createPost}
            style={{
              padding: "10px 15px",
              border: "none",
              background: "#1877f2",
              color: "white",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Create Post
          </button>

        </div>




        {/* POSTS */}

        {

          posts.map((post) => (

            <div
              key={post._id}
              style={{
                background: "white",
                padding: "20px",
                marginBottom: "20px",
                borderRadius: "10px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
              }}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >

                <h3>{post.user}</h3>

                <button
                  onClick={() =>
                    deletePost(post._id)
                  }
                  style={{
                    border: "none",
                    background: "red",
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>

              </div>



              <p>{post.caption}</p>



              {
                post.image && (

                  <img
                    src={`https://mini-n54f.onrender.com/uploads/${post.image}`}
                    alt=""
                    style={{
                      width: "100%",
                      borderRadius: "10px",
                      marginTop: "10px"
                    }}
                  />

                )
              }




              <button
                onClick={() =>
                  likePost(post._id)
                }
                style={{
                  marginTop: "15px",
                  marginRight: "10px",
                  padding: "10px 15px",
                  border: "none",
                  background: "#e4e6eb",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                ❤️ Like {post.likes}
              </button>



              <button
                onClick={() =>
                  sharePost(post)
                }
                style={{
                  marginTop: "15px",
                  padding: "10px 15px",
                  border: "none",
                  background: "#42b72a",
                  color: "white",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                🔗 Share
              </button>




              <button
                onClick={() =>

                  setShowCommentBox({

                    ...showCommentBox,

                    [post._id]:
                    !showCommentBox[post._id]

                  })

                }

                style={{
                  marginTop: "15px",
                  marginLeft: "10px",
                  padding: "10px 15px",
                  border: "none",
                  background: "#1877f2",
                  color: "white",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                💬 Comment
              </button>




              {
                showCommentBox[post._id] && (

                  <div
                    style={{
                      marginTop: "15px"
                    }}
                  >

                    <input
                      type="text"
                      placeholder="Add comment..."
                      value={
                        commentText[post._id] || ""
                      }

                      onChange={(e) =>

                        setCommentText({

                          ...commentText,

                          [post._id]:
                          e.target.value

                        })

                      }

                      style={{
                        width: "100%",
                        padding: "12px",
                        border:
                        "1px solid #ccc",
                        borderRadius: "5px",
                        boxSizing: "border-box"
                      }}
                    />

                    <button
                      onClick={() =>
                        addComment(post._id)
                      }

                      style={{
                        marginTop: "10px",
                        padding: "10px 15px",
                        border: "none",
                        background: "#1877f2",
                        color: "white",
                        borderRadius: "5px",
                        cursor: "pointer"
                      }}
                    >
                      Post Comment
                    </button>

                  </div>

                )
              }




              {/* COMMENTS */}

              <div
                style={{
                  marginTop: "15px"
                }}
              >

                {
                  post.comments.map(

                    (comment, index) => (

                      <div
                        key={index}

                        style={{
                          background: "#f5f5f5",
                          padding: "10px",
                          borderRadius: "8px",
                          marginTop: "10px"
                        }}
                      >

                        <span
                          style={{
                            fontWeight: "bold"
                          }}
                        >
                          {comment.user}:
                        </span>{" "}

                        {

                          comment.text
                          .split(" ")
                          .map((word, i) => (

                            word.startsWith("@")

                            ? (

                              <span
                                key={i}
                                style={{
                                  color: "#1877f2",
                                  fontWeight: "bold"
                                }}
                              >
                                {word}{" "}
                              </span>

                            )

                            : (

                              <span key={i}>
                                {word}{" "}
                              </span>

                            )

                          ))

                        }

                      </div>

                    )

                  )
                }

              </div>

            </div>

          ))

        }

      </div>

    </div>

  );

}

export default Dashboard;