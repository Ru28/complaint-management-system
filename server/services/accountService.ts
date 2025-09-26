import jwt from "jsonwebtoken";

export const generateToken = (user:any)=> {
    const token = jwt.sign({
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role:user.role,
    },process.env.SECRET_KEY);

    return token;
}