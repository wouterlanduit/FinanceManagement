using FinanceManagementAPI;
using FinanceManagementAPI.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Security.Claims;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// TODO create config file
var connectionString = builder.Configuration.GetConnectionString("FinancesDb") ?? "Data source=Finances.db";
string DefaultAuthenticationSchema = "jwt";

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Finance Management API",
        Description = "Finances",
        Version = "v1"
    });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Scheme = "Bearer",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });
    c.AddSecurityDefinition("FinanceDefinition", new OpenApiSecurityScheme
    {
        Scheme = "FinanceScheme",
        In = ParameterLocation.Header,
        Name = "test",
        Type = SecuritySchemeType.ApiKey
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header
            },
            new List<string>()
        }
    });
    OpenApiSecurityRequirement securityRequirement = new OpenApiSecurityRequirement();
    securityRequirement.Add(
        new OpenApiSecurityScheme
        {
            Reference = new OpenApiReference
            {
                Id = "FinanceDefinition",
                Type = ReferenceType.SecurityScheme
            }
        },
        new List<string>());

    c.AddSecurityRequirement(securityRequirement);
});

builder.Services.AddSqlite<FinanceManagementDb>(connectionString);

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

builder.Services.AddAuthentication(DefaultAuthenticationSchema)
    .AddJwtBearer("jwt", options =>
    {
        options.MapInboundClaims = false;
    })
    .AddScheme<AuthenticationSchemeOptions, FinanceAuthenticationHandler>("FinanceScheme", options =>
    {
    });
builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            // TODO check how to specify origin correctly
            policy.WithOrigins("http://localhost").AllowAnyOrigin();
        });
});

var app = builder.Build();

//app.UseStatusCodePages();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Finance Management API v1");
    });
}

app.UseRouting();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapPost("/login", () =>
{
    JsonWebTokenHandler handler = new JsonWebTokenHandler();

    // TODO add key

    return handler.CreateToken(new SecurityTokenDescriptor()
    {
        Subject = new ClaimsIdentity(new[]
        {
            new Claim("name", "test")
        })
    });
});

var sourceGroup = app.MapGroup("/sources/");
sourceGroup.MapGet("/", async (FinanceManagementDb db) => await db.Sources.ToListAsync());
sourceGroup.MapGet("/{id}", async ([FromRoute]int id, [FromServices]FinanceManagementDb db) => await db.Sources.FindAsync(id));
sourceGroup.MapPost("/", async (Source source, FinanceManagementDb db) =>
{
    IResult result = TypedResults.BadRequest();

    try
    {
        db.Sources.Add(source);
        await db.SaveChangesAsync();
        result = TypedResults.Created($"/sources/{source.Id}", source);
    }
    catch
    {
        result = TypedResults.StatusCode(StatusCodes.Status500InternalServerError);
    }


    return result;
}).Produces<Source>(StatusCodes.Status201Created)
.Produces(StatusCodes.Status400BadRequest)
.Produces(StatusCodes.Status500InternalServerError);
sourceGroup.MapDelete("/{id}", async ([FromRoute] int id, [FromServices] FinanceManagementDb db) =>
{
    IResult result = TypedResults.NotFound();

    try
    {
        if (await db.Sources.FindAsync(id) is Source source)
        {
            db.Sources.Remove(source);
            await db.SaveChangesAsync();
            result = Results.NoContent();
        }
    }
    catch
    {
        result = TypedResults.StatusCode(StatusCodes.Status500InternalServerError);
    }

    return result;
}).Produces(StatusCodes.Status204NoContent)
.Produces(StatusCodes.Status500InternalServerError);

var receiptGroup = app.MapGroup("/receipts/");
receiptGroup.MapGet("/", async (FinanceManagementDb db) => await db.Receipts.ToListAsync());
receiptGroup.MapGet("/{id}", async ([FromRoute] int id, [FromServices] FinanceManagementDb db) => await db.Receipts.FindAsync(id));
receiptGroup.MapPost("/", async (Receipt receipt, FinanceManagementDb db) =>
{
    db.Receipts.Add(receipt);
    await db.SaveChangesAsync();

    return Results.Created($"/receipts/{receipt.Id}", receipt);
});

var billGroup = app.MapGroup("/bills/");
billGroup.MapGet("/", async (FinanceManagementDb db) => await db.Bills.ToListAsync());
billGroup.MapGet("/{id}", async ([FromRoute] int id, [FromServices] FinanceManagementDb db) => await db.Bills.FindAsync(id));
billGroup.MapPost("/", async (Bill bill, FinanceManagementDb db) =>
{
    db.Bills.Add(bill);
    await db.SaveChangesAsync();

    return Results.Created($"/bills/{bill.Id}", bill);
});

app.Run();
