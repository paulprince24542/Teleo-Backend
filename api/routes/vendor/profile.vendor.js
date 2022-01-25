const Router = require("express").Router();
const multer = require("multer");
const md5 = require("md5");

//Custom Validation
const { profileimage, startProfile, locationProfile, profileValidation, license } = require("../../../Validation/Vendor/profile.validation");

const { pool } = require("../../../config/postgres")

var { s3Bucket } = require("../../../services/upload.services");
var storage = multer.memoryStorage();
var upload = multer({
    storage: storage,
}).single("file");

//Authorization Params
const {
    vendorToken,
    verifyVendor,
} = require("../../../middlewares/jwt_vendor_verify");



// @Route /api/data/vendor/startprofile

Router.post("/startprofile", vendorToken, verifyVendor, async(req, res) => {
    const error = startProfile(req.body);
    if (error) {
        console.log(error);
        return res.status(400).json({
            error: error,
        });
    }
    const vendorId = req.user.id
    const phonenumber = req.user.phonenumber
    const storename = req.body.storename;
    const storetype = req.body.storetype
    const query = await pool.query("SELECT * FROM vendorsprofile WHERE id = $1", [vendorId])
    const count = await query.rowCount;
    if (count == 0) {
        const profile = await pool.query("INSERT INTO vendorsprofile (id, storename, storetype, phonenumber ) VALUES ($1, $2, $3, $4)", [
            vendorId, storename, storetype, phonenumber
        ])
        const created = await profile.rowCount
        if (created == 1) {
            res.status(200).json({
                msg: "Profile Created"
            })
        } else {
            res.status(201).json({
                msg: "Error in saving your profile"
            })
        }
    } else {
        const profile = await pool.query("UPDATE vendorsprofile SET storename = $1, storetype = $2 WHERE id = $3", [
            storename, storetype, vendorId
        ])
        const updated = await profile.rowCount
        if (updated == 1) {
            res.status(200).json({
                msg: "Profile has been updated"
            })
        } else {
            res.status(201).json({
                msg: "Error in updating your profile"
            })
        }
    }
})

Router.post("/location", vendorToken, verifyVendor, async(req, res) => {
    const error = locationProfile(req.body);
    if (error) {
        console.log(error);
        return res.status(400).json({
            error: error,
        });
    }
    var vendorId = req.user.id
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var address = req.body.address;
    var streetname = req.body.streetname;
    var landmark = req.body.landmark;
    console.log(req.body)
    var query = await pool.query("SELECT id from v_location where id = $1", [vendorId])
    if (query.rowCount == 0) {
        var data = await pool.query("INSERT INTO v_location values($1, $2, $3, $4, $5, $6)", [vendorId, latitude, longitude, address, streetname, landmark])
        if (data.rowCount == 1) {
            res.json({
                msg: "location has been added"
            })
        }
    } else {
        var data = await pool.query("UPDATE v_location SET latitude =$1, longitude =$2 WHERE id = $3", [latitude, longitude, vendorId])
        if (data.rowCount == 1) {
            res.json({
                msg: "location has been updated"
            })
        }
    }
})


// Route: /api/data/vendor/profile
// Type: POST
// Vendor Profile
Router.post("/profile", vendorToken, verifyVendor, async(req, res) => {
    const error = profileValidation(req.body);
    if (error) {
        console.log(error);
        return res.status(400).json({
            error: error,
        });
    }
    const vendorId = req.user.id;
    const ownername = req.body.ownername;
    const altphonenumber = req.body.altphonenumber;
    const email = req.body.email;
    const address = req.body.address;
    const city = req.body.city;
    const state = req.body.state;
    const postalcode = req.body.postalcode;
    const country = req.body.country;
    const query = await pool.query("SELECT id FROM vendorsprofile WHERE id = $1", [vendorId])
    const count = await query.rowCount;
    if (count == 1) {
        const profile = await pool.query("UPDATE vendorsprofile SET ownername = $1, alternatenumber = $2, email = $3, address = $4, city = $5, state = $6, postalcode = $7, country = $8 WHERE id = $9", [
            ownername, altphonenumber, email, address, city, state, postalcode, country, vendorId
        ])
        const updated = await profile.rowCount
        if (updated == 1) {
            res.status(200).json({
                msg: "Profile has been updated"
            })
        } else {
            res.status(201).json({
                msg: "Error in updating your profile"
            })
        }
    } else {}
});


// Route: /api/data/vendor/profile/license
// Type: POST
// Vendor Profile License section
Router.post("/profile/license", vendorToken, verifyVendor, async(req, res) => {
    const error = license(req.body);
    if (error) {
        console.log(error);
        return res.status(400).json({
            error: error,
        });
    }
    const vendorId = req.user.id;
    const gstnumber = req.body.gstnumber;
    const fssai = req.body.fssai;
    try {
        const license = await pool.query("UPDATE vendorsprofile SET gstnumber = $1,fssai = $2 WHERE id = $3", [gstnumber, fssai, vendorId])
        const updated = await license.rowCount
        if (updated == 1) {
            res.status(200).json({
                msg: "Profile has been updated"
            })
        } else {
            res.status(201).json({
                msg: "Error in updating your profile"
            })
        }
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: "Internal Error"
        })
    }
})

// Route: /api/data/vendor/profile/image
// Type: POST
// Vendor Profile Image
Router.post("/profile/image", vendorToken, verifyVendor, async(req, res) => {
    upload(req, res, (err) => {
        const file = req.file;
        if (err) res.status(400).json({
            msg: "Something is Wrong",
            err: err
        })
        if (!req.file) {
            res.status(404).json({
                msg: "No image is found"
            })
        } else {
            if (
                req.file.mimetype == "image/jpeg" ||
                req.file.mimetype == "image/jpg" ||
                req.file.mimetype == "image/png"
            ) {
                var params = {
                    Bucket: "vendorprofileimage",
                    Key: req.user.id,
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
                        const found = await pool.query("SELECT * FROM v_profile_image  where id = $1", [req.user.id]);
                        if (found.rowCount == 1) {
                            const update = await pool.query("UPDATE v_profile_image  SET id = $1, imagename = $2, hash = $3, piclocation = $4 WHERE id = $5", [
                                req.user.id, data.key, md5(file.buffer), data.Location, req.user.id
                            ])
                            const updated = await update.rowCount;
                            if (updated == 1) {
                                res.status(200).json({
                                    msg: "Profile Image and Location has been Updated"
                                })
                            } else {
                                res.status(201).json({
                                    msg: "Error in updating your profile image and location"
                                })
                            }
                        } else {
                            const query = await pool.query("INSERT INTO v_profile_image (id, imagename, hash, piclocation) VALUES ($1, $2, $3, $4)", [
                                req.user.id, data.key, md5(file.buffer), data.Location
                            ])
                            const added = await query.rowCount;
                            if (added == 1) {
                                res.status(200).json({
                                    msg: "Profile Image has been Added"
                                })
                            } else {
                                res.status(201).json({
                                    msg: "Error in adding your profile image and location"
                                })
                            }
                        }
                    }
                });
            } else {
                res.status(422).json({
                    msg: "Invalid Format"
                })
            }
        }
    });
});


Router.get("/data/profile", vendorToken, verifyVendor, async(req, res) => {
    const data = await pool.query("select * from vendorsprofile where id = $1", [req.user.id])
    const profileImage = await pool.query("select * from vendorsprofile INNER JOIN v_profile_image ON vendorsprofile.id=v_profile_image.id where vendorsprofile.id = $1;", [req.user.id])
    console.log(profileImage.rows.length)
    if (profileImage.rows.length == 1)
        var profile = await profileImage.rows[0]
    else
        var profile = await data.rows[0]
    if (data.rowCount == 1) {
        res.status(200).json({
            data: profile
        })
    } else {
        res.status(400).json({

            data: [

            ]
        })
    }
})

// Route: /api/data/vendor/storestatus
// Type: POST
// Vendor Profile Image
Router.post("/storestatus", vendorToken, verifyVendor, async(req, res) => {
    try {
        var status = req.body.status
        if (status) {
            var updateStoreStatus = await pool.query("update vendorsprofile set shopstatus = $1 where id = $2", [status, req.user.id])
            console.log(updateStoreStatus)
            if (updateStoreStatus.rowCount != 0) {
                res.status(200).json({
                    msg: "Store Status updated"
                })
            } else {
                res.status(400).json({
                    err: "Store Status Not updated"
                })
            }
        } else {
            res.status(400).json({
                msg: "No Status"
            })
        }
    } catch (err) {
        res.status(500).json({
            msg: "Internal Server Error"
        })
    }
})


// Route: /api/data/vendor/myclients
Router.get("/myclients", vendorToken, verifyVendor, async(req, res) => {
    var myClient = await pool.query("SELECT DISTINCT usersprofile.name, usersprofile.phonenumber from deliveredorders LEFT JOIN usersprofile ON deliveredorders.userid = usersprofile.id")
    if (myClient.rowCount != 0) {
        res.status(200).json({
            data: myClient.rows
        })
    } else {
        res.status(400).json({
            data: []
        })
    }
})


// Route: /api/data/vendor/delivery/services
Router.post("/delivery/services", vendorToken, verifyVendor, async(req, res) => {
    if (!req.body.orderpickup) {
        res.status(400).json({
            err: "orderpickup Parameter No Found"
        })
    } else if (!req.body.homedelivery) {
        res.status(400).json({
            err: "homedelivery Parameter No Found"
        })
    } else {
        var deliveryServiceUpdate = await pool.query("UPDATE vendorsprofile set orderpickup = $1, homedelivery = $2 WHERE id = $3", [req.body.orderpickup, req.body.homedelivery, req.user.id])
        if (deliveryServiceUpdate != 0) {
            res.status(200).json({
                msg: "Delivery Services updated"
            })
        } else {
            res.status(400).json({
                msg: "Delivery Services Not updated"
            })
        }
    }
})

module.exports = Router;