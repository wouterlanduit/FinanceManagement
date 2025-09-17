namespace FinanceManagementAPI.Models
{
    public class Source
    {
        // Primary Key
        public int Id { get; set; }
        // Other Attributes
        public string? Name { get; set; }
        public SourceType Type { get; set; }
    }

    public enum SourceType
    {
        None = 0,
        Store,
        UtilityProvider
    }
}
