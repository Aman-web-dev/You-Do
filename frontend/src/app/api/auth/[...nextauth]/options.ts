import { NextAuthOptions } from "next-auth";
import  CredentialsProvider , {CredentialsProvider as credentialProviderType} from "next-auth/providers/credentials";
import { CredentialInput

 } from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import Email from "next-auth/providers/email";


export const authOptions:NextAuthOptions={
providers:[
    CredentialsProvider({
        id:"domain-login",
        name:"Domain Account",
        credentials:{
            email:{lable:"email",type:"text"},
            password:{label:"Password",type:"password"}
        },
        async authorize(credentials:any):Promise<any>{
            
        }
    })
]
}