import { coreLunaOsBackendServerStart } from "./server"

const

startIndex = async () => {
  await import("./api/config/-onstartup.js")
  coreLunaOsBackendServerStart()
}

startIndex()