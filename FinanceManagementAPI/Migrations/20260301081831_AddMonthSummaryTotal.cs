using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinanceManagementAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddMonthSummaryTotal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Total",
                table: "MonthSummaries",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Utilities",
                table: "MonthSummaries",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Total",
                table: "MonthSummaries");

            migrationBuilder.DropColumn(
                name: "Utilities",
                table: "MonthSummaries");
        }
    }
}
