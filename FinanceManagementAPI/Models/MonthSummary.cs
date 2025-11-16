namespace FinanceManagementAPI.Models
{
    public class MonthSummary
    {
        // Primary Key
        public int Id { get; set; }
        // Other Attributes
        public int Year { get; set; }
        public int Month { get; set; }
        public decimal Rent { get; set; }
        public decimal Food { get; set; }
        public decimal NonFood { get; set; }
    }

}
