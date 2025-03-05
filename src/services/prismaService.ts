import { PrismaClient } from '@prisma/client'



class PrismaService{
    private prisma : PrismaClient;

constructor(){
    this.prisma = new PrismaClient();
}

async createUser(data:{name?:string; email:string ; password_hash:string}){
    return await this.prisma.user.create({
        data,
    });




}



