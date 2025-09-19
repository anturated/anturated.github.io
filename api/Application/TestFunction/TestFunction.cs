using FuncAPI.Domain.DTO;
using FuncAPI.Persistence.Data;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace FuncAPI
{
    public class TestFunction
    {
        private readonly StorageContext context;
        public TestFunction(StorageContext ctx)
        {
            context = ctx;
        }

        [Function("TestFunction")]
        public async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req)
        {
            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteStringAsync("Hello from Azure Functions!");
            return response;
        }

        [Function("test1")]
        public async Task<HttpResponseData> AddItem([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "additem")] HttpRequestData req)
        {
            HttpResponseData response;

            try
            {
                context.Todos.Add(new() { text = "asadasd " + DateTime.Now.ToString() });
                await context.SaveChangesAsync();

                response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteStringAsync("ok");
            }
            catch (Exception ex)
            {
                response = req.CreateResponse(HttpStatusCode.BadRequest);
                await response.WriteStringAsync(ex.Message);
            }

            return response;
        }

        [Function("test2")]
        public async Task<HttpResponseData> GetItems([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "getitems")] HttpRequestData req)
        {
            HttpResponseData response;

            try
            {
                var todos = await context.Todos.Select(t => new TodoDTO()
                {
                    text = t.text,
                    done = t.done
                }).ToListAsync();

                response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteAsJsonAsync(todos);
            }
            catch (Exception ex)
            {
                response = req.CreateResponse(HttpStatusCode.BadRequest);
                await response.WriteStringAsync(ex.Message);
            }

            return response;
        }
    }
}

