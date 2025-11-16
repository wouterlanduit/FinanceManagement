using FinanceManagementAPI.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

namespace FinanceManagementAPI
{
    public static class ReceiptEndpoints
    {
        public static void Map(WebApplication app)
        {
            var receiptGroup = app.MapGroup("/receipts/");
            receiptGroup.MapGet("/", async (FinanceManagementDb db) => await db.Receipts.ToListAsync())
                .RequireAuthorization(Constants.Authorization.PolicyRead);
            receiptGroup.MapGet("/{id}", async ([FromRoute] int id, [FromServices] FinanceManagementDb db) => await db.Receipts.FindAsync(id))
                .RequireAuthorization(Constants.Authorization.PolicyDetailedRead);
            receiptGroup.MapPost("/", async (Receipt receipt, FinanceManagementDb db) =>
            {
                db.Receipts.Add(receipt);
                await db.SaveChangesAsync();

                return Results.Created($"/receipts/{receipt.Id}", receipt);
            })
                .RequireAuthorization(Constants.Authorization.PolicyWriteData);
            receiptGroup.MapDelete("/{id}", async ([FromRoute] int id, [FromServices] FinanceManagementDb db) =>
            {
                IResult result = TypedResults.NotFound();

                try
                {
                    if (await db.Receipts.FindAsync(id) is Receipt receipt)
                    {
                        db.Receipts.Remove(receipt);
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
                .RequireAuthorization(Constants.Authorization.PolicyDelete);
        }
    }
}
