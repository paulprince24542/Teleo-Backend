const validator = require("validator");

const addProduct = (data) => {
    const errors = {}

    const productname = data.productname;
    const category = data.category;
    const mrp = data.mrp;
    const sellingprice = data.sellingprice;
    const quantity = data.quantity;
    const unit = data.unit;
    const desc = data.desc;
    if (!productname) {
        errors.msg = "productname is required"
        return errors.msg
    }
    if (!category) {
        errors.msg = "category is required"
        return errors.msg
    }
    if (!mrp) {
        errors.msg = "mrp is required"
        return errors.msg
    } else if (validator.isNumeric(mrp) == false) {
        errors.msg = "mrp must be numeric"
        return errors.msg
    }
    if (!sellingprice) {
        errors.msg = "selling is required"
        return errors.msg
    } else if (validator.isNumeric(mrp) == false) {
        errors.msg = "selling price must be numeric"
        return errors.msg
    }
    if (!quantity) {
        errors.msg = "quantity is required"
        return errors.msg
    } else if (validator.isNumeric(quantity) == false) {
        errors.msg = "quantity must be numeric"
        return errors.msg
    }
    if (!unit) {
        errors.msg = "Unit is required"
        return errors.msg
    }
    if (!desc) {
        errors.msg = "description is required"
        return errors.msg
    }
}

const categoryData = (data) => {
    const errors = {}
    const category = data.category;
    if (!category) {
        errors.msg = "category is required"
        return errors.msg
    } else if (validator.isEmpty(category) == true) {
        errors.msg = "category cannot be empty"
        return errors.msg
    }
}

const productFetch = (data) => {
    const errors = {}
    const category = data.category
    const subcategory = data.subcategory
    if (!category) {
        errors.msg = "category is required"
        return errors.msg
    } else if (validator.isEmpty(category) == true) {
        errors.msg = "category cannot be empty"
        return errors.msg
    }
    if (!subcategory) {
        errors.msg = "subcategory is required"
        return errors.msg
    } else if (validator.isEmpty(subcategory) == true) {
        errors.msg = "subcategory cannot be empty"
        return errors.msg
    }
}


module.exports.addProduct = addProduct
module.exports.categoryData = categoryData
module.exports.productFetch = productFetch