const express = require("express");

const Accounts = require("../data/dbConfig");

const router = express.Router();

// GET all accounts
router.get("/", (req, res) => {
  Accounts.select("*")
    .from("accounts")
    .then(account => {
      res.status(200).json(account);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: "error fetching accounts"
      });
    });
});

// GET account by id
router.get("/:id", (req, res) => {
  Accounts.select("*")
    .from("accounts")
    .where({ id: req.params.id })
    .first()
    .then(account => {
      res.status(200).json(account);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ errorMessage: "error fetching account" });
    });
});

//POST a new account
router.post("/",validateAccount, (req, res) => {
  const body = req.body;
  Accounts("accounts")
    .insert(body, "id")
    .then(ids => {
      const id = ids[0];

      return Accounts("accounts")
        .select("id", "name", "budget")
        .where({ id })
        .first()
        .then(account => {
          res.status(201).json(account);
        })
        .catch(error => {
          console.log(error);
          res.status(500).json({
            errorMessage: "error posting account"
          });
        });
    });
});

//PUT update an existing account
router.put("/:id", validateAccount, (req, res) => {
  const { id } = req.params;
  const update = req.body;

  Accounts("accounts")
    .where({ id })
    .update(update)
    .then(count => {
      if (count > 0) {
        res.status(200).json({
          message: `${count} account(s) updated`
        });
      } else {
        res.status(404).json({ message: "Account not found" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: "error updating account"
      });
    });
});

//DELETE deletes an account
router.delete("/:id", (req, res) => {
  Accounts("accounts")
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(200).json({
          message: `${count} account(s) deleted`
        });
      } else {
        res.status(404).json({ message: "Account not found" });
      }
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: "error deleting account"
      });
    });
});

// validation middle ware
function validateAccount(req,res,next){
    !req.body
    ? res.status(400).json({
        message: "missing account data"
      })
    : !req.body.name
    ? res.status(400).json({
        message: "missing account name"
      })
    : !req.body.budget
    ? res.status(400).json({
        message: "missing account budget"
      })
    : next();
}

module.exports = router;
