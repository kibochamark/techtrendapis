import { createcategory, deletecategory, retrievecategories, retrievecategoriesbyid, updateCategory } from '../db';
import express from 'express';

export const postcategory = async(req:express.Request, res:express.Response)=>{
    try{

        const {name, slug} = req.body
        
        if(!name || !slug){
            return res.status(400).json({
                message:"please insert name and slug"
            }).end()
        }

        const createdcategory = await createcategory({name:name, slug:slug})

        if(!createcategory){
            return res.status(400).json({
                message:"no data was created"
            })
        }

        return res.status(201).json(createdcategory).end()

    }catch(e){
        return res.status(400).json(e).end()
    }
}
export const updatecategory = async(req:express.Request, res:express.Response)=>{
    try{

        const {name, slug, id} = req.body
    
        
        if(!id){
            return res.status(400).json({
                message:"please insert name and slug"
            }).end()
        }

        const existingcategory = await retrievecategoriesbyid(parseInt(id))

        if(!existingcategory){
            return res.status(404).end()
        }

        const updatedcategory = await updateCategory({name:name, slug:slug}, id)

        

        return res.status(201).json(updatedcategory).end()

    }catch(e){
        return res.status(400).json(e).end()
    }
}




export const getCategory = async(req:express.Request, res:express.Response)=>{
    try{
        const categories = await retrievecategories()
        return res.status(200).json(categories).end()

    }catch(e){
        return res.status(400).json(e).end()
    }
}



export const getCatgeoryById = async(req:express.Request, res:express.Response)=>{
    try{
        const id = req.query.id as string
        if(!id){
            return res.status(400).json({
                message:"please have an id"
            }).end()
        }
        const retrievedcategory= await retrievecategoriesbyid(parseInt(id))

        if(!retrievedcategory){
            return res.status(404).end()
        }
        return res.status(200).json(retrievedcategory).end()

    }catch(e){
        return res.status(400).json(e).end()
    }
}
export const deletecategoryById = async(req:express.Request, res:express.Response)=>{
    try{
        const id = req.query.id as string
        if(!id){
            return res.status(400).end()
        }
        await deletecategory(parseInt(id))
        return res.status(204).end()

    }catch(e){
        return res.status(400).json(e).end()
    }
}