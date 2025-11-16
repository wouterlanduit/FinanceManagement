using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinanceManagementAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddMonthSummary : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MonthSummaries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Year = table.Column<int>(type: "INTEGER", nullable: false),
                    Month = table.Column<int>(type: "INTEGER", nullable: false),
                    Rent = table.Column<decimal>(type: "TEXT", nullable: false),
                    Food = table.Column<decimal>(type: "TEXT", nullable: false),
                    NonFood = table.Column<decimal>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MonthSummaries", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MonthSummaries");
        }
    }
}
