using FuncAPI.Persistence.Data;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Azure.SignalR.Management;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = FunctionsApplication.CreateBuilder(args);

// DB
var conn = Environment.GetEnvironmentVariable("DbConnection");

builder.Services.AddDbContext<StorageContext>(options =>
    options.UseCosmos(conn!, databaseName: "main")
);

// SignalR
var sconn = Environment.GetEnvironmentVariable("AzureSignalRConnectionString");
// builder.Services.AddSignalR().AddAzureSignalR(sconn!);
builder.Services.AddSingleton(sp =>
{
    var manager = new ServiceManagerBuilder()
        .WithOptions(o => { o.ConnectionString = sconn!; })
        .BuildServiceManager();
    return manager;
});

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
