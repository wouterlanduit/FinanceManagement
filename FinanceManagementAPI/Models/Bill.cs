namespace FinanceManagementAPI.Models
{
    public class Bill
    {
        // Primary Key
        public int Id { get; set; }
        // Foreign Keys
        // TODO add relationship
        public int SourceId { get; set; }
        // Other Attributes
        public DateTime? Date { get; set; }
        public DateTime? DatePayed { get; set; }
        public decimal? Amount { get; set; }
    }

}
