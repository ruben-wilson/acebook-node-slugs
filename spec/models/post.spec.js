require("../mongodb_helper");
const Post = require("../../models/post");
const User = require("../../models/user");

describe("Post model", () => {
  beforeEach((done) => {
    Post.deleteMany(() => {
      User.deleteMany(() => {
        done();
      });
    });
  });

  it("has a message", () => {
    var post = new Post({ message: "some message" });
    expect(post.message).toEqual("some message");
  });

  it("can list all posts", (done) => {
    Post.find((err, posts) => {
      expect(err).toBeNull();
      expect(posts).toEqual([]);
      done();
    });
  });

  it("can save a post", (done) => {
    var post = new Post({ message: "some message" });

    post.save((err) => {
      expect(err).toBeNull();

      Post.find((err, posts) => {
        expect(err).toBeNull();

        expect(posts[0]).toMatchObject({ message: "some message" });
        done();
      });
    });
  });

  it("adds a user's ID to the post when created", (done) => {
    const user = new User({
      username: "someone",
      first_name: "some",
      last_name: "one",
      email: "someone@example.com",
      password: "password",
      friends: [],
    });

    let userId;

    // saves user to table
    user.save((err) => {
      expect(err).toBeNull();

      // finds user in table
      User.find((err, user) => {
        expect(err).toBeNull();
        userId = user[0]._id;
        expect(userId).toBeTruthy();

        // create post with user's id
        const post = new Post({
          message: "some message",
          user_id: userId,
        });

        // save post
        post.save((err) => {
          expect(err).toBeNull();

          // find saved post
          Post.find((err, posts) => {
            expect(err).toBeNull();
            expect(posts[0]).toMatchObject({
              message: "some message",
              user_id: userId,
            });

            // find user using ID from saved post
            User.find({ _id: userId }, (err, user) => {
              expect(err).toBeNull();
              expect(user[0].username).toEqual("someone");
              done();
            });
          });
        });
      });
    });
  });

  it("deletes a post", (done) => {
    const post = new Post({ message: "some message" });

    // save Post
    post.save((err) => {
      expect(err).toBeNull();

      // find id of saved post
      Post.find((err, posts) => {
        expect(err).toBeNull();

        // delete post
        Post.deleteOne({ _id: posts[0]._id }, (err, result) => {
          expect(err).toBeNull();
          expect(result).toMatchObject({ n: 1, ok: 1, deletedCount: 1 });

          // check post is deleted
          Post.findOne({ _id: posts[0]._id }, (err, post) => {
            expect(err).toBeNull();
            expect(post).toBeNull();
            done();
          });
        });
      });
    });
  });

  it("adds a like to the post database", (done) => {
    // creates new user
    const user = new User({
      username: "someone",
      first_name: "some",
      last_name: "one",
      email: "someone@example.com",
      password: "password",
      friends: [],
    });

    let userId;

    // saves user to table
    user.save((err) => {
      expect(err).toBeNull();

      // finds user in table
      User.find((err, user) => {
        expect(err).toBeNull();
        userId = user[0]._id;
        expect(userId).toBeTruthy();

        // create post with a like incl. user_id
        const post = new Post({
          message: "some message",
          likes: [user[0]._id],
        });

        // save post
        post.save((err) => {
          expect(err).toBeNull();

          // find saved post
          Post.find((err, posts) => {
            expect(err).toBeNull();
            expect(posts[0].message).toEqual("some message");
            expect(posts[0].likes[0]).toEqual(userId);
            done();
          });
        });
      });
    });
  });

  it("returns an object when trying to delete a post that doesn't exist", (done) => {
    Post.deleteOne({ message: "some message" }, (err, result) => {
      expect(err).toBeNull();
      expect(result).toMatchObject({ n: 0, ok: 1, deletedCount: 0 });
      done();
    });
  });

  it("it checks that found posts can be mapped into objects with new attributes", (done) => {
    const post = new Post({ message: "some message" });

    // save Post
    post.save((err) => {
      expect(err).toBeNull();

      // find id of saved post
      Post.find((err, posts) => {
        expect(err).toBeNull();
        posts = posts.map((post) => {
          return { post: post, isUser: true };
        });
        expect(posts[0].isUser).toEqual(true);
        done();
      });
    });
  });

  it("adds a key:value pair to the ._doc value in the MongoDB object", (done) => {
    const post = new Post({ message: "some message" });

    // save Post
    post.save((err) => {
      expect(err).toBeNull();

      // find id of saved post
      Post.find((err, posts) => {
        expect(err).toBeNull();
        // checking that logic can be written to the newKey
        posts.forEach((post) => (post._doc.newKey = 1 + 1 === 2));
        expect(posts[0]._doc.newKey).toBe(true);
        done();
      });
    });
  });
});
