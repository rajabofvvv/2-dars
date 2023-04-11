import express from 'express'
import cors from 'cors'
import {engine} from 'express-handlebars'
import { PrismaClient } from '@prisma/client'
import moment from 'moment'


const server = express()

server.use(cors())  
server.use(express.json())
server.use(express.urlencoded({extended:true}))

server.engine('.hbs', engine({extname:'.hbs',}))
server.set('view engine', 'hbs')
server.set("views","./pages")

server.use('/',express.static('./public'))

const prisma = new PrismaClient()

server.get('/',(req,res) => {

    prisma.students.findMany()
.then(student => {

        res.render('index',{
            student:student.map(student => ({
                id:student.id,
                name:student.name,
                surname:student.surname,
                group:student.group,
                birthday:moment(student.birthday).format('DD/MM/YYYY'),
                phone:student.phone,
                adress:student.adress,
                status:student.status
            }))
        })
        
    })
    
    .catch(e => {
        console.log(e)
        res.send('Error')
    })
})

server.post('/',(req,res) => {
    prisma.students.create({
        data: {
            name:req.body.name,
            surname:req.body.surname,
            group:req.body.group,
            birthday:new Date(req.body.birthday).toISOString(),
            phone:req.body.phone,
            adress:req.body.adress,
            status:req.body.status
        }
    })
    .then(data => {
        res.redirect('/')
    })
    .catch(e => {
        console.log(e)
        res.send('Error whhile creating new student')
    })
})
server.get('/delete/:id',(req,res) => {
    prisma.students.delete({
        where:{
            id:+req.params.id
        }
    })
    .then(data => {
        res.redirect('/')
    })
    .catch(e => {
        console.log(e)
        res.send('Error whhile deleting student')
        
    })
})

server.listen(2517,() => {
    console.log(`server is running`);
})