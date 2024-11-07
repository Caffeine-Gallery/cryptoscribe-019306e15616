import Array "mo:base/Array";
import Func "mo:base/Func";
import Text "mo:base/Text";

import Time "mo:base/Time";

actor {
  // Define the Post type
  type Post = {
    title: Text;
    body: Text;
    author: Text;
    timestamp: Time.Time;
  };

  // Stable variable to store posts
  stable var posts : [Post] = [];

  // Function to add a new post
  public func addPost(title: Text, body: Text, author: Text) : async () {
    let newPost : Post = {
      title = title;
      body = body;
      author = author;
      timestamp = Time.now();
    };
    posts := Array.append<Post>(posts, [newPost]);
  };

  // Function to get all posts
  public query func getPosts() : async [Post] {
    return posts;
  };
};