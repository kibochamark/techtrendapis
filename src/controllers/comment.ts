import { deletecomment, getCommentById, getComments, getUserByKindeId, postComments, updateComment } from "../db"
import express from "express"
import { getuserByKinde } from "./auth"
import { comments } from '../db/schema';



export const postcomment = async (req: express.Request, res: express.Response) => {
    try {

        const { content, post_id, author_id } = req.body

        if (!content || !post_id || !author_id) {
            return res.status(400).json({
                message: "please insert name and slug"
            }).end()
        }

        

        const author = await getUserByKindeId(author_id)

        

        if (author.length > 0) {
            const createdcomment = await postComments({ content:content, post_id:post_id, author_id:author[0].id})

            if (!createdcomment) {
                return res.status(400).json({
                    message: "no data was created"
                })
            }

            return res.status(201).json(createdcomment).end()
        }

        return res.status(400).json({
            message:"user not found"
        }).end()




    } catch (e) {
        return res.status(400).json(e?.message).end()
    }
}
export const updatecomment = async (req: express.Request, res: express.Response) => {
    try {

        const { content,  id } = req.body


        if (!id) {
            return res.status(400).json({
                message: "please insert a comment id"
            }).end()
        }

        const existingcomment = await getCommentById(parseInt(id))

        if (!existingcomment) {
            return res.status(404).end()
        }

        const updatedcomment = await updateComment({ content:content }, id)



        return res.status(201).json(updatedcomment).end()

    } catch (e) {
        return res.status(400).json(e).end()
    }
}




export const getcomments= async (req: express.Request, res: express.Response) => {
    try {
        const comments = await getComments()
        return res.status(200).json(comments).end()

    } catch (e) {
        return res.status(400).json(e).end()
    }
}



export const getcommentById = async (req: express.Request, res: express.Response) => {
    try {
        const id = req.query.id as string
        if (!id) {
            return res.status(400).json({
                message: "please have an id"
            }).end()
        }
        const retrievedcomment = await getCommentById(parseInt(id))

        if (!retrievedcomment) {
            return res.status(404).end()
        }
        return res.status(200).json(retrievedcomment).end()

    } catch (e) {
        return res.status(400).json(e).end()
    }
}
export const deletecommentById = async (req: express.Request, res: express.Response) => {
    try {
        const id = req.query.id as string
        if (!id) {
            return res.status(400).end()
        }
        await deletecomment(parseInt(id))
        return res.status(204).end()

    } catch (e) {
        return res.status(400).json(e).end()
    }
}