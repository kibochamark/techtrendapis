import { eq } from "drizzle-orm";
import db from "../utils/connection"
import { Category, comments, NewComment, NewPost, NewUser, Postcategorytable,  posts, postsToCategories, users, Comment, category } from './schema';







export const getUsers = async () => {
    return await db.select({ id: users.id, email: users.email, username: users.username, kinde_id: users.kinde_id }).from(users);
}


export const createUser = async (user: NewUser) => {
    return await db.insert(users).values(user).returning({ id: users.id, kinde_id: users.kinde_id, username: users.username });
}

export const getUserByKindeId = async (kinde_id: string) => {
    return await db.select({
        id: users.id, email: users.email, username: users.username, kinde_id: users.kinde_id
    }).from(users).where(eq(users.kinde_id, kinde_id))
}
export const getUserByEmail = async (email: string) => {
    return await db.select({
        id: users.id, email: users.email, username: users.username, kinde_id: users.kinde_id
    }).from(users).where(eq(users.email, email))
}


export const updateUser = async (user: NewUser, id: number) => {
    return await db.update(users).set(
        user
    ).where(eq(users.id, id))
        .returning({ updatedId: users.id, email: users.email, username: users.username });
}


export const deleteuser = async (id: number) => {
    return await db.delete(users).where(eq(users.id, id)).returning({
        deletdUser: users.email
    })
}



//posts

export const createBlog = async (post: NewPost) => {
    return await db.insert(posts).values(post).returning({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        author: posts.author_id,
        slug: posts.slug,
        createdat: posts.created_at,
    })
}



export const getBlogsWithComments = async () => {
    return await db.query.posts.findMany({
        columns: {
            id: true,
            title: true,
            content: true,
            imagepath: true,
            slug: true,
            created_at: true,
            updated_at: true
        },
        with: {
            author: {
                columns: {
                    username: true // Fetch the author's username
                }
            },
            comments: {
                columns: {
                    id: true,
                    content: true,
                    created_at: true,
                    updated_at: true
                },
                with: {
                    author: {
                        columns: {
                            username: true // Fetch the comment author's username
                        }
                    }
                }
            },
            categories: {
                with: {
                    categories: {
                        columns: {
                            id: true,
                            slug: true,
                            name: true
                        }

                    }
                }
            }
        }
    });
};
export const getBlogsByCategory = async (slug: string) => {
    // First, find the category ID by slug
    const postcategory = await db.query.category.findFirst({
        where: eq(category.slug, slug),
        columns: { id: true }
    });

    if (!postcategory) {
        // Handle case where postcategory is not found
        throw new Error('postcategory not found');
    }

    // Then, find posts by postcategory ID
    return await db.query.posts.findMany({
       
        columns: {
            id: true,
            title: true,
            content: true,
            imagepath: true,
            slug: true,
            created_at: true,
            updated_at: true
        },
        with: {
            author: {
                columns: {
                    username: true // Fetch the author's username
                }
            },
            comments: {
                columns: {
                    id: true,
                    content: true,
                    created_at: true,
                    updated_at: true
                },
                with: {
                    author: {
                        columns: {
                            username: true // Fetch the comment author's username
                        }
                    }
                }
            },
            categories:{
                where: eq(postsToCategories.category_id, postcategory.id),
                with:{
                    categories:{
                        columns:{
                            id:true,
                            slug:true,
                            name:true,
                            update_at:true
                        }
                    }
                }
            }
        }
    });
};



export const getBlogsWithCommentsById = async (id: number) => {
    return await db.query.posts.findMany({
        where: eq(posts.id, id),
        columns: {
            id: true,
            title: true,
            content: true,
            imagepath: true,
            slug: true,
            created_at: true,
            updated_at: true
        },
        with: {
            author: {
                columns: {
                    username: true,
                    id:true, // Fetch the author's username
                    kinde_id:true
                }
            },
            comments: {
                columns: {
                    id: true,
                    content: true,
                    created_at: true,
                    updated_at: true
                },
                with: {
                    author: {
                        columns:{
                            id:true,
                            username:true,
                            email:true
                        }
                    }
                }
            },
            categories: {
                with: {
                    categories: {
                        columns: {
                            id: true,
                            slug: true,
                            name: true
                        }

                    }
                }
            }
        }

    })
}
export const getBlogsBelongingToKindeId = async (id: number) => {
    return await db.query.posts.findMany({
        where: eq(posts.author_id, id),
        columns: {
            id: true,
            title: true,
            content: true,
            imagepath: true,
            slug: true,
            created_at: true,
            updated_at: true
        },
        with: {
            author: {
                
                columns: {
                    username: true,
                    id:true, // Fetch the author's username
                    kinde_id:true
                }
                
            },
            comments: {
                columns: {
                    id: true,
                    content: true,
                    created_at: true,
                    updated_at: true
                },
                with: {
                    author: {
                        columns:{
                            id:true,
                            username:true,
                            email:true
                        }
                    }
                }
            },
        }

    })
}

export const updateBlog = async (post: NewPost, id: number) => {
    return await db.update(posts).set(
        post
    ).where(eq(posts.id, id)).returning({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        author: posts.author_id,
        slug: posts.slug
    })
}
export const deleteBlog = async (id: number) => {
    return await db.delete(posts).where(eq(posts.id, id))
}





//category
export const createcategory = async (categorydata: Category) => {
    return await db.insert(category).values(categorydata).returning({
        id: category.id,
        name: category.name,
        slug: category.slug
    })
}


export const updateCategory = async (categorydata: Category, id: number) => {
    return await db.update(category).set(
        categorydata
    ).where(eq(category.id, id))
        .returning({ id: category.id, name: category.name, slug: category.slug, updated_at: category.update_at });
}

export const retrievecategories = async () => {
    return await db.select({ id: category.id, name: category.name, slug: category.name }).from(category)
}

export const retrievecategoriesbyid = async (id: number) => {
    return await db.select({ id: category.id, name: category.name, slug: category.name }).from(category).where(eq(category.id, id))
}


export const deletecategory = async (id: number) => {
    return await db.delete(category).where(eq(category.id, id))
}


//inserting to postcategorytable
export const createpostcategory = async (postcategorydata: Postcategorytable[]) => {
    return await db.insert(postsToCategories).values(postcategorydata).returning({
        post_id: postsToCategories.post_id,
        category_id: postsToCategories.category_id,
    })
}



//comments
export const postComments = async (comment: NewComment) => {
    return await db.insert(comments).values(comment).returning({
        id: comments.id,
        content: comments.content,
        created_at: comments.created_at
    })
}
export const getComments = async () => {
    return await db.select({
        id: comments.id,
        content: comments.content,
        created_at: comments.created_at
    }).from(comments)
}
export const getCommentById = async (id: number) => {
    return await db.select({
        id: comments.id,
        content: comments.content,
        created_at: comments.created_at
    }).from(comments).where(eq(comments.id, id))
}


export const updateComment = async (comment: NewComment, id: number) => {
    return await db.update(comments).set(
        comment
    ).where(eq(comments.id, id))
        .returning({
            id: comments.id,
            content: comments.content,
            created_at: comments.created_at
        });
}




export const deletecomment = async (id: number) => {
    return await db.delete(comments).where(eq(comments.id, id))
}






