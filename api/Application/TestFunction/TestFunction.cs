using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Net;

namespace FuncAPI
{
    public class TestFunction
    {
        [Function("TestFunction")]
        public async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req)
        {
            var response = req.CreateResponse(HttpStatusCode.OK);
            response.Headers.Add("Access-Control-Allow-Origin", "https://anturated.github.io");
            await response.WriteStringAsync("Hello from Azure Functions!");
            return response;
        }
    }
}

