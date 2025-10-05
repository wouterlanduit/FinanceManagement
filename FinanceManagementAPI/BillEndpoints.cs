using FinanceManagementAPI.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

namespace FinanceManagementAPI
{
    public static class BillEndpoints
    {
        public static void Map(WebApplication app)
        {
            var billGroup = app.MapGroup("/bills/");
            billGroup.MapGet("/", async (FinanceManagementDb db) => await db.Bills.ToListAsync())
                .RequireAuthorization("Read");
            billGroup.MapGet("/{id}", async ([FromRoute] int id, [FromServices] FinanceManagementDb db) => await db.Bills.FindAsync(id))
                .RequireAuthorization("DetailedRead");
            billGroup.MapPost("/", async (Bill bill, FinanceManagementDb db) =>
            {
                db.Bills.Add(bill);
                await db.SaveChangesAsync();

                return Results.Created($"/bills/{bill.Id}", bill);
            })
                .RequireAuthorization("Write");
        }
    }
}
