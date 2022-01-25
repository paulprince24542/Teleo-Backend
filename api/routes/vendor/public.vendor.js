const Router = require("express").Router();
const { body } = require("express-validator");
const { pool } = require("../../../config/postgres");

Router.get("/:id", async(req, res) => {
    const category = await pool.query("SELECT DISTINCT category from v_products WHERE storeid = $1", [req.params.id])
    const subcategory = await pool.query("SELECT DISTINCT subcategory from v_products WHERE storeid = $1", [req.params.id])
    const products = await pool.query("SELECT * from v_products WHERE storeid = $1", [req.params.id])
    if (products.rowCount != 0) {
        res.status(200).json({
            category: category.rows,
            subcategory: subcategory.rows,
            products: products.rows
        })
    } else {
        res.status(400).json({
            msg: "No vendor store"
        })
    }
})

Router.get("/:storeid/category", async(req, res) => {
    var categories = await pool.query("select DISTINCT category from v_products where storeid = $1", [req.params.storeid])
    var data = await categories.rows
    console.log(categories.rows)
    if (categories.rowCount > 0) {
        res.status(200).json({
            categories: data
        })
    }
})


Router.get("/:storeid/:category/subcategory", async(req, res) => {
    // const category = await pool.query("SELECT DISTINCT category from v_products WHERE storeid = $1", [req.params.id])
    console.log(req.params)
    const subcategory = await pool.query("SELECT DISTINCT subcategory from v_products WHERE category = $1 AND storeid = $2", [req.params.category, req.params.storeid])
    console.log(subcategory.rows)
    if (subcategory.rowCount != 0) {
        res.status(200).json({
            subcategory: subcategory.rows,
        })
    } else {
        res.status(400).json({
            msg: "No Category in store"
        })
    }
})

Router.get("/:vendorid/profile", async(req, res) => {
    //const profile = await pool.query("SELECT * FROM vendorsprofile where id = $1", [req.params.vendorid])
    const profile = await pool.query("SELECT vendorsprofile.id,ownername,storename,storetype,phonenumber,email,alternatenumber,address,city,state,postalcode, country,gstnumber,fssai,piclocation FROM vendorsprofile INNER JOIN v_profile_image ON vendorsprofile.id = v_profile_image.id where vendorsprofile.id = $1", [req.params.vendorid])
    console.log(profile.rows)
    if (profile.rowCount != 0) {
        res.status(200).json({
            profile: profile.rows
        })
    } else {
        res.status(400).json({
            profile: "No Vendor"
        })
    }
})


Router.get("/product/:id", async(req, res) => {
    const product = await pool.query("SELECT * from v_products WHERE productid = $1", [req.params.id])
    if (product.rowCount != 0) {
        // console.log(product.rows[0])
        res.status(200).json({
            data: product.rows[0]
        })
    } else {
        res.status(400).json({
            msg: "No Product Found"
        })
    }
})

Router.get("/product/:vendorid/:category", async(req, res) => {
    const product = await pool.query("SELECT DISTINCT subcategory from v_products WHERE category = $1 and storeid = $2", [req.params.category, req.params.vendorid])
    if (product.rowCount != 0) {
        // console.log(product.rows)
        res.status(200).json({
            subcategory: product.rows
        })
    } else {
        res.status(400).json({
            msg: "No Product Found"
        })
    }
})

Router.get("/product/:vendorid/:category/:subcategory", async(req, res) => {
    const product = await pool.query("SELECT * from v_products WHERE category = $1 AND subcategory = $2 AND storeid = $3", [req.params.category, req.params.subcategory, req.params.vendorid])
    if (product.rowCount != 0) {
        // console.log(product.rows)
        res.status(200).json({
            products: product.rows
        })
    } else {
        res.status(400).json({
            msg: "No Product Found"
        })
    }
})


//Multiple Products Based on Subcategories
//Method GET
//@Route localhost:8080/vendor/data/products/:vendorid
Router.post("/products/:vendorid", async(req, res) => {
    console.log(req.body)
    var subcategories = req.body.subcategories;
    // const arr = subcategories.split(",")
    // var joinedArr = subcategories.join(",")
    // console.log(joinedArr)
    var products = await pool.query("select * from v_products where subcategory = ANY($1) AND storeid = $2", [subcategories, req.params.vendorid])
    console.log(products.rows)
    if (products.rowCount != 0) {
        res.status(200).json({
            products: products.rows
        })
    } else {
        res.status(400).json({
            msg: "No Product Found"
        })
    }
})

Router.get("/products/:vendorid/:name", async(req, res) => {
    console.log(`%${req.params.name}%`)
        //var products = await pool.query("SELECT * from v_products where productname = $1 AND storeid = $2", [req.params.name, req.params.vendorid])
    var products = await pool.query("SELECT * from v_products where productname ILIKE $1 AND storeid = $2", [`%${req.params.name}%`, req.params.vendorid])
    console.log(products.rows)
    if (products.rowCount != 0) {
        res.status(200).json({
            found: products.rows
        })
    } else {
        res.status(400).json({
            msg: "No Product Found"
        })
    }
})




module.exports = Router;