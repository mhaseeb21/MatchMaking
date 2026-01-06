const { validationResult } = require("express-validator");
const RequirementPost = require("../models/RequirementPost");

exports.createRequirementPost = async (req, res) => {
  // 1️⃣ Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // 2️⃣ Get logged-in user id from JWT
    const userId = req.user.id;

    // 3️⃣ Check if user already has an OPEN post
    const existingPost = await RequirementPost.findOne({
      user: userId,
      status: "open"
    });

    if (existingPost) {
      return res.status(400).json({
        msg: "You already have an active requirement post"
      });
    }

    // 4️⃣ Create new requirement post
    const post = await RequirementPost.create({
      user: userId, // 🔥 linked to logged-in user
      genderPreference: req.body.genderPreference,
      minAge: req.body.minAge,
      maxAge: req.body.maxAge,
      city: req.body.city,
      country: req.body.country,
      education: req.body.education,
      description: req.body.description
    });

    // 5️⃣ Send response
    res.status(201).json({
      msg: "Requirement post created successfully",
      post
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.closeRequirementPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    // 1️⃣ Find the post
    const post = await RequirementPost.findById(postId);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // 2️⃣ Check ownership
    if (post.user.toString() !== userId) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    // 3️⃣ Close post
    post.status = "closed";
    await post.save();

    res.json({ msg: "Requirement post closed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getRequirementFeed = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      city,
      gender,
      minAge,
      maxAge,
      page = 1,
      limit = 10
    } = req.query;

    // 🔎 Base query
    const query = {
      status: "open",
      user: { $ne: userId } // ❌ exclude own posts
    };

    // Optional filters
    if (city) query.city = city;
    if (gender) query.genderPreference = gender;

    if (minAge || maxAge) {
      query.$and = [];

      if (minAge) {
        query.$and.push({ maxAge: { $gte: Number(minAge) } });
      }
      if (maxAge) {
        query.$and.push({ minAge: { $lte: Number(maxAge) } });
      }
    }

    // Pagination
    const skip = (page - 1) * limit;

    const posts = await RequirementPost.find(query)
      .populate("user", "name age city image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await RequirementPost.countDocuments(query);

    res.json({
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
      posts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


exports.getMyRequirements = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query; // open | closed | undefined

    const query = { user: userId };

    if (status) {
      query.status = status;
    }

    const posts = await RequirementPost.find(query)
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};