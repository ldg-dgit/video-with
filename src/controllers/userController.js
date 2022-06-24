export const signup = (res, req) => res.send("Sign Up");
export const userEdit = (req, res) => res.send("Edit User");
export const userDelete = (req, res) => res.send("Delete User");
export const signin = (req, res) => res.send("Sign In");
export const signout = (req, res) => res.send("Sign Out");
export const userProfile = (req, res) => {
  return res.send(`User Profile @${req.params.id}`);
};
