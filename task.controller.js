const Tasks = require('./task.model')

const Task = {
    list: async (req,res)=>{
        const tasks = await Tasks.find()
        res.status(200).send(tasks)
    },

    create: async (req,res)=>{
        try{
            const task = new Tasks(req.body)
            await task.save()
            res.status(201).send('creado')          
        } catch(e){
            res.send(e)
            }
    },

    update: async (req,res)=>{
        // const { id } = req.params
        // const animal = await Animals.findOne({ _id: id})
        // Object.assign(animal, req.body)
        // await animal.save()
        // res.sendStatus(204)
        res.status(204).send('act')
    },

    destroy: async (req,res)=>{
        const { id } = req.params
        const task = await Tasks.findOne({ _id: id })  
        await task.remove()
        res.status(204).send('eliminado')
    }
}

module.exports = Task