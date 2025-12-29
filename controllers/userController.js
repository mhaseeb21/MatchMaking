const User = require("../models/User");
const { uploadToS3 } = require("../utils/s3");


exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    let imageUrl = null;

    // upload single image to S3
    if (req.file) {
      imageUrl = await uploadToS3(req.file);
    }

    const data = {
      ...req.body,
    };

    if (imageUrl) {
      data.image = imageUrl; // single image field
    }

    const user = await User.findByIdAndUpdate(userId, data, { new: true });

    res.json({ msg: "Profile updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password"); 

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.browseProfiles = async (req, res) => {
  try {
    const myId = req.user.id;

    const query = { _id: { $ne: myId } };

    // optional filters
    if (req.query.gender) query.gender = req.query.gender;
    if (req.query.city) query.city = req.query.city;

    if (req.query.minAge || req.query.maxAge) {
      query.age = {};
      if (req.query.minAge) query.age.$gte = Number(req.query.minAge);
      if (req.query.maxAge) query.age.$lte = Number(req.query.maxAge);
    }

    const users = await User.find(query).select("-password");

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
