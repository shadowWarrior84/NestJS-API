import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dbo";
import * as argon from "argon2"
import { Prisma } from "@prisma/client"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime"

@Injectable()
export class AuthService{

    constructor(private prisma: PrismaService) {}

    async signup(dto: AuthDto) {

        try {
            
            const hash = await argon.hash(dto.password)
    
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                },
            })
    
            delete user.hash
    
            return user
        } catch (error) {
            if(error instanceof Prisma.PrismaClientKnownRequestError){
                if(error.code === "p2002") {
                    throw new ForbiddenException("Credentials token")
                }
            }
            throw error
        }

    }

    signin(){

    }
}