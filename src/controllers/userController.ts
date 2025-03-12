import { Request, Response } from 'express';
import PrismaService from '../services/prismaService.js';
import { hashPassword } from '../utils/index.js';

class UserController {
    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await PrismaService.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: 'Error while fetching users' });
        }
    }

    async createUser(req: Request, res: Response) {

        const {name,email,password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({message:'Please provide all fields'});
        }

        try{

            const existingUser = await PrismaService.user.findUnique({
                where:{email}
            });

            if(existingUser){
                return res.status(400).json({message:'User already exists'});
            }


            const user = await PrismaService.user.create({
                data:{
                    name:req.body.name,
                    email:req.body.email,
                    password_hash: await hashPassword(req.body.password)
                },
                select:{
                    id:true,
                    name:true,
                    email:true,
                    createdAt:true,
                    updatedAt:true
                }
            });
            res.json(user)

        } catch (error){
            res.status(500).json({message: 'Error while creating user'})
        }
    }

    async getUser(req: Request, res: Response) {
        const Id  = req.params;
        try{
            const user = await PrismaService.user.findUnique({
                where:{id:(Number(Id))},
                select:{
                    id: true,
                    name:true,
                    email:true,
                    createdAt:true,
                    updatedAt:true,
                    interviews: true

                }
            })
           if(user){
            res.json(user);
           }
           else{
            res.status(404).json({message:'User not found'});
           }
        }
     catch(error){
        res.status(500).json({message:'Error while fetching user'}); 
    }
}

    async updateUser(req: Request, res: Response) {
        const { id } = req.params;
        const { name, email, password } = req.body;
        
        try {
          const updateData: any = {};
          
          if (name !== undefined) updateData.name = name;
          if (email !== undefined) updateData.email = email;
          if (password !== undefined) updateData.password_hash = await hashPassword(password);
          
          const user = await PrismaService.user.update({
            where: { id: Number(id) },
            data: updateData,
            select: {
              id: true,
              name: true,
              email: true,
              createdAt: true,
              updatedAt: true
            }
          });
          
          res.json(user);
        } catch (error) {
          res.status(500).json({ error: 'User update failed' });
        }
      }

      async deleteUser(req: Request, res: Response) {
        const { id } = req.params;
        try {
          await PrismaService.user.delete({
            where: { id: Number(id) },
          });
          res.status(204).send();
        } catch (error) {
          res.status(500).json({ error: 'User deletion failed' });
        }
      }


}

export default new UserController();