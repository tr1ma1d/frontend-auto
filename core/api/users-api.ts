import {IUser} from './models/userEntity';



export default class UserApi{

    static async loginUser(username: string, password: string): Promise<IUser> {
        console.log(username, password);
    
        const response = await fetch("https://localhost:44331/User/validateUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Username: username,
                Password: password,
                Email: "" // Можно оставить пустым, если поле необязательное
            })
        });
    
        if (!response.ok) {
            throw new Error("Invalid credentials");
        }
    
        const user = await response.json();
        console.log(user); // Вместо user.toString используйте user напрямую
        return user;
    }
    static async addUser(username: string, password: string, email: string): Promise<void>{
        console.log(username, password);

        const response = await fetch("https://localhost:44331/User/addUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username, password, email})
        });
        if(!response.ok){
            throw new Error("Invalid credentials");
        }
    
        
    }

}