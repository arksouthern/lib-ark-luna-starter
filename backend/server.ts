
import { api as APIs } from "./api/v1"
import { fastify, FastifyInstance } from "fastify"
import cors from '@fastify/cors'
import OU from "openurl"
import { readdir, readFile } from "fs/promises"
import { fastifyWebsocketConnector } from "./ws"

type Server = { server: FastifyInstance }
type ProgName = { progName: string }

const

	REQ = Symbol.for("REQUEST")
	,
	RES = Symbol.for("RESPONSE")
	,
	configServerCloseOnCreate = (props: Server) => {
		process.on('SIGINT', async () => {
			try {
				await props.server.close();
				console.log('Server gracefully shut down');
				process.exit(0);
			} catch (err) {
				console.error('Error while shutting down server:', err);
				process.exit(1);
			}
		})
	}
	,
	configServerCorsAllow = async (props: Server) => {
		await props.server.register(cors, { origin: true })
	}
	,
	configServerStaticFileServer = (props: Server) => {
		props.server.get("/read-media/:ext", async (req, res) => {
			try {
				// @ts-ignore
				res.send(await readFile(decodeURIComponent(req.query.url)))
			} catch (error) {
				console.log(error)
			}
		})
	}
	,
	useBodyRr = (req: any, res: any) => {
		return Object.assign(req.body, { [REQ]: req, [RES]: res })
	}
	,
	useRouteError = (cb: (req: any, res: any) => any, progName: string, route: string) => {
		return async function errorHandling(...args: any) {
			try {
				// @ts-ignore
				return await cb(...args)
			} catch (error) {
				console.error(`Prog Error Below: ${progName}: ${route}`)
				console.error(error)
				throw error
			}
		}
	}
	,
	configCoreOsRoutesCreate = (props: Server) => {
		for (const route in APIs) // @ts-ignore
			if (typeof APIs[route] == "function") // @ts-ignore
				props.server.post(`/api/v1/${route}`, useRouteError((req, res) => // @ts-ignore
					APIs[route](useBodyRr(req, res)), "BACKEND", "CORE")
				)
	}
	,
	configApplicationStarRoutesCreate = (props: Server & ProgName & { any: Record<string, Function> }) => {
		for (const route in (props.any || {}))
			if (typeof props.any[route] == "function")
				props.server.all(
					`/api/v1/${props.progName}/${route}/*`,
					useRouteError(props.any[route] as any, props.progName, route)
				)
	}
	,
	configApplicationPostRoutesCreate = (props: Server & ProgName & { api: Record<string, Function> }) => {
		for (const route in props.api)
			if (typeof props.api[route] == "function")
				props.server.post(
					`/api/v1/${props.progName}/${route}`,
					useRouteError(
						(req, res) => props.api[route](useBodyRr(req, res)),
						props.progName,
						route
					)
				)
	},
	configServerStartListen = async (props: Server) => {
		try {
			const port = await new Promise((r, j) => props.server.listen({ port: 3040, host: "::", }, (e, a) => e ? j(e) : r(a))) as string
			const url = `http://localhost:${port.split(":").pop()}`
			console.log(url)
			// OU.open(url)
			// OU.open(`http://localhost:3000/?http://localhost:${port.split(":").pop()}`)
		} catch (error) {
			// @ts-ignore
			console.log(error.message)
		}
	}


export const

	coreLunaOsBackendServerStart = async () => {
		const server = fastify({ logger: false })

		configServerCloseOnCreate({ server })

		const wsAdd = await fastifyWebsocketConnector({ server })

		configServerCorsAllow({ server })


		configServerStaticFileServer({ server })

		configCoreOsRoutesCreate({ server })


		const progs = await readdir("../frontend/src/programs/v1/", { withFileTypes: true })
		for (const prog of progs) {
			console.log(prog.name)
			const progName = prog.name
			if (!prog.isDirectory()) continue

			// @ts-ignore
			globalThis['TEMP-SUBDIR'] = progName
			
			const { api, any, ws } = await import(`../frontend/src/programs/v1/${progName}/backend/index.ts`)

			if (ws)
				wsAdd(progName, ws.fromClient)

			configApplicationStarRoutesCreate({ server, any, progName })

			configApplicationPostRoutesCreate({ server, api, progName })

		}

		configServerStartListen({ server })
	}