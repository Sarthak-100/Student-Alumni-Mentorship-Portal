import jwt from "jsonwebtoken";

const sendCookie = (user, res, statusCode = 200, message) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  res
    .status(statusCode)
    .header("Referrer-Policy", "no-referrer-when-downgrade")
    .cookie("token", token, {
      sameSite: "None",
      // httpOnly: true,
      secure: true,
      maxAge: 15 * 60 * 1000,
    })
    .json({
      success: true,
      message: message,
    });
};

export default sendCookie;
