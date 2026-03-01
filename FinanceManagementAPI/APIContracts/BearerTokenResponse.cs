namespace FinanceManagementAPI.APIContracts
{
    public class BearerTokenResponse
    {
        public required string access_token { get; set; }
        public required string token_type { get; set; }
    }
}
