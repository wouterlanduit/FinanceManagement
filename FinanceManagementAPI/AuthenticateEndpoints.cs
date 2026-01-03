using FinanceManagementAPI.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

namespace FinanceManagementAPI
{
    public static class AuthenticateEndpoints
    {
        public static void Map(WebApplication app, string signKey)
        {
            var authenticateGroup = app.MapGroup("/authenticate/");
            authenticateGroup.MapPost("/bearer", (
                [FromQuery] string? name,
                [FromQuery] string? apiKey) =>
            {
                JsonWebTokenHandler handler = new JsonWebTokenHandler();
                var claims = new List<Claim>();
                if (!string.IsNullOrEmpty(name))
                {
                    claims.Add(new Claim("name", name));
                }
                if (!string.IsNullOrEmpty(apiKey))
                {
                    claims.Add(new Claim(ClaimTypes.Role, Constants.Authorization.RoleAdmin));    // TODO why does this not work with custom role claim type -> something in authentication handler??
                }
                var identity = new ClaimsIdentity(
                    claims,                                     // claims
                    JwtBearerDefaults.AuthenticationScheme,     // authentication type
                    "name",                                     // name type
                    ClaimTypes.Role);                           // role type
                // TODO add key

                return handler.CreateToken(new SecurityTokenDescriptor()
                {
                    Subject = identity,
                    SigningCredentials = new SigningCredentials(
                        new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(signKey)),
                        SecurityAlgorithms.HmacSha256)
                });
            })
                .AllowAnonymous();

            authenticateGroup.MapPost("/login", async (
                [FromQuery] string? name,
                [FromQuery] string? apiKey,
                HttpContext ctx) =>
            {
                var claims = new List<Claim>();
                if (!string.IsNullOrEmpty(name))
                {
                    claims.Add(new Claim("name", name));
                }
                if (!string.IsNullOrEmpty(apiKey))
                {
                    claims.Add(new Claim(ClaimTypes.Role, Constants.Authorization.RoleAdmin));    // TODO why does this not work with custom role claim type -> something in authentication handler??
                }
                var identity = new ClaimsIdentity(
                    claims,                                     // claims
                    JwtBearerDefaults.AuthenticationScheme,     // authentication type
                    "name",                                     // name type
                    ClaimTypes.Role);                           // role type
                // TODO add key

                await ctx.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(identity));

                return TypedResults.Ok();
            })
                .AllowAnonymous();

            authenticateGroup.MapPost("/logout", async (
                HttpContext ctx) =>
            {
                await ctx.SignOutAsync();

                return TypedResults.Ok();
            })
                .AllowAnonymous();

            authenticateGroup.MapGet("/check-login-status", (
                HttpContext ctx) =>
            {
                return Results.Ok<CheckLoginStatusResponse>(new CheckLoginStatusResponse
                {
                    loggedIn = ctx.User?.Identity?.IsAuthenticated??false
                });
            })
                .Produces<CheckLoginStatusResponse>(StatusCodes.Status200OK)
                .AllowAnonymous();
        }
    }

    public class CheckLoginStatusResponse
    {
        public bool loggedIn { get; set; }
    }
}
