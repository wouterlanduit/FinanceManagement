namespace FinanceManagementAPI.Models
{
    public class Gift
    {
        // Primary Key
        public int Id { get; set; }
        // Other Attributes
        public string? Name { get; set; }
        public decimal? Amount { get; set; }
        public GiftType Type { get; set; }
    }

    public enum GiftType
    {
        None = 0,
        Wedding,
        Birth
    }
}
