/**
 * 
 * Post a blog based on a user
 */


//create a new blog
//this needs an active user in the db
//get the user , then the blog data, then add to the db
import { Postcategorytable } from "db/schema"
import { createBlog, createpostcategory, deleteBlog, getBlogsBelongingToKindeId, getBlogsByCategory, getBlogsWithComments, getBlogsWithCommentsById, getUserByKindeId, updateBlog } from "../db/index"
import express from "express"
import { category } from '../db/schema';


export const newPost = async (req: express.Request, res: express.Response) => {
    try {

        const { kinde_id, title, content, slug, categorytype } = req.body

        let categorytypearray = categorytype.split(",")

        const file = req.file;
        if (!kinde_id) {
            return res.status(400).json({
                message: "your kinde id should be present"
            }).end()
        }
        if (!title || !content || !file) {
            return res.status(400).json({
                message: "title ,content and an image should be present"
            }).end()
        }
        const user = await getUserByKindeId(kinde_id)
        if (!user) {
            return res.status(404).json({
                message: "user not found"
            }).end()
        }

        if (!Array.isArray(categorytypearray)) {
            return res.status(400).json({
                message: "categorytype should be an array"
            }).end();
        }

        const blog = await createBlog({
            title: title,
            content: content,
            author_id: user[0]?.id,
            imagepath: file.path,
            slug: slug ? slug : content
        })

        if (!blog) {
            return res.status(400).json({
                message: "failed to create blog"
            }).end()
        }

        const categorytypepost: Postcategorytable[] = categorytypearray.map((categoryid: string) => {
            return {
                post_id: blog[0].id,
                category_id: parseInt(categoryid)
            }
        })

        // 

        await createpostcategory(categorytypepost)

        return res.status(201).json(blog).end()
    } catch (e) {
        return res.status(400).json(e).end()

    }
}



export const getBlogs = async (req: express.Request, res: express.Response) => {
    try {

        const blogs = await getBlogsWithComments()
        if (!blogs) {
            return res.status(404).json({
                message: "no blogs available"
            }).end()
        }

        return res.status(200).json(blogs).end()
    } catch (e) {
        return res.status(400).end()
    }

}
export const getBlogById = async (req: express.Request, res: express.Response) => {
    try {

        const id = req.query.id as string;

        if (!id) {
            return res.status(400).end()
        }

        const blog = await getBlogsWithCommentsById(parseInt(id))
        if (!blog) {
            return res.status(404).json({
                message: "blog not available"
            }).end()
        }

        return res.status(200).json(blog).end()
    } catch (e) {
        return res.status(400).end()
    }

}
export const getBlogByUser = async (req: express.Request, res: express.Response) => {
    try {

        const id = req.query.kinde_id as string;

        if (!id) {
            return res.status(400).end({
                message:"missing kinde id"
            })
        }

        const user = await getUserByKindeId(id)
        console.log(user, "user")
        if (user) {

            const blogs = await getBlogsBelongingToKindeId(user[0].id)
            console.log(blogs, "blogs")
            if (!blogs) {
                return res.status(404).json({
                    message: "blogs not available"
                }).end()
            }

            return res.status(200).json(blogs).end()
        }
        return res.status(400).json({
            message: "user does not exist"
        }).end()

    } catch (e) {
        return res.status(400).end()
    }

}
export const getBlogByCategory = async (req: express.Request, res: express.Response) => {
    try {

        const categoryslug = req.query.categoryslug as string;

        if (!categoryslug) {
            return res.status(400).end()
        }




        const blogs = await getBlogsByCategory(categoryslug)
        if (!blogs) {
            return res.status(404).json({
                message: "blogs not available"
            }).end()
        }

        return res.status(200).json(blogs).end()



    } catch (e) {
        return res.status(400).json(e?.message).end()
    }

}


export const updateblog = async (req: express.Request, res: express.Response) => {
    try {

        const { title, content, slug, id } = req.body


        console.log(title, content, slug, id)


        if (!id) {
            return res.status(400).json({
                message:"id not present"
            }).end()
        }
        const file = req.file;

        let blog

        if (file) {
            blog = await updateBlog({ title: title, content: content, slug: slug, imagepath: file.path }, parseInt(id))
        } else {
            blog = await updateBlog({ title: title, content: content, slug: slug }, parseInt(id))
        }

        if (!blog) {
            return res.status(400).json({
                message: "update not successful"
            }).end()
        }

        return res.status(201).json(blog).end()
    } catch (e) {
        return res.status(400).end()
    }

}

export const deleteblog = async (req: express.Request, res: express.Response) => {
    try {

        const id = req.query.id as string


        if (!id) {
            return res.status(400).end()
        }

        const blog = await deleteBlog(parseInt(id))


        return res.status(204).json(blog).end()
    } catch (e) {
        return res.status(400).end()
    }

}



export const files = async (req: express.Request, res: express.Response) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        // File has been uploaded to Cloudinary
        const file = req.file;
        

        // Handle your form data here (e.g., save to a database)
        // const blogPost = await createBlogPost({ title, content, imageUrl: file.path });

        // Return the uploaded file's URL and other form data
        res.status(200).json({
            message: 'File uploaded successfully',
            url: file.path,
            title: title,
            content: content,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong!' });
    }
}


