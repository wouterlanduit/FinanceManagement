namespace FinanceManagementAPI.Models
{
    public class Bill
    {
        public int Id { get; set; }
        public int SourceId { get; set; }
        public DateTime? Date { get; set; }
        public DateTime? DatePayed { get; set; }
        public decimal? Amount { get; set; }
    }

}
