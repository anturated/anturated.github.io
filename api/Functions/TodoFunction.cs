using FuncAPI.Domain.DTO;
using FuncAPI.Domain.Model;
using FuncAPI.Persistence.Data;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace FuncAPI.Functions;

public class TodoFunction
{
    private readonly StorageContext context;

    public TodoFunction(StorageContext ctx)
    {
        context = ctx;
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
                done = t.done
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
            string text)
    {
        HttpResponseData response;

        try
        {
            var newTodo = new TodoItem() { text = text };
            context.Todos.Add(newTodo);
            await context.SaveChangesAsync();

            response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(new TodoDTO()
            {
                text = newTodo.text,
                done = newTodo.done,
                id = newTodo.Id
            });
        }
        catch (Exception ex)
        {
            response = req.CreateResponse(HttpStatusCode.BadRequest);
            await response.WriteStringAsync(ex.Message);
        }

        return response;
    }

    [Function("EditTodos")]
    public async Task<HttpResponseData> EditTodos(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "todos")] HttpRequestData req)
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
            await context.SaveChangesAsync();

            response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(todo);
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
            Guid id)
    {
        HttpResponseData response;

        try
        {
            var todo = await context.Todos.Where(t => t.Id == id).FirstOrDefaultAsync();

            if (todo == null)
                throw new Exception("Id not found");

            string text = todo.text;
            context.Todos.Remove(todo);
            await context.SaveChangesAsync();

            response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteStringAsync(text);
        }
        catch (Exception ex)
        {
            response = req.CreateResponse(HttpStatusCode.BadRequest);
            await response.WriteStringAsync(ex.Message);
        }

        return response;
    }
}

