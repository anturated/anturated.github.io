public record EditTodoRequest
{
    public Guid id { get; set; }
    public required string text { get; set; }
    public bool done { get; set; }
}
