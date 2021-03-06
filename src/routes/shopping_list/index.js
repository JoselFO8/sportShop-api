 const router = require("express").Router();

const {
  get_item,
delete_item,
empty_trolly,
  add_item,
} = require("./function");

router.post("", add_item);

router.delete("", delete_item);

router.delete("/all",empty_trolly);

router.get("/:id", get_item);

module.exports = { shopping_list: router }; 
