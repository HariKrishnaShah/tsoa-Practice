import { Controller, Post, Get, Route, Body, SuccessResponse, Response, Tags, Middlewares, Header} from 'tsoa';
import UserModel, { User, DocUser } from "../../models/user"
import { NextFunction } from 'express';


const middlwareCalled = async(req:Request, res:Response, next:NextFunction)=>{
    console.log("middleware called.")
    console.log("The attached auth token is");
    console.dirxml(await req.headers['authtoken']);
    next()
}

@Route('user')
@Tags('User')
export class UserController extends Controller {
    /**
     * Create a new user
     * @param requestBody User details like username, email, and password
     * @returns user object
     */
    @SuccessResponse('200', 'User Object')
   @Response("502", "Error Occured")
   @Header()
    @Post('create')
    @Middlewares(middlwareCalled)
    public async createUser(@Body() requestBody: User): Promise<DocUser> {
        try {
            console.log("Create Users called.")
            const user: DocUser = await UserModel.create(requestBody);
            // return user;
            return JSON.parse(JSON.stringify(user));

 
        } catch (error) {
            this.setStatus(502);
            throw new Error("Error occurred");
        }
    }

    /**
     * Get all users
     */
    @Get('get')
    public async getUsers(): Promise<DocUser[]> {
        try {
            console.log("Get Users called");
            const users: DocUser[] = await UserModel.find();
            return JSON.parse(JSON.stringify(users));
        } catch (error) {
            this.setStatus(500);
            throw new Error("Internal server error occurred.");
        }
    }
}
