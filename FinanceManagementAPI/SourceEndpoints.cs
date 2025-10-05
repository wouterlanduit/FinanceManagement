using FinanceManagementAPI.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

namespace FinanceManagementAPI
{
    public static class SourceEndpoints
    {
        public static void Map(WebApplication app)
        {
            var sourceGroup = app.MapGroup("/sources/");
            sourceGroup.MapGet("/", async (FinanceManagementDb db) => await db.Sources.ToListAsync())
                .RequireAuthorization("Read");
            sourceGroup.MapGet("/{id}", async ([FromRoute] int id, [FromServices] FinanceManagementDb db) => await db.Sources.FindAsync(id))
                .RequireAuthorization("DetailedRead");
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
            })
                .Produces<Source>(StatusCodes.Status201Created)
                .Produces(StatusCodes.Status400BadRequest)
                .Produces(StatusCodes.Status500InternalServerError)
                .RequireAuthorization("Write");
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
            })
                .Produces(StatusCodes.Status204NoContent)
                .Produces(StatusCodes.Status500InternalServerError)
                .RequireAuthorization("Delete");
        }
    }
}
