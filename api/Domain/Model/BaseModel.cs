using System.ComponentModel.DataAnnotations;

namespace FuncAPI.Domain.Model;

public abstract class BaseModel
{
    [Key]
    public Guid Id { get; set; }
    public DateTime Created { get; set; }
    public DateTime Updated { get; set; }
}
