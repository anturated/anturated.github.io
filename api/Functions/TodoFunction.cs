using FuncAPI.Domain.DTO;
using FuncAPI.Domain.Model;
using FuncAPI.Persistence.Data;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.SignalR.Management;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace FuncAPI.Functions;

public class TodoFunction
{
    private readonly StorageContext context;
    private readonly ServiceManager services;

    public TodoFunction(StorageContext ctx, ServiceManager serviceManager)
    {
        context = ctx;
        services = serviceManager;
    }

    [Function("GetTodos")]
    public async Task<HttpResponseData> GetItems(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "todos")] HttpRequestData req)
    {
        HttpResponseData response;

        try
        {
            var todos = await context.Todos.Select(t => new TodoDTO()
            {
                id = t.Id,
                text = t.text,
                done = t.done,
                content = t.content
            }).ToListAsync();

            response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(todos);
        }
        catch (Exception ex)
        {
            response = req.CreateResponse(HttpStatusCode.BadRequest);
            await response.WriteStringAsync(ex.Message);
            Console.WriteLine("ERROR: " + ex.Message);
        }

        return response;
    }

    [Function("AddTodos")]
    public async Task<HttpResponseData> AddItem(
            [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "todos")] HttpRequestData req,
            CancellationToken cancellationToken)
    {
        HttpResponseData response;
        SignalRMessageAction message;

        try
        {
            var request = await req.ReadFromJsonAsync<AddTodoRequest>();
            if (request == null)
                throw new Exception("failed reading request data");

            var newTodo = new TodoItem() { text = request.text };

            context.Todos.Add(newTodo);
            await context.SaveChangesAsync();

            var dto = new TodoDTO()
            {
                text = newTodo.text,
                done = newTodo.done,
                content = newTodo.content,
                id = newTodo.Id
            };

            await using var hubContext = await services.CreateHubContextAsync("todos", cancellationToken);
            await hubContext.Clients.All.SendCoreAsync("todoUpdated", new[] { dto });

            response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(dto);
        }
        catch (Exception ex)
        {
            message = new("");
            response = req.CreateResponse(HttpStatusCode.BadRequest);
            await response.WriteStringAsync(ex.Message);
        }

        return response;
    }

    [Function("EditTodos")]
    public async Task<HttpResponseData> EditTodos(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "todos")] HttpRequestData req,
            CancellationToken cancellationToken)
    {
        HttpResponseData response;

        try
        {
            var request = await req.ReadFromJsonAsync<EditTodoRequest>();
            if (request == null)
                throw new Exception("error parsing requset");
            if (string.IsNullOrEmpty(request.text))
                throw new Exception("arguments where");

            var todo = await context.Todos.Where(t => t.Id == request.id).FirstOrDefaultAsync();

            if (todo == null)
                throw new Exception("Id not found");

            todo.text = request.text;
            todo.done = request.done;
            todo.content = request.content;
            await context.SaveChangesAsync();

            var dto = new TodoDTO()
            {
                text = todo.text,
                done = todo.done,
                content = todo.content,
                id = todo.Id
            };

            await using var hubContext = await services.CreateHubContextAsync("todos", cancellationToken);
            await hubContext.Clients.All.SendCoreAsync("todoUpdated", new[] { dto });

            response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(dto);
        }
        catch (Exception ex)
        {
            response = req.CreateResponse(HttpStatusCode.BadRequest);
            await response.WriteStringAsync(ex.Message);
        }

        return response;
    }

    [Function("DeleteTodos")]
    public async Task<HttpResponseData> DeleteTodos(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "todos")] HttpRequestData req,
            CancellationToken cancellationToken)
    {
        HttpResponseData response;
        var request = await req.ReadFromJsonAsync<DeleteTodoRequest>();
        if (request == null) throw new Exception("cant read id");

        try
        {
            var todo = await context.Todos.Where(t => t.Id == request.id).FirstOrDefaultAsync();

            if (todo == null)
                throw new Exception("Id not found");

            var deleted = new TodoDTO()
            {
                text = todo.text,
                id = todo.Id,
                content = todo.content,
                done = todo.done
            };

            context.Todos.Remove(todo);
            await context.SaveChangesAsync();

            await using var hubContext = await services.CreateHubContextAsync("todos", cancellationToken);
            await hubContext.Clients.All.SendCoreAsync("todoDeleted", new[] { deleted });

            response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(deleted);
        }
        catch (Exception ex)
        {
            response = req.CreateResponse(HttpStatusCode.BadRequest);
            await response.WriteStringAsync(ex.Message);
        }

        return response;
    }

    [Function("negotiate")]
    public async Task<HttpResponseData> Negotiate(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", "options", Route = "todos/negotiate")] HttpRequestData req,
        [SignalRConnectionInfoInput(HubName = "todos")] SignalRConnectionInfo connectionInfo)
    {
        HttpResponseData response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(connectionInfo);
        return response;
    }
}

