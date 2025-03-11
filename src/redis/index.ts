import { createClient } from "redis";

class RedisService{
    private client: ReturnType<typeof createClient>;
    private isConnected : boolean = false;

    constructor(){
        this.client = createClient({
            url : process.env.REDIS_URL || 'redis://localhost:6379'
        });

        this.client.on('error', (err) => {
            console.log('Redis error: ', err);
            this.isConnected = false;
        })

        this.client.on('connect',()=> {
            console.log('Redis connected');
            this.isConnected = true;
        })

        this.connect();

    }

    private async connect(){
        try {
            await this.client.connect();

        }
        catch (error){
            console.log('Error while connecting to Redis: ', error);
        }
    }

    async set(key:string , value : any , expireTime : number = 3600){
        if(!this.isConnected){
            await this.connect();
        }

        if(typeof value === 'object'){
            value = JSON.stringify(value);
        }

        this.client.set(key, value, 'EX', expireTime);
    }

}