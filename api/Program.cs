using FuncAPI.Persistence.Data;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = FunctionsApplication.CreateBuilder(args);

// DB
var conn = Environment.GetEnvironmentVariable("DbConnection");

builder.Services.AddDbContext<StorageContext>(options =>
    options.UseCosmos(conn!, databaseName: "main")
);

// metrics?? idk
builder.ConfigureFunctionsWebApplication();

builder.Services
    .AddApplicationInsightsTelemetryWorkerService()
    .ConfigureFunctionsApplicationInsights();

// nosql ensure created stuff
var app = builder.Build();

await app.Services.GetRequiredService<StorageContext>()
    .Database.EnsureCreatedAsync();

app.Run();
