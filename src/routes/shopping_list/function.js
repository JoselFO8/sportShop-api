const { User, Product } = require("../../db");

const get_item = async (req, res) => {
  try {
    const { id } = req.params;
    //validaciones
    if (!id) return res.send({ msg: "user is required" });
    if (Number.isNaN(id)) return res.send({ msg: "user must be a number" });

    //existencia de usuario
    const user = await User.findOne({ where: { id } });
    if (!user) return res.send({ msg: "user not found" });

    let itemsId = Object.keys(user.trolly);

    let items = await Product.findAll({
      where: { id: itemsId },
    });

    items = items.map((x) => {
      return {
        sizesAmount: user.trolly[x.id],
        title: x.title,
        Product_id: x.id,
        price: x.price,
        image: x.image,
        description: x.description,
        category: x.category,
      };
    });

    res.send({ msg: "items found", list: items });
  } catch (e) {
    res.send({ msg: "failed to get items", error: e });
    console.log(e);
  }
};

//resivo id del item a borrar
const delete_item = async (req, res) => {
  try {
    const { product } = req.query;
    const { user } = req.query;

    //validaciones de user
    if (!user) return res.send({ msg: "user is required" });
    if (Number.isNaN(user)) return res.send({ msg: "user must be a number" });

    //validaciones de product
    if (!product) return res.send({ msg: "product is required" });
    if (Number.isNaN(product))
      return res.send({ msg: "product must be a number" });

    //existencia de usuario
    let userObj = await User.findOne({ where: { id: user } });
    if (!userObj) return res.send({ msg: "user not found" });

    //existencia de producto
    let productObj = await Product.findOne({ where: { id: product } });
    if (!productObj) return res.send({ msg: "product not found" });

    userObj.trolly = { ...userObj.trolly, [productObj.id]: undefined };
    await userObj.save();

    res.send({ msg: "item deleted", list: userObj.trolly });
  } catch (e) {
    console.log(e);
    res.send({ msg: "failed to delete item", error: e });
  }
};

const empty_trolly = async (req, res) => {
  try {
    const { user } = req.query;

    //validaciones de user
    if (!user) return res.send({ msg: "user is required" });
    if (Number.isNaN(user)) return res.send({ msg: "user must be a number" });

    const userObj = await User.findOne({ where: { id: user } });
    userObj.trolly = {};
    await userObj.save();
    res.send({ msg: "trolly has been emptied" });
  } catch (e) {
    res.send(e);
  }
};
//////////////////////////////////////////
const add_item = async (req, res) => {
  try {
    let { user, size, quantity, product } = req.body;

    //validaciones de user
    if (!user) return res.send({ msg: "user is required" });
    if (Number.isNaN(user)) return res.send({ msg: "user must be a number" });

    //validaciones de product
    if (!product) return res.send({ msg: "product is required" });
    if (Number.isNaN(product))
      return res.send({ msg: "product must be a number" });

    //validaciones de size
    if (!size) return res.send({ msg: "size is required" });
    size = size.toUpperCase();

    //validaciones de quantity
    if (!quantity) return res.send({ msg: "quantity is required" });
    if (Number.isNaN(quantity))
      return res.send({ msg: "quantity must be a number" });

    //existencia de usuario
    const userObj = await User.findOne({ where: { id: user } });
    if (!userObj) return res.send({ msg: "user not found" });

    //existencia de producto
    const item_to_add = await Product.findOne({ where: { id: product } });
    if (!item_to_add) return res.send({ msg: "product not found" });

    let propetyItem = userObj.trolly[item_to_add.id];
    propetyItem = { ...propetyItem, [size]: quantity };

    userObj.trolly = { ...userObj.trolly, [item_to_add.id]: propetyItem };

    await userObj.save();
    res.send({ msg: "item added", list: userObj.trolly });
  } catch (err) {
    res.send({ msg: "failed to add item", error: err });
    console.log(err);
  }
};

module.exports = { get_item, delete_item, empty_trolly, add_item };
