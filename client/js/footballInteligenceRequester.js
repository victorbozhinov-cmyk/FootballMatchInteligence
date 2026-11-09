async function requester(method, url, data){
    const options = {
        method,
        headers: {
            "Content-Type": "application/json"
        }
    }

    if(data!==undefined){
        options.body = JSON.stringify(data)
    }

    try{
        const response = await fetch(url, options)

        if(!response.ok){
            throw new Error(`Request failed: ${response.status}`)
        }

        if(response.status===204){
            return
        }

        return await response.json()
    }
    catch(err){
        console.error(err.message)
        throw err 
    }    
}

const get = (url)=> requester("GET", url)
const post = (url, data)=> requester("POST", url, data)
const put = (url, data)=> requester("PUT", url, data)
const del = (url)=> requester("DELETE", url)

export const api = {
    get, post, put, del
}