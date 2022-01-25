const Router = require("express").Router();
const multer = require("multer");
const AWS = require("aws-sdk");
const crypto = require("crypto-random-string");
const { s3Bucket } = require("../../../services/upload.services")
var storage = multer.memoryStorage();
var upload = multer({
    storage: storage,
}).single("file");

//Authorization Params
const {
    vendorToken,
    verifyVendor,
} = require("../../../middlewares/jwt_vendor_verify");
const { addProduct, subcategoryData, categoryData, productFetch } = require("../../../Validation/Vendor/product.validation");
const { pool } = require("../../../config/postgres");
const { vendorSecret } = require("../../../config/config");



// Route: /api/products/vendor/fetch/storetype
// Type: GET
// Category Fetch
Router.get("/fetch/storetype", vendorToken, verifyVendor, async(req, res) => {
    const storetype = await pool.query("select DISTINCT storetype from storetype");
    const storeData = await storetype.rows
    console.log(storeData)
    if (storeData) {
        res.status(200).json({
            data: storeData
        })
    }
})



// Route: /api/products/vendor/fetch/category
// Type: GET
// Category Fetch
Router.get("/fetch/category", vendorToken, verifyVendor, async(req, res) => {
    // var storetype = req.body.storetype
    var storetype = await pool.query("SELECT storetype from vendorsprofile where id = $1", [req.user.id])
    const data = await pool.query("select DISTINCT category from productslist where storetype = $1", [storetype.rows[0].storetype]);
    var others = await pool.query("SELECT DISTINCT category from otherslist where id = $1", [req.user.id]);
    var other = others.rows
    var category = await data.rows
    other.forEach(element => {
        category.push(element)
    });
    if (category) {
        res.json({
            data: category

        })
    }
})

Router.get("/fetch/vendor/category", vendorToken, verifyVendor, async(req, res) => {
    var category = await pool.query("SELECT DISTINCT category from v_products where storeid = $1", [req.user.id])
        //console.log(category.rows)
    res.status(200).json({
        category: category.rows
    })
})

Router.get("/fetch/vendor/subcategory/:category", vendorToken, verifyVendor, async(req, res) => {
    var subcategory = await pool.query("SELECT DISTINCT subcategory from v_products where storeid = $1 AND category =$2", [req.user.id, req.params.category])
        //console.log(category.rows)
    res.status(200).json({
        subcategory: subcategory.rows
    })
})

// Route: /api/products/vendor/fetch/subcategory
// Type: GET
// Category Fetch
Router.get("/fetch/subcategory/:category", vendorToken,
    verifyVendor, async(req, res) => {
        const error = categoryData(req.params);
        if (error) {
            console.log(error);
            return res.status(400).json({
                error: error,
            });
        }
        var category = req.params.category;
        var storetype = await pool.query("SELECT storetype from vendorsprofile where id = $1", [req.user.id])
        var data = await pool.query("SELECT subcategory from productslist where storetype = $1 AND category = $2", [storetype.rows[0].storetype, category]);
        var subcategory = await data.rows;
        if (data.rowCount == 0) {
            var others = await pool.query("SELECT DISTINCT subcategory from otherslist where id = $1 AND category = $2", [req.user.id, category]);
            others.rows.forEach(element => {
                subcategory.push(element)
            });
        }
        if (subcategory) {
            res.json({
                data: subcategory
            })
        } else {
            res.status(400).json({
                msg: "Sub Catgeory not found"
            })
        }
    })


