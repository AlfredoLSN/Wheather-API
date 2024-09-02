import express, { Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";
import redisClient from "../db/redis_client";
import { sleep } from "./utils/sleep";

dotenv.config();
const app = express();
const apiKey = process.env.API_KEY;

app.get("/", async (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.get("/wheather/:city", async (req: Request, res: Response) => {
    const city = req.params.city;

    try {
        const keyExist = await redisClient.exists(city);
        if (!keyExist) {
            const startTime1 = Date.now();
            const result = await axios.get(
                `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/today?unitGroup=metric&include=days%2Cfcst%2Ccurrent%2Cobs%2Cremote%2Cstats%2Cstatsfcst%2Chours%2Calerts%2Cevents&key=${apiKey}&contentType=json`
            );

            const dataWheather = {
                address: result.data.resolvedAddress,
                max: "" + result.data.days[0].tempmax,
                min: "" + result.data.days[0].tempmin,
                description: result.data.description,
            };
            await redisClient.hSet(city, dataWheather);
            await redisClient.expire(city, 43200);
            await sleep(2000);
            res.json(dataWheather);
            const endTime1 = Date.now();
            console.log(`Acessando API Externa: ${endTime1 - startTime1} ms`);
        } else {
            const startTime2 = Date.now();
            const dbData = await redisClient.hGetAll(city);
            res.json(dbData);
            const endTime2 = Date.now();
            console.log(
                `Acessando Cache com Redis: ${endTime2 - startTime2} ms`
            );
        }

        //console.log("Achou");
    } catch (err) {
        console.log(err);
    }
});

app.listen(3333, () => {
    console.log("Servidor Rodando!");
});
