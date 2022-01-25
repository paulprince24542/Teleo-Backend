var Router = require("express").Router();
var { authenticateJWT } = require("../../middlewares/vendorJWT");
const Orders = require("../../models/orders");
var Order = require("../../models/orders");

// @Route /api/vendor/order/accept/:id
// Method POST
Router.post("/accept/:id", authenticateJWT, async (req, res) => {
  try {
    var acceptedOrder = await Orders.update(
      {
        orderstatus: 1, //Accepted
      },
      {
        where: {
          orderid: req.params.id,
        },
      }
    );
    console.log(acceptedOrder[0]);
    if (acceptedOrder[0] != 0) {
      res.status(200).json({
        msg: "Order Accepted",
      });
    } else {
      res.status(400).json({
        msg: "Order Accepting failed",
      });
    }
  } catch (err) {
    res.status(401).json({
      msg: "Internal Server Error",
    });
  }
});

// @Route /api/vendor/order/declined/:id
// Method POST
Router.post("/declined/:id", authenticateJWT, async (req, res) => {
    try {
      var Declined = await Orders.update(
        {
          orderstatus: 2, //Declined
        },
        {
          where: {
            orderid: req.params.id,
          },
        }
      );
      console.log(Declined[0]);
      if (Declined[0] != 0) {
        res.status(200).json({
          msg: "Order Declined",
        });
      } else {
        res.status(400).json({
          msg: "Order Declined falied",
        });
      }
    } catch (err) {
      res.status(401).json({
        msg: "Internal Server Error",
      });
    }
  });

// @Route /api/vendor/order/reverted/:id
// Method POST
Router.post("/reverted/:id", authenticateJWT, async (req, res) => {
    try {
      var Reverted = await Orders.update(
        {
          orderstatus: 0, //Order Reverted
        },
        {
          where: {
            orderid: req.params.id,
          },
        }
      );
      console.log(Reverted[0]);
      if (Reverted[0] != 0) {
        res.status(200).json({
          msg: "Order Reverted",
        });
      } else {
        res.status(400).json({
          msg: "Order Reverted falied",
        });
      }
    } catch (err) {
      res.status(401).json({
        msg: "Internal Server Error",
      });
    }
  });

  // @Route /api/vendor/orders/upfordelivery
// Method POST
Router.post("/upfordelivery/:id", authenticateJWT, async (req, res) => {
  try {
    var Delivery = await Orders.update(
      {
        orderstatus: 3, //Up for Delivery
      },
      {
        where: {
          orderid: req.params.id,
        },
      }
    );
    console.log(Delivery[0]);
    if (Delivery[0] != 0) {
      res.status(200).json({
        msg: "Out for delivery",
      });
    } else {
      res.status(400).json({
        msg: "Order Declined falied",
      });
    }
  } catch (err) {
    console.log(err)
    res.status(401).json({
      msg: "Internal Server Error",
    });
  }
});

// @Route /api/vendor/orders/delivered/:id
// Method POST
Router.post("/delivered/:id", authenticateJWT, async (req, res) => {
  try {
    var Delivery = await Orders.update(
      {
        orderstatus: 4, //Delivered
      },
      {
        where: {
          orderid: req.params.id,
        },
      }
    );
    console.log(Delivery[0]);
    if (Delivery[0] != 0) {
      res.status(200).json({
        msg: "Out for delivery",
      });
    } else {
      res.status(400).json({
        msg: "Order Declined falied",
      });
    }
  } catch (err) {
    res.status(401).json({
      msg: "Internal Server Error",
    });
  }
});

module.exports = Router;
