import bcrypt from "bcrypt";

async function hashPassword(password) {
  const saltRound = 12;
  const salt = await bcrypt.genSalt(saltRound);

  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
}

async function verifyPassword(password, hashedPassword) {
  const isValid = await bcrypt.compare(password, hashedPassword);

  return isValid;
}

export default { hashPassword, verifyPassword };
