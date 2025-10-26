using FinanceManagementAPI;
using FinanceManagementAPI.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
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

// TODO list
// - generate an asymmetric key for bearer
// - move config to config file
// - setup proper token validation parameters
// - setup proper policy
// - look into default policy
// - create proper token with proper claims



// TODO create config file
var connectionString = builder.Configuration.GetConnectionString("FinancesDb") ?? "Data source=Finances.db";
string DefaultAuthenticationSchema = JwtBearerDefaults.AuthenticationScheme;
string SignKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

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
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        In = ParameterLocation.Header,
        Name = "Authorization",
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
});

builder.Services.AddSqlite<FinanceManagementDb>(connectionString);

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

builder.Services.AddAuthentication(DefaultAuthenticationSchema)
    .AddJwtBearer(DefaultAuthenticationSchema ,options =>
    {
        options.MapInboundClaims = false;
        options.TokenValidationParameters = new TokenValidationParameters()
        {
            IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(SignKey)),
            ValidateAudience = false,   // TODO true
            ValidateIssuer = false,     // TODO true
        };
    })
    .AddScheme<AuthenticationSchemeOptions, FinanceAuthenticationHandler>("FinanceScheme", options =>
    {
    });

// TODO how to set default policy?
builder.Services.AddAuthorization(builder =>
{
    builder.AddPolicy("Read", policy =>
        policy
            .RequireAuthenticatedUser()
            .AddAuthenticationSchemes(DefaultAuthenticationSchema));
    builder.AddPolicy("DetailedRead", policy =>
        policy
            .RequireAuthenticatedUser()
            .AddAuthenticationSchemes(DefaultAuthenticationSchema)
            .RequireClaim("name", "test")
            .RequireRole("admin"));
    builder.AddPolicy("Write", policy =>
        policy
            .RequireAuthenticatedUser()
            .AddAuthenticationSchemes(DefaultAuthenticationSchema)
            .RequireClaim("name", "test")
            .RequireRole("admin"));
    builder.AddPolicy("Delete", policy =>
        policy
            .RequireAuthenticatedUser()
            .AddAuthenticationSchemes(DefaultAuthenticationSchema)
            .RequireClaim("name", "test")
            .RequireRole("admin"));
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            // TODO check how to specify origin correctly
            //policy.WithOrigins("http://localhost");
            policy.AllowAnyOrigin();
            policy.AllowAnyMethod();
            policy.AllowAnyHeader();
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

LoginEndpoints.Map(app, SignKey);

SourceEndpoints.Map(app);

ReceiptEndpoints.Map(app);

BillEndpoints.Map(app);

app.Run();
