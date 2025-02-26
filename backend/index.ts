
import {api as APIs} from "./api/v1"
import { fastify } from "fastify"
import cors from '@fastify/cors'
import OU from "openurl"
import { readdir, readFile } from "fs/promises"
import fastifyWebsocketConnector from "./ws"

start().catch(console.log)
const REQ = Symbol.for("REQUEST")
const RES = Symbol.for("RESPONSE")
async function start() {
    const server = fastify({ logger: false })

    process.on('SIGINT', async () => {
        try {
            await server.close();
            console.log('Server gracefully shut down');
            process.exit(0);
        } catch (err) {
            console.error('Error while shutting down server:', err);
            process.exit(1);
        }
    });

    await server.register(cors, {origin: true})

    const wsAdd = await fastifyWebsocketConnector({server})

    server.get("/read-media/:ext", async (req,res)=>{
        try {
            // @ts-ignore
            res.send(await readFile(decodeURIComponent(req.query.url)))
        } catch (error) {
            console.log(error)
        }
    })

    function useR(req: any, res: any) {
        return Object.assign(req.body, {[REQ]: req, [RES]: res})
    }

    function useError(cb: any, progName: string, route: string) {
        return async function errorHandling(...args: any) {
            try {
                return await cb(...args)
            } catch (error) {
                console.error(`Prog Error Below: ${progName}: ${route}`)
                console.error(error)
                throw error
            }
        }
    }
    
    for (const route in APIs) // @ts-ignore
        if(typeof APIs[route] == "function") // @ts-ignore
            server.post(`/api/v1/${route}`, useError((req, res) => // @ts-ignore
                APIs[route](useR(req, res)), "BACKEND", "CORE")
            )

    const progs = await readdir("../frontend/src/programs/v1/")
    for (const progName of progs) {
        console.log(progName)

        // @ts-ignore
        globalThis['TEMP-SUBDIR'] = progName

        const {api, any, ws} = await import(`../frontend/src/programs/v1/${progName}/backend/index.ts`)

        if (ws)
            wsAdd(progName, ws.fromClient)

        for (const route in (any || {})) // @ts-ignore
            if(typeof any[route] == "function") // @ts-ignore
                server.all(`/api/v1/${progName}/${route}/*`, useError(any[route], progName, route))

        for (const route in api) // @ts-ignore
            if(typeof api[route] == "function") // @ts-ignore
                server.post(`/api/v1/${progName}/${route}`, useError((req, res) => // @ts-ignore
                    api[route](useR(req, res))
                , progName, route))
    }

    try {
        const port = await new Promise((r,j) => server.listen({ port: 3040, host: "::",  }, (e,a) => e ? j(e) : r(a))) as string
        const url = `http://localhost:${port.split(":").pop()}`
        console.log(url)
        // OU.open(url)
        // OU.open(`http://localhost:3000/?http://localhost:${port.split(":").pop()}`)
    } catch (error) {
        // @ts-ignore
         console.log(error.message)
    }

    
}