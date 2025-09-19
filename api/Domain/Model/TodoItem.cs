namespace FuncAPI.Domain.Model;

public class TodoItem : BaseModel
{
    public required string text { get; set; }
    public bool done { get; set; } = false;
}
