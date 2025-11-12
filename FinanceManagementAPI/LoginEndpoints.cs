using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

namespace FinanceManagementAPI
{
    public static class LoginEndpoints
    {
        public static void Map(WebApplication app, string signKey)
        {
            app.MapPost("/login", (
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
        }
    }
}
