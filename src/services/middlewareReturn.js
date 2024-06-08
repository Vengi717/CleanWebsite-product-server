
exports.returner = async (result, api_name, statusCode) => {
    // const senderIP = event.requestContext.identity.sourceIp;
    const corsSettings = {//https://v3-erm.web.app
        "Access-Control-Allow-Origin": "*",//"https://v3-erm.web.app",
        "Access-Control-Allow-Methods": "POST,GET,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,X-Api-Key",
    };

    if (statusCode == undefined) {
        statusCode = 200
    }
    if (result[0]) {
        return await {
            statusCode: statusCode,
            headers: corsSettings,
            body: JSON.stringify({
                success: result[0],
                api: api_name,
                data: result[1] || "Server Error, please try again later",
            }),
        }
    } else {
        console.log("API: ", api_name)
        console.log("ERROR.", result)

        //console.log("this is the return: ", JSON.stringify(result[1]))
        return await {
            statusCode: statusCode,
            headers: corsSettings,
            body: JSON.stringify({
                success: result[0],
                api: api_name,
                error: result[1]
            }),
        }
    }
}









