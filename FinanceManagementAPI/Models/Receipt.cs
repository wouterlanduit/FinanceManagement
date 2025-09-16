namespace FinanceManagementAPI.Models
{
    public class Receipt
    {
        public int Id { get; set; }
        public int SourceId { get; set; }
        public DateTime? Date { get; set; }
        public decimal? Amount { get; set; }
    }

}