// Route: /api/products/vendor/addproduct
// Type: POST
// Vendor Products
Router.post("/addproduct", vendorToken, verifyVendor, async(req, res) => {
    upload(req, res, async(err) => {
        const productid = crypto({ length: 15 });
        const storeid = req.user.id
        const productname = req.body.productname;
        const category = req.body.category;
        const subcategory = req.body.subcategory
        const mrp = req.body.mrp;
        const sellingprice = req.body.sellingprice;
        const quantity = req.body.quantity;
        const unit = req.body.unit;
        const desc = req.body.desc;
        const error = addProduct(req.body);
        if (error) {
            console.log(error);
            return res.status(400).json({
                error: error,
            });
        }
        console.log(req.file)
        var findCategory = await pool.query("SELECT id FROM productslist WHERE category = $1 AND subcategory = $2", [category, subcategory])
        if (findCategory.rowCount == 0) {
            var addOthers = await pool.query("INSERT INTO otherslist values($1 ,$2, $3)", [req.user.id, category, subcategory])
            if (addOthers.rowCount != 0) {
                console.log("Others Added")
            }
        }
        if (!req.file) {
            var product = await pool.query("INSERT INTO v_products VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [storeid, productid, productname, category, subcategory, mrp, sellingprice, quantity, unit, desc])
            if (product.rowCount == 1) {
                res.status(200).json({
                    msg: "Product Added"
                })
            }
        } else {
            if (
                req.file.mimetype == "image/jpeg" ||
                req.file.mimetype == "image/jpg" ||
                req.file.mimetype == "image/png"
            ) {
                var file = req.file
                var params = {
                    Bucket: "vendorproductsimages",
                    Key: productid,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                    ACL: "public-read",
                };
                s3Bucket.upload(params, async(err, data) => {
                    if (err)
                        res.status(500).json({
                            msg: err,
                        });
                    else {
                        console.log(req.body)
                        var product = await pool.query("INSERT INTO v_products VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)", [storeid, productid, productname, category, subcategory, mrp, sellingprice, quantity, unit, desc, data.Location])
                        res.status(200).json({
                            msg: "Successfull"
                        })
                    }
                })
            } else {
                res.status(422).json({
                    msg: "Invalid Format"
                })
            }
        }
    });

});

// Route: /api/products/vendor/update/:id
Router.post("/update/:id", vendorToken, verifyVendor, async(req, res) => {
    upload(req, res, async(err) => {
        const productid = req.params.id;
        const storeid = req.user.id
        const productname = req.body.productname;
        const category = req.body.category;
        const subcategory = req.body.subcategory
        const mrp = req.body.mrp;
        const sellingprice = req.body.sellingprice;
        const quantity = req.body.quantity;
        const unit = req.body.unit;
        const desc = req.body.desc;
        if (!req.file) {
            var updateProduct = await pool.query("UPDATE v_products set productname = $1, category = $2, subcategory = $3, mrp = $4, sellingprice = $5, quantity = $6, unit = $7, description = $8 WHERE productid = $9 AND storeid = $10", [productname, category, subcategory, mrp, sellingprice, quantity, unit, desc, productid, storeid])
            if (updateProduct.rowCount == 1) {
                res.status(200).json({
                    msg: "Product Updated"
                })
            }
        } else {
            if (
                req.file.mimetype == "image/jpeg" ||
                req.file.mimetype == "image/jpg" ||
                req.file.mimetype == "image/png"
            ) {
                var file = req.file
                var params = {
                    Bucket: "vendorproductsimages",
                    Key: productid,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                    ACL: "public-read",
                };
                s3Bucket.upload(params, async(err, data) => {
                    if (err)
                        res.status(500).json({
                            msg: err,
                        });
                    else {
                        var product = await pool.query("UPDATE v_products set productname = $1, category = $2, subcategory = $3, mrp = $4, sellingprice = $5, quantity = $6, unit = $7, description = $8, imagelocation = $9 WHERE productid = $10 AND storeid = $11", [productname, category, subcategory, mrp, sellingprice, quantity, unit, desc, data.Location, productid, storeid])
                        if (product.rowCount == 1) {
                            res.status(200).json({
                                msg: "Product Updated"
                            })
                        }
                    }
                })
            } else {
                res.status(422).json({
                    msg: "Invalid Format"
                })
            }
        }
    })
})



Router.post("/update/price/:productid", vendorToken, verifyVendor, async(req, res) => {
    try {
        var updateProduct = await pool.query("UPDATE v_products set sellingprice = $1 where productid = $2", [req.body.price, req.params.productid])
        if (updateProduct.rowCount != 0) {
            res.status(200).json({
                data: "Price Updated"
            })
        } else {
            res.status(400).json({
                data: []
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: "Internal Server Error"
        })
    }
})


Router.delete("/delete/:id", vendorToken, verifyVendor, async(req, res) => {
    const deleteProduct = await pool.query("DELETE from v_products where productid = $1 AND storeid = $2", [req.params.id, req.user.id])
    console.log((await deleteProduct).rowCount)
    if (deleteProduct.rowCount == 1) {
        res.status(200).json({
            msg: "Product Deleted"
        })
    } else {
        res.status(400).json({
            msg: "No Product to delete"
        })
    }
})


// Route: /api/products/vendor/sort/products
// Type: POST
// Vendor Products Sorting
Router.get("/sort/products/:category/:subcategory", vendorToken, verifyVendor, async(req, res) => {
    var category = req.params.category;
    var subcategory = req.params.subcategory;
    // const error = productFetch(req.body);
    // if (error) {
    //     console.log(error);
    //     return res.status(400).json({
    //         error: error,
    //     });
    // }
    var findProduct = await pool.query("SELECT * from v_products where category = $1 AND subcategory = $2 AND storeid = $3", [category, subcategory, req.user.id])
    console.log(findProduct.rowCount)
    if (findProduct.rowCount != 0) {
        res.status(200).json({
            data: findProduct.rows
        })
    } else {
        res.status(400).json({
            data: [

            ]
        })
    }

});


// Route: /api/products/vendor/products
// Type: POST
// Vendor Products
Router.get("/products", vendorToken, verifyVendor, async(req, res) => {
    var findProduct = await pool.query("SELECT * from v_products where storeid = $1", [req.user.id])
    console.log(findProduct.rowCount)
    if (findProduct.rowCount != 0) {
        res.status(200).json({
            data: findProduct.rows
        })
    } else {
        res.status(400).json({
            data: [

            ]
        })
    }

});

module.exports = Router;