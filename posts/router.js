const express = require(`express`);

const router = express.Router();

const db = require(`../data/db`);

router.use(express.json());

// Returns an array of all the post objects contained in the database.
router.get(`/`, (req, res) => {
  db.find()
    .then(posts => res.status(200).json(posts))
    .catch(err =>
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." })
    );
});

// Returns the post object with the specified id.
router.get(`/:id`, (req, res) => {
  db.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." })
    );
});

// Returns an array of all the comment objects associated with the post
// with the specified id.
router.get(`/:id/comments`, (req, res) => {
  db.findPostComments(req.params.id)
    .then(comments => {
      if (comments) {
        res.status(200).json(comments);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." })
    );
});

// Creates a post using the information sent inside the request body.
// expects body to contain a title and contents
router.post(`/`, (req, res) => {
  const { title, contents } = req.body;

  if (title && contents) {
    db.insert({ title: title, contents: contents })
      .then(post => res.status(201).json(post))
      .catch(err => {
        console.error(err);
        res.status(500).json({
          error: "There was an error while saving the post to the database"
        });
      });
  } else {
    res.send(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }
});

// Creates a comment for the post with the specified
// id using information sent inside of the request body.
// expect body to contain "text"
router.post(`/:id/comments`, (req, res) => {
  const id = req.params.id;
  const { text } = req.body;

  if (text) {
    db.findById(id)
      .then(post => {
        if (post) {
          db.insertComment({ post_id: id, text }).then(comment =>
            res.status(201).json(comment)
          );
        } else {
          res.status(404).json({
            message: "The post with the specified ID does not exist."
          });
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({
          error: "There was an error while saving the comment to the database"
        });
      });
  } else {
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  }
});

// Removes the post with the specified id and returns the deleted post object.
// You may need to make additional calls to the database in order to satisfy this requirement.
router.delete(`/:id`, (req, res) => {
  const id = req.params.id;

  db.findById(id)
    .then(post => {
      if (post) {
        db.remove(id).then(removed => res.status(202).json(post));
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "The post could not be removed" });
    });
});

// Updates the post with the specified id using data from the request body.
// Returns the modified document, NOT the original.
router.put(`/:id`, (req, res) => {
  const id = req.params.id;
  const postData = req.body;

  if (postData.title && postData.contents) {
    db.findById(id)
      .then(post => {
        if (post) {
          db.update(id, postData).then(post => res.status(200).json(post));
        } else {
          res.status(404).json({
            message: "The post with the specified ID does not exist."
          });
        }
      })
      .catch(err => {
        console.errror(err);
        res
          .status(500)
          .json({ error: "The post information could not be modified." });
      });
  } else {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }
});
module.exports = router;