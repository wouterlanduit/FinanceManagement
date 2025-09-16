namespace FinanceManagementAPI.Models
{
    public class Source
    {
        public int Id { get; set; }
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
