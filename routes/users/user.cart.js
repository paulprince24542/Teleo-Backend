var Router = require("express").Router();
const sequelize = require("../../config/DbConfig");
var { authenticateJWTUser } = require("../../middlewares/userJWT");
var {v4: uuidv4} = require("uuid")
var Cart = require("../../models/user-cart");
var Orders = require("../../models/orders");
var Product = require("../../models/vendor-products");
const User = require("../../models/users");
const UserCart = require("../../models/user-cart");

Router.post("/addtocart/:productid", authenticateJWTUser, async (req, res) => {
  console.log(req.params);
  var findProduct = await Cart.findOne({
    where: {
      vendorproductId: req.params.productid,
      userId: req.user.id,
    },
  });
  console.log(findProduct);
  if (findProduct == null) {
    var newProduct = await Cart.create({
      vendorproductId: req.params.productid,
      quantity: req.body.quantity,
      userId: req.user.id,
    });
    if (newProduct) {
      res.status(200).json({
        msg: "Product Added to your cart",
      });
    }
  } else {
    res.status(200).json({
      msg: "Product is already in your card",
    });
  }
});

Router.post("/buycart", authenticateJWTUser, async (req, res) => {
  var findId = await Cart.findAll({
    raw: true,
    nest: true,
    include: [
      {
        model: Product,
        attributes: {
          exclude: ["id","productimage","category","subcategory","", "productname", "desc", "quantity", "createdAt", "updatedAt"],
        },
      },
    ],
  });
  
  console.log(findId);
 var uid = uuidv4()
  var bulkData = findId.map(data => ({
    productid: data.vendorproductId,
    orderid: uid,
    price: data.vendorproduct.mrp,
    quantity: data.quantity,
    ordertype: req.body.type,
    userId: req.user.id
  }))

  console.log(bulkData)
  var newOrder = await Orders.bulkCreate(bulkData);
  console.log(newOrder)
  if(bulkData){
    Orders.destroy({
      where:{
        userId: req.user.id
      }
    })
  }
  res.status(200).json(findId);
});

module.exports = Router;
