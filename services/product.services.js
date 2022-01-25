const multer = require("multer");
const config = require("../config/config");
const AWS = require("aws-sdk");
const cryptostring = require("crypto-random-string");
const shortid = require("shortid");
var storage = multer.memoryStorage();
var upload = multer({
  storage: storage,
}).single("file");

var s3Bucket = new AWS.S3({
  accessKeyId: config.AWS_accessKeyId,
  secretAccessKey: config.AWS_secretAccessKey,
  region: config.AWS_region,
});

function addProduct(req, res, product) {
  upload(req, res, (err) => {
    const file = req.file;
    if (err) {
      res.status(400).json({
        msg: "Something gone wrong",
      });
    }
    if (!req.file) {
      res
        .json({
          msg: "No Image",
        })
        .status(204);
    } else {
      if (
        req.file.mimetype == "image/jpeg" ||
        req.file.mimetype == "image/jpg" ||
        req.file.mimetype == "image/png"
      ) {
        var params = {
          Bucket: "vendorproductsimages",
          Key: shortid.generate(),
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: "public-read",
        };

        s3Bucket.upload(params, (err, data) => {
          if (err) {
            res.status(500).json({
              msg: err,
            });
          } else {
            var newProduct = new product({
              vendorId: req.user.id,
              name: req.body.name,
              unit: req.body.unit,
              category: req.body.category,
              subcategory: req.body.subcategory,
              unitprice: req.body.unitprice,
              discountprice: req.body.discountprice,
              tax: req.body.tax,
              imageurl: data.Location,
            });

            newProduct.save((err, saved) => {
              if (err) throw err;
              res.json("saved");
            });
          }
        });
      }
    }
  });
}

// function subProduct(req, res, VendorProduct) {
//   upload(req, res, (err) => {
//     const file = req.file;
//     if (err) {
//       res.status(400).json({
//         msg: "Something gone wrong",
//       });
//     }
//     if (!req.file) {
//       res
//         .json({
//           msg: "No Image",
//         })
//         .status(204);
//     } else {
//       if (
//         req.file.mimetype == "image/jpeg" ||
//         req.file.mimetype == "image/jpg" ||
//         req.file.mimetype == "image/png"
//       ) {
//         var params = {
//           Bucket: "vendorproductsimages",
//           Key: shortid.generate(),
//           Body: file.buffer,
//           ContentType: file.mimetype,
//           ACL: "public-read",
//         };
//         s3Bucket.upload(params, (err, data) => {
//           if (err) {
//             res.status(500).json({
//               msg: err,
//             });
//           } else {
//             console.log(req.user);
//             var newProduct = {
//               vendorId: req.user.userid,
//               name: req.body.name,
//               unit: req.body.unit,
//               category: req.body.category,
//               subcategory: req.body.subcategory,
//               unitprice: req.body.unitprice,
//               discountprice: req.body.discountprice,
//               tax: req.body.tax,
//               imageurl: data.Location,
//             };
//             VendorProduct.insertMany(
//               {
                
                
//               },
//               (err, inserted) => {
//                 if (err) throw err;
//                 res.send("Success");
//               }
//             );
//           }
//         });
//       }
//     }
//   });
// }

module.exports.addProduct = addProduct;
// module.exports.subProduct = subProduct;
