import { User, Student, Alumni, Admin } from "../models/userModel.js";

const register = async (req, res) => {
  const { user_name, email, password, user_type, batch, branch, current_work } =
    req.body;

  const alumni = await Alumni.create({
    batch,
    branch,
    current_work,
  });

  more_info = alumni._id;

  const user = await User.create({
    user_name,
    email,
    password,
    user_type,
    more_info,
  });
};

export default register;
