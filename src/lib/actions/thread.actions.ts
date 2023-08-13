'use server'

import { revalidatePath } from "next/cache"
import Thread from "../Models/thread.model"
import User from "../Models/user.model"
import { connectDB } from "../mongoose"

interface Params{
    text:string,
    author:string,
    communityId:string | null,
    path:string
}
export async function  createThread({
    text,
    author,
    communityId,
    path
}:Params){


    try {
        
-connectDB()

const createdThread=await Thread.create({
    text,
    author,
    community:null,
})


// Update user Model

await User.findByIdAndUpdate(author,{
    $push:{threads:createdThread._id}
})

revalidatePath(path)
    } catch (error:any) {
        throw new Error(`Error Creating Thread ${error.message} `)
    }
    
}

export  async function fetchPosts(pageNumber=1,pageSize=20){

    try {

        connectDB()

//  Calculate number of posts to Skip

const skipAmount = (pageNumber-1)*pageSize;


        const postsQuery = await Thread.find({parentId:{$in:[null,undefined]}}) 
        .sort({createdAt:'desc'})
        .skip(skipAmount)
        .limit(pageSize)
        .populate({path:'author',model:User})
        .populate({
            path:'children',
            populate:{
                path:'author',
                model:User,
                select:"_id name parentId image",
            }
        })

        const totalPostsCount = await Thread.countDocuments({parentId:{$in:[null,undefined]}})
            
        // const posts = await postsQuery.exec()
        const posts =  postsQuery

        const isNext = totalPostsCount > skipAmount  + posts.length

        return {posts, isNext}

    } catch (error:any) {
        throw new Error(`Error while Finding Threads ${error.message}`)
    }

}


export async function fetchThreadById(id:string){

    try {
// also populate the communtiy
        const thread = await Thread.findById(id)
        .populate({
            path:'author',
            model:User,
            select:"_id id name image",
        }).populate({
            path:'children',
            populate:[
                {
                    path:"author",
                    model:User,
                    select:"_id id name parentId image",
                },
                {
                    path:'children',
                    model:Thread,
                    populate:{
                        path:'author',
                        model:User,
                        select:"_id id name parentId image",
                    }
                }
            ]
        }).exec()

        return thread
        
    } catch (error:any) {
        throw new Error(`Error while fetching thread ${error.message}`)
        
    }

}


export async function addCommentsToThread(
    threadId:string,
    commentText:string,
    userId:string,
    path:string
    ){

        connectDB()

       try {

        const orignalThread = await Thread.findById(threadId)
        if(!orignalThread){
            throw new Error("Thread not found")
        }

        const commentThread = new Thread({
            text:commentText,
            author:userId,
            parentId:threadId
        })


        const savedCommentThread = await commentThread.save();


        orignalThread.children.push(savedCommentThread._id)

        await orignalThread.save()

        revalidatePath(path)


        

       } catch (error:any) {
        throw new Error(`Error while adding comment ${error.message})`)
       } 
}