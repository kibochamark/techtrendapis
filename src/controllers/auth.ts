import { createUser, deleteuser, getUserByEmail, getUserByKindeId, getUsers, updateUser } from '../db';
import express from 'express';


export const getusers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers()
        return res.status(200).json(users).end()
    } catch (e) {
        return res.status(400).json(e).end()
    }

}

export const getuserBymail = async (req: express.Request, res: express.Response) => {
    try {
        const email = req.query.email as string
        if (!email) {
            return res.status(400).end();
        }
        const user = await getUserByEmail(email)
        return res.status(200).json(user).end()
    } catch (e) {
        return res.status(400).json(e).end()
    }

}
export const getuserByKinde = async (req: express.Request, res: express.Response) => {
    try {
        const kinde = req.query.kinde as string
        if (!kinde) {
            return res.status(400).end();
        }
        const user = await getUserByKindeId(kinde)
        return res.status(200).json(user).end()
    } catch (e) {
        return res.status(400).json(e).end()
    }

}
export const newUser = async (req: express.Request, res: express.Response) => {
    try {
        const { username, kinde_id, email, profile_pic, bio } = req.body;
        if (!username || !kinde_id || !email) {
            return res.status(400).end();
        }
        const user = await createUser({ username, kinde_id, email, profile_pic, bio })
        return res.status(201).json(user).end();
    } catch (e) {
        return res.status(400).json(e).end()
    }


}


export const putUser = async (req: express.Request, res: express.Response) => {
    try {

        const id = req.query.id as string
        if (!id) {
            return res.status(400).json({
                mesage: "Invalid Id"
            }).end()
        }
        const user = req.body
        if (!user) {
            return res.status(400).json({ message: "Invalid body" }).end()
        }

        const updatedUser = await updateUser(user, parseInt(id))

        return res.status(201).json(updatedUser).end();

    } catch (e) {
        return res.status(400).end()
    }
}


export const removeUser = async (req: express.Request, res: express.Response) => {
    try {
        const id = req.query.id as string;

        if (!id) {
            return res.status(400).json({
                message: "id missing"
            }).end()
        }

        const deleted_user = await deleteuser(parseInt(id))

        if (!deleted_user) {
            return res.status(400).end();
        }

        return res.status(200).json(deleted_user).end();

    } catch (e) {
        return res.status(400).end();
    }
}


