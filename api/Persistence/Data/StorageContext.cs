using FuncAPI.Domain.Model;
using Microsoft.EntityFrameworkCore;

namespace FuncAPI.Persistence.Data;

public class StorageContext : DbContext
{
    public StorageContext(DbContextOptions<StorageContext> options) : base(options)
    {
    }

    public DbSet<TodoItem> Todos { get; set; }
    public DbSet<TestModel> Tests { get; set; }


    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries())
        {
            if (entry.State == EntityState.Added)
            {
                if (entry.Entity is BaseModel entity)
                {
                    entity.Created = DateTime.UtcNow;
                    entity.Updated = DateTime.UtcNow;
                }
            }
            else if (entry.State == EntityState.Modified)
            {
                if (entry.Entity is BaseModel entity)
                {
                    entity.Updated = DateTime.UtcNow;
                }
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }
}
