import { PrismaClient } from '@prisma/client'
import express from 'express'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())
// GET ROUTES
app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany()
    res.json(users);
})

app.get('/feed', async (req, res) => {
    const posts = await prisma.post.findMany({
        where: { published: true },
        include: { author: true }
    })
    res.json(posts);
})

app.get('/post/:id', async (req, res) => {
    const { id } = req.params
    const post = await prisma.post.findUnique({
        where: { id: Number(id) }
    })
    res.json(post);
})
// POST ROUTES
app.post('/user', async (req, res) => {
    const result = await prisma.user.create({
        data: { ...req.body }
    })
    res.json(result);
})

app.post('/post', async (req, res) => {
    const { title, content, authorEmail } = req.body;
    const result = await prisma.post.create({
        data: {
            title,
            content,
            published: false,
            author: { connect: { email: authorEmail } },
        }
    })
    res.json(result);
})

// UPDATE POST ROUTE
app.put('/post/publish/:id', async (req, res) => {
    const { id } = req.params
    const post = await prisma.post.update({
        where: { id: Number(id) },
        data: { published: true },
    })
    res.json(post)
})

// DELETE POST ROUTE
app.delete(`/post/:id`, async (req, res) => {
    const { id } = req.params
    const post = await prisma.post.delete({
        where: { id: Number(id) },
    })
    res.json(post)
})

app.listen(3000, () =>
    console.log('REST API server ready at: http://localhost:3000'),
)

// FIRST STEP
// import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient()

// async function main() {
//     const newUser = await prisma.user.create({
//         data: {
//             name: 'Augusto',
//             email: 'augustordiaz@gmail.com',
//             posts: {
//                 create: {
//                     title: 'Post 1',
//                     content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam nulla odio, vestibulum vel lacus a, elementum rutrum purus. Duis malesuada placerat sapien, eu pretium mauris hendrerit et.',
//                     published: true,
//                 },
//             },
//         },
//     })
//     console.log('Created new user: ', newUser)

//     const allUsers = await prisma.user.findMany({
//         include: { posts: true },
//     })
//     console.log('All users: ')
//     console.dir(allUsers, { depth: null })
// }

// main()
//     .catch((e) => console.error(e))
//     .finally(async () => await prisma.$disconnect())