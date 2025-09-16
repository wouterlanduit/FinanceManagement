using FinanceManagementAPI.Models;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// TODO create config file
var connectionString = builder.Configuration.GetConnectionString("FinanacesDb") ?? "Data source=Finances.db";

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Finance Management API",
        Description = "Finances",
        Version = "v1"
    });
});

builder.Services.AddSqlite<FinanceManagementDb>(connectionString);

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Finanace Management API v1");
    });
}

app.MapGet("/", () => "Hello World!");

var sourceGroup = app.MapGroup("/sources/");
sourceGroup.MapGet("/", async (FinanceManagementDb db) => await db.Sources.ToListAsync());
sourceGroup.MapGet("/{id}", async ([FromRoute]int id, [FromServices]FinanceManagementDb db) => await db.Sources.FindAsync(id));
sourceGroup.MapPost("/", async (Source source, FinanceManagementDb db) =>
{
    db.Sources.Add(source);
    await db.SaveChangesAsync();

    return Results.Created("test", source);
});

app.Run();
