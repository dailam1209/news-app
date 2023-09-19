interface Params {
	baseUrl: any
	headers : any
	method: string
}


export const config: Params = {
    baseUrl: process.env.REACT_APP_API_URL,
    headers: {
        "Authorization": "",
            },
    method: 'get'
}



