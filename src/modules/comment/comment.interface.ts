export interface IComment {
    _id: string
    content: string
    tag: any
    reply: string
    likes: string[]
    user: string
    postId: string
    postUserId: string
}