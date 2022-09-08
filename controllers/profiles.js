const User = require("../models/user");

const ProfilePage = {
  Index: (req, res) => {
    const profileUsername = req.params.username;
    User.find({ username: profileUsername }, (err, user) => {
      if (err) {
        console.log(err);
      } else {
        res.render("profiles/index", {
          profileUsername: profileUsername,
          friends: user[0].friends,
          fetchUrl: "/friends/requests/new/" + user[0].username,
        });
      }
    });
  },
};

module.exports = ProfilePage;
