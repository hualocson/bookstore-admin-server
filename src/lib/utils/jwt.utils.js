import jwt from "jsonwebtoken";
import configs from "@/configs/vars.js";

export function jwtGenerator(payload) {
  return jwt.sign(payload, configs.jwtSecret, {
    expiresIn: configs.jwtExpiresIn,
  });
}

export function verifyJwt(token) {
  try {
    const payload = jwt.verify(token, configs.jwtSecret, {
      maxAge: configs.jwtExpiresIn,
    });
    return { payload, error: null };
  } catch (error) {
    return {
      payload: null,
      error,
    };
  }
}
