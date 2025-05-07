
import Session from "../../models/sessionModel.js";

export const logout = async (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  await Session.deleteOne({ token: req.token });
  res.status(200).json({ status: "success" });
};