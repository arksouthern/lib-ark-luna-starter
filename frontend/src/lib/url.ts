// import type * as TAPI from "../../../backend/api/v1.js";
import { type api as TAPI } from "../../../backend/api/v1.js"

export { APIProps }

type Props<F> = F extends (props: infer P) => any ? P : never
type APIProps = { [K in keyof typeof TAPI]: Props<typeof TAPI[K]> }

let

	port = ""
	,
	ip = ""

export const

	apiRoot = `/api`
	,
	apiBasic = apiRoot + "/v1"
	,
	fetchJson = (url = "", body = {}, options = {}) => {
		return fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
			...options
		}).then(r => r.text()).then(text => JSON.parse(text || '{}'));
	}
	,
	setPort = (props: { port: string }) => {
		port = props.port
	}
	,
	setIp = (props: { ip: string }) => {
		ip = props.ip
	}
	,
	getRoot = () => {
		let root = ""
		if (ip) root += ip
		if (port) root += ":" + port
		return root
	}
	,
	// @ts-ignore
	API: typeof TAPI = new Proxy({}, {
		get: (_, p: string) => (props: any) => fetchJson(`${getRoot()}${apiRoot}/v1/${p}`, props)
	})
	,
	// @ts-ignore
	createApi: <T>(progId: string) => T = (progId: string) => new Proxy({}, {
		get: (_, p: string) => (props: any) => fetchJson(`${getRoot()}${apiRoot}/v1/${progId.replace("@", "").replace("/", ".")}/${p}`, props)
	})

