export const createSessionId = async (baseURL, brandID) => {
    try {
        const response = await fetch(`${baseURL}/store/${brandID}/init`, {
            method: "POST",
        })

        const data = await response.json()
        const sessionId = data.session

        if (typeof window !== "undefined") {
            localStorage.setItem("sessionId", sessionId)
        }

        return sessionId
    } catch (error) {
        console.error("Unable to create session id", error)
        return null
    }
}
