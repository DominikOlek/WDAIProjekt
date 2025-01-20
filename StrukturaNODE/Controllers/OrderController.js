const baza = require("../Controllers/DataBaseC.js");
const Order = baza.Order;
const Show = baza.Show;
var validator = require("email-validator");

const addOne = async (req, res) => {
  try {
    const obj = req.body;
    if (
      !obj.hasOwnProperty("Name") ||
      !obj.hasOwnProperty("LastName") ||
      !obj.hasOwnProperty("Email") ||
      !validator.validate(obj.Email) ||
      !obj.hasOwnProperty("Places") ||
      !obj.hasOwnProperty("ShowID")
    ) {
      return res.status(400).send("Missing data");
    }
    let show = await Show.findOne({ where: { ID: obj.ShowID } });
    if (!show) {
      return res.status(404).json("This show not exist");
    }
    if (!isTwoDimensionalArray(obj.Places)) {
      return res.status(400).send("Wrong Places data");
    }
    obj.IsVIP = false;
    obj.Price = 0;
    for (const e of obj.Places) {
      console.log(e);
      if (show.Places.length < e[0] || show.Places[e[0]].length < e[1]) {
        console.log("Wrong Places data1");
        return res.status(406).send("Wrong Places data1");
      }
      if (show.Places[e[0]][e[1]] != 0) {
        console.log("Wrong Places data2");

        return res.status(406).send("Places already taken");
      }
      if (show.Places[e[0]][e[1]] < 0) {
        console.log("Wrong Places data3");

        return res.status(406).send("Wrong Places data3");
      }
      show.Places[e[0]][e[1]] = 1;
      if (e[2] == 0) {
        obj.Price += show.NormalPrice;
      } else {
        obj.Price += show.VIPPrice;
        obj.IsVIP = true;
      }
    }

    let ord = await Order.create(obj);

    await Show.update({ Places: show.Places }, { where: { ID: obj.ShowID } });

    return res.status(201).send("OK Kod: " + ord.ID);
  } catch (error) {
    try {
      res.status(500).send();
      console.log("Error " + error);
    } catch {}
  }
};

const isTwoDimensionalArray = (arr) => {
  return (
    Array.isArray(arr) &&
    arr.length > 0 &&
    arr.every(
      (inner) => Array.isArray(inner) && inner.every((e) => Number.isInteger(e))
    )
  );
};

const check = async (req, res) => {
  try {
    let order = await Order.findOne({
      where: { ID: req.params["id"], Email: req.params["email"] },
    });

    if (!order) {
      return res.status(204).json("No Order");
    }

    let show = await Show.findOne({ where: { ID: order.ShowID } });
    order.RoomID = show.RoomID;
    return res.status(200).send(order);
  } catch (error) {
    try {
      res.status(500).send();
      console.log("Error " + error);
    } catch {}
  }
};

module.exports = { check, addOne };
