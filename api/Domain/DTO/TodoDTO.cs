namespace FuncAPI.Domain.DTO;

public class TodoDTO
{
    public required Guid id { get; set; }
    public required string text { get; set; }
    public required bool done { get; set; }
}
