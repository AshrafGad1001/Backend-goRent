import AuthService from "../services/Auth.services.js";
const AuthController = {
  register: async (req, res) => {
    try {
      const user = await AuthService.register(req.body);
      res.status(201).json({ success: true, user });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
};
export default AuthController;
