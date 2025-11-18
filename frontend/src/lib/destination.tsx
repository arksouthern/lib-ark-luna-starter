import { JSX, createEffect } from "solid-js"
import { API, getRoot, setIp, setPort } from "./url"
import { DESTINATION_SETTINGS } from "../../../destination.settings"
import { Mx } from "./mx"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "~/components/ui/alert-dialog"
import { Button } from "~/components/ui/button"
import { TextField, TextFieldInput } from "~/components/ui/text-field"
import * as Icons from "solid-icons/fa"
import { createMutable } from "solid-js/store"

export { IsConnected }

type IsConnected = { as: "connected" } | { as: "loading" } | { as: "error" } | { as: "outOfDate" }

export const

	destinationStore = createMutable({
		connectionData: {
			ip: "" || location.origin,
			port: ""
		}
	})
	,
	unsavedDestinationStore = createMutable({
		isConnected: { as: "loading" } as IsConnected
	})
	,
	connectBackend = async (props: { tempConnectionData: { ip: string, port: string } }) => {
		const { ip, port } = props.tempConnectionData
		if (port) setPort({ port })
		if (ip) setIp({ ip })

		console.log({ ip, port })
		destinationStore.connectionData = { ip, port }

		await connectionChangeBackendTest()

		if (unsavedDestinationStore.isConnected.as != "connected") return

		history.replaceState({}, "", `${location.origin}${location.pathname}?${getRoot()}`)
	}
	,
	/** Try assuming the backend origin from the current URL params */
	mountBackendOriginFromUrl = () => {
		const apiUrlMaybe =
			location.search.startsWith("?http")
				? location.search.slice(1)
				: ""

		if (!apiUrlMaybe) return

		setIp({ ip: apiUrlMaybe })
		destinationStore.connectionData.ip = apiUrlMaybe
	}
	,
	connectionChangeBackendTest = async () => {
		unsavedDestinationStore.isConnected.as = "loading"
		void JSON.stringify(destinationStore.connectionData)

		try {
			var result = await API.apiHealthCheckConnect({})
		} catch (error) { }
		unsavedDestinationStore.isConnected.as = ( // @ts-ignore
			!result?.message ? "error" :
				result.message == (DESTINATION_SETTINGS.version) ? "connected" :
					"outOfDate"
		)
	}
	,
	Destination = (props: { showWhenConnected: JSX.Element }) => {

		mountBackendOriginFromUrl()

		createEffect(connectionChangeBackendTest)

		// whenConnectionIsCorrectlyUpdated()

		return (
			<Mx
				over={unsavedDestinationStore.isConnected}
				match={Match => <Match
					connected={() => props.showWhenConnected}
					outOfDate={() => {
						return (
							<AlertDialog open={true}>
								<AlertDialogContent>
									<AlertDialogTitle class='flex'>
										<span class='text-yellow-400 self-center'>
											<Icons.FaSolidExclamation />
										</span>
										<span class=''>
											Backend connected, but is an out of date version.
										</span>
									</AlertDialogTitle>
									<div class='grid gap-2 grid-cols-2'>
										<Button
											onClick={() => {
												void (API as any)["HARD_UPDATE"]({})
												alert("App updating, a new page will open automatically when updated.")
											}}
											textContent={`Update`}
										/>
										<Button
											variant={"secondary"}
											onClick={() => {
												unsavedDestinationStore.isConnected = { as: "outOfDate" }
											}}
											textContent={`Ignore`}
										/>
									</div>
								</AlertDialogContent>
							</AlertDialog>
						)
					}}
					error={() => {
						const tempConnectionData = {
							ip: destinationStore.connectionData.ip || "",
							port: destinationStore.connectionData.port || ""
						}
						return (
							<AlertDialog open={true}>
								<AlertDialogContent>
									<AlertDialogTitle>
										Cannot Connect
									</AlertDialogTitle>
									<AlertDialogDescription>
										Fill out the URL of your backend server.
									</AlertDialogDescription>
									<TextField>
										<TextFieldInput
											type='text' placeholder='http://localhost:10923'
											value={destinationStore.connectionData.ip}
											onInput={(e) => tempConnectionData.ip = e.currentTarget.value}
											onKeyDown={async (e: any) => {
												if (e.key == "Enter") {
													await connectBackend({ tempConnectionData })
												}
											}}
										/>
									</TextField>
									{/* 
								<TextField>
									<TextFieldInput 
										type='text' placeholder='port' 
										value={destinationStore.connectionData.port} 
										onInput={(e) => tempConnectionData.port = e.currentTarget.value} 
									/>
								</TextField> 
								*/}
									<Button onClick={async () => {
										await connectBackend({ tempConnectionData })
									}}>Connect</Button>
								</AlertDialogContent>
							</AlertDialog>
						)
					}}
					loading={() => (
						<div class='w-screen h-screen items-center justify-center flex'>
							<span class='text-6xl font-semibold mr-6'>{DESTINATION_SETTINGS.appName}</span><Icons.FaSolidSpinner size={50} class='animate-spin' />
						</div>
					)}
				/>}
			/>
		)
	}