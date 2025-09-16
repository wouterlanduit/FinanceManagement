using Microsoft.EntityFrameworkCore;

namespace FinanceManagementAPI.Models
{
    public class FinanceManagementDb : DbContext
    {
        public FinanceManagementDb(DbContextOptions options) : base(options) { }
        public DbSet<Source> Sources { get; set; } = null!;
        public DbSet<Receipt> Receipts { get; set; } = null!;
        public DbSet<Bill> Bills { get; set; } = null!;
        public DbSet<Gift> Gifts { get; set; } = null!;
    }
}
