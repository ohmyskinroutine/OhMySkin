import axios from "axios";

const BASE_URL = "https://site--oh-my-skin--cvtt47qfxcv8.code.run";

export const loginUser = (email, password) =>
  axios.post(`${BASE_URL}/login`, { email, password });

export const signupUser = (username, email, password) =>
  axios.post(`${BASE_URL}/signup`, { username, email, password });
