using FinanceManagementAPI;
using FinanceManagementAPI.Constants;
using FinanceManagementAPI.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Microsoft.VisualBasic;
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
string DefaultAuthenticationSchema = CookieAuthenticationDefaults.AuthenticationScheme;//JwtBearerDefaults.AuthenticationScheme;
string SignKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
string[] allowedOrigins = { "http://localhost:51829" };

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
        Scheme = Authentication.BearerScheme,
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

builder.Services.AddAuthentication(Authentication.DefaultScheme)
    .AddJwtBearer(Authentication.BearerScheme, options =>
    {
        options.MapInboundClaims = false;
        options.TokenValidationParameters = new TokenValidationParameters()
        {
            IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(SignKey)),
            ValidateAudience = false,   // TODO true
            ValidateIssuer = false,     // TODO true
        };
    })
    .AddCookie(Authentication.CookieScheme, options =>
    {
        options.LoginPath = "/authentication/login";
        options.LogoutPath = "/authentication/logout";
        options.Cookie.Name = "_general_";
    })
    .AddScheme<AuthenticationSchemeOptions, FinanceAuthenticationHandler>("FinanceScheme", options =>
    {
    });

// TODO how to set default policy?
builder.Services.AddAuthorization(builder =>
{
    builder.AddPolicy(Authorization.PolicyRead, policy =>
        policy
            .RequireAuthenticatedUser()
            .AddAuthenticationSchemes(Authentication.SupportedSchemes));
    builder.AddPolicy(Authorization.PolicyDetailedRead, policy =>
        policy
            .RequireAuthenticatedUser()
            .AddAuthenticationSchemes(Authentication.SupportedSchemes)
            .RequireClaim("name", ["test", "API"])
            .RequireRole(Authorization.RoleAdmin));
    builder.AddPolicy(Authorization.PolicyWriteData, policy =>
        policy
            .RequireAuthenticatedUser()
            .AddAuthenticationSchemes(Authentication.SupportedSchemes)
            .RequireClaim("name", ["test", "API"])
            .RequireRole(Authorization.RoleAdmin));
    builder.AddPolicy(Authorization.PolicyWriteSetup, policy =>
        policy
            .RequireAuthenticatedUser()
            .AddAuthenticationSchemes(Authentication.SupportedSchemes)
            .RequireClaim("name", "test")
            .RequireRole(Authorization.RoleAdmin));
    builder.AddPolicy(Authorization.PolicyDelete, policy =>
        policy
            .RequireAuthenticatedUser()
            .AddAuthenticationSchemes(Authentication.SupportedSchemes)
            .RequireClaim("name", "test")
            .RequireRole(Authorization.RoleAdmin));
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.WithOrigins(allowedOrigins);
            //policy.AllowAnyOrigin();
            policy.AllowAnyMethod();
            policy.AllowAnyHeader();
            policy.AllowCredentials();
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

AuthenticateEndpoints.Map(app, SignKey);

SourceEndpoints.Map(app);

ReceiptEndpoints.Map(app);

BillEndpoints.Map(app);

MonthSummaryEndpoints.Map(app);

app.Run();
