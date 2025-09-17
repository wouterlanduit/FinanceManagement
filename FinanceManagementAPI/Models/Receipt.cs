namespace FinanceManagementAPI.Models
{
    public class Receipt
    {
        // Primary Key
        public int Id { get; set; }
        // Foreign Keys
        // TODO relationship
        public int SourceId { get; set; }
        // Other Attributes
        public DateTime? Date { get; set; }
        public decimal? Amount { get; set; }
    }

}
