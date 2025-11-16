using FinanceManagementAPI.APIContracts;
using FinanceManagementAPI.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

namespace FinanceManagementAPI
{
    public static class MonthSummaryEndpoints
    {
        public static void Map(WebApplication app)
        {
            var summaryGroup = app.MapGroup("/summaries/");
            summaryGroup.MapGet("/", async ([FromQuery] int? year, [FromQuery] int? month, FinanceManagementDb db) =>
            {
                if (year != null || month != null)
                {
                    return await db.MonthSummaries.Where(s => (year == null || s.Year == year) && (month == null || s.Month == month)).ToListAsync();
                }
                return await db.MonthSummaries.ToListAsync();
            })
                .RequireAuthorization(Constants.Authorization.PolicyRead);
            summaryGroup.MapGet("/{id}", async ([FromRoute] int id, [FromServices] FinanceManagementDb db) => await db.MonthSummaries.FindAsync(id))
                .RequireAuthorization(Constants.Authorization.PolicyDetailedRead);

            summaryGroup.MapPost("/calculate-summary", async (CalculateSummaryRequest request, FinanceManagementDb db) =>
            {
                List<MonthSummary> summaries = await db.MonthSummaries.Where(s => s.Year == request.year && s.Month == request.month).ToListAsync();
                MonthSummary summary = summaries.Count > 0 ? summaries.First() : new MonthSummary() { Year = request.year, Month = request.month};

                summary.Rent = 600;

                // TODO calculate summary


                if (summary.Id == 0)
                {
                    db.MonthSummaries.Add(summary);
                }
                await db.SaveChangesAsync();

                return Results.Created($"/summaries/{summary.Id}", summary);
            })
                .RequireAuthorization(Constants.Authorization.PolicyWriteData);
            summaryGroup.MapDelete("/{id}", async ([FromRoute] int id, [FromServices] FinanceManagementDb db) =>
            {
                IResult result = TypedResults.NotFound();

                try
                {
                    if (await db.MonthSummaries.FindAsync(id) is MonthSummary summary)
                    {
                        db.MonthSummaries.Remove(summary);
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
