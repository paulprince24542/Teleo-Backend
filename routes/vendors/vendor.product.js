var Router = require("express").Router();

var multer = require("multer");

var storage = multer.memoryStorage();
var upload = multer({
  storage: storage,
}).single("file");
var { authenticateJWT } = require("../../middlewares/vendorJWT");
const s3Bucket = require("../../config/awsConfig");

var Product = require("../../models/vendor-products");
var Profile = require("../../models/vendor-profile");
var Catload = require("../../models/categorysort");

var { productImage } = require("../../middlewares/uploadValidate");
const Roles = require("../../models/roles");
const sequelize = require("../../config/DbConfig");

// @Route /api/vendor/product/add
Router.post("/add", authenticateJWT, async (req, res) => {
  console.log(req.body);
  upload(req, res, async (err) => {
    var findProduct = await Product.findOne({
      where: {
        productname: req.body.name,
      },
    });
    console.log(findProduct);
    if (findProduct == null) {
      if (req.file) {
        var newProduct = await Product.create({
          productname: req.body.name,
          category: req.body.category,
          subcategory: req.body.subcategory,
          mrp: req.body.mrp,
          quantity: req.body.quantity,
          unit: req.body.unit,
          desc: req.body.desc,
          vendorId: req.user.id,
        });
        console.log(newProduct)
        var params = productImage(
          req.file,
          newProduct.dataValues.id,
          "vendorproductsimages"
        );
        s3Bucket.upload(params, async (err, data) => {
          if (err) throw err;
          var productUpdated = await Product.update(
            {
              productimage: data.Location,
            },
            {
              where: {
                id: newProduct.dataValues.id,
              },
            }
          );
          if (productUpdated) {
            res.status(200).json({
              msg: "Product Added",
            });
          }
        });
      } else {
        res.status(400).json({
          msg: "Product Image required",
        });
      }
    } else {
      console.log("Hi");
    }
  });
});

// @Route /api/vendor/product/fetch/category
Router.get("/fetch/category", authenticateJWT, async (req, res) => {
  var findType = await Profile.findOne({
    vendorId: req.user.id,
  });
  console.log(findType.dataValues.type);
  // var findCategories = await Catload.findAll({

  //   raw: true,
  //   where:{
  //     type:findType.dataValues.type
  //   }
  // })
  var findCategories = await sequelize.query(
    "select distinct category from catloads where type = (:type)",
    {
      // raw: true,
      replacements: {
        type: findType.dataValues.type,
      },
    }
  );
  var dArray = [];
  findCategories[0].forEach(function (data) {
    dArray.push(data.category);
  });
  console.log(dArray);
  if (dArray) {
    res.status(200).json({
      data: dArray,
    });
  }
});

// @Route /api/vendor/product/fetch/category
Router.get("/fetch/subcategory/:category", async (req, res) => {
  var subcategories = await sequelize.query(
    "select distinct subcategory from catloads where category = (:category)",
    {
      replacements: {
        category: req.params.category,
      },
    }
  );
  var dArray = [];
  subcategories[0].forEach(function (data) {
    dArray.push(data.subcategory);
  });
  console.log(dArray);
  if (dArray) {
    res.status(200).json({
      data: dArray,
    });
  }
});


// @Route api/vendor/product/delete/:id
// @Method DELETE
// Product Delete
Router.delete("/delete/:id", authenticateJWT, async (req,res) => {
  var deleteProduct =  await Product.destroy({
    where: {
      id: req.params.id
    }
  })
  console.log(deleteProduct)
  if(deleteProduct){
    res.status(200).json({
      msg: "Product Deleted"
    })
  }
})




Router.post("/test", (req, res) => {
  console.log(req.body);
});

module.exports = Router;
