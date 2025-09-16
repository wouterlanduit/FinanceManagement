namespace FinanceManagementAPI.Models
{
    public class Gift
    {
        public int Id { get; set; }
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
