import { integer, pgTable, primaryKey, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { InferModel, SQL, relations } from "drizzle-orm";
import { time } from "console";

export const users = pgTable("users", {
    id: serial('id').primaryKey(),
    username: text('username').notNull(),
    kinde_id: text("kinde_id").notNull().unique(),
    email: text('email').notNull().unique(),
    bio: text('bio').default(""),
    profile_pic: text('profile_pic').default(""),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
});

export const userRelations = relations(users, ({ many }) => ({
    posts: many(posts),
    comments: many(comments),
}));

export const posts = pgTable("posts", {
    id: serial('id').primaryKey(),
    title: text('title').notNull().unique(),
    content: text('content').notNull(),
    imagepath:varchar("imagepath"),
    author_id: integer("author_id").references(() => users.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),  // keep slug as a text field
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
});

export const postsRelations = relations(posts, ({ one, many }) => ({
    author: one(users, {
        fields: [posts.author_id],
        references: [users.id],
    }),
    comments: many(comments),
    categories: many(postsToCategories),
}));

export const comments = pgTable("comments", {
    id: serial('id').primaryKey(),
    post_id: integer("post_id").references(() => posts.id, { onDelete: "cascade" }),
    author_id: integer("author_id").references(() => users.id, { onDelete: "cascade" }),
    content: text("content"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
});

export const commentsRelations = relations(comments, ({ one }) => ({
    post: one(posts, {
        fields: [comments.post_id],
        references: [posts.id],
    }),
    author: one(users, {
        fields: [comments.author_id],
        references: [users.id],
    }),
}));

export const category = pgTable("category", {
    id: serial('id').primaryKey(),
    name: text('name').notNull().unique(),
    slug: text("slug"),
    created_at: timestamp("created_at").defaultNow(),
    update_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
});

export const categoryRelation = relations(category, ({ many }) => ({
    postCategories: many(postsToCategories),
}));

export const postsToCategories = pgTable(
    'posts_to_categories',
    {
        post_id: integer('post_id').notNull().references(() => posts.id, { onDelete: "cascade" }),
        category_id: integer('category_id').notNull().references(() => category.id, { onDelete: "cascade" }),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.post_id, t.category_id] }),
    }),
);


export const postTocategoriesRelations = relations(postsToCategories, ({ one }) => ({
  postCategories: one(posts, {
    fields: [postsToCategories.post_id],
    references: [posts.id],
  }),
  categories: one(category, {
    fields: [postsToCategories.category_id],
    references: [category.id],
  }),
}));

export type User = InferModel<typeof users>;
export type Post = InferModel<typeof posts>;
export type Comment = InferModel<typeof comments>;
export type Category = InferModel<typeof category, 'insert'>;
export type NewComment = InferModel<typeof comments, 'insert'>;
export type NewPost = InferModel<typeof posts, 'insert'>;
export type NewUser = InferModel<typeof users, 'insert'>;
export type Postcategorytable = InferModel<typeof postsToCategories, 'insert'>;
