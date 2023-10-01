interface Params {
	baseUrl: any
	headers : any
	method: string
}


export const config: Params = {
    baseUrl: `http://192.168.0.102:3000`,
    headers: {
        "Authorization": "",
            },
    method: "get"
}



