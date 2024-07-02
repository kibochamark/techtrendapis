import * as jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import express from 'express';
import { getuserByKinde } from '../controllers/auth';
import { createUser, getUserByKindeId } from "../db";

const client = jwksClient({
  jwksUri: "https://kibotech.kinde.com/.well-known/jwks.json" as string // Ensure the environment variable is defined as a string
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err, undefined);
    } else {
      const signingKey = key!.getPublicKey();
      callback(null, signingKey);
    }
  });
}

const authenticateJWT = async(req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    

    jwt.verify(token, getKey, {}, async(err, user:any) => {
      
      
      if (err) {
        return res.sendStatus(403);
      }

      const kinde_id= (user.sub) as string;

      

      const getuser= await getUserByKindeId(kinde_id)
      if(getuser.length == 0){
        try{
        const newuser = await createUser({ username:user?.email.split("@")[0], kinde_id, email:user?.email, })
        
        }catch(e){

        }
      }



      // req.user = user as jwt.JwtPayload; // Type assertion to JwtPayload
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

export default authenticateJWT;
