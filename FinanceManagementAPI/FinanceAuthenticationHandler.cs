using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Text.Encodings.Web;

namespace FinanceManagementAPI
{
    public class FinanceAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        public FinanceAuthenticationHandler(IOptionsMonitor<AuthenticationSchemeOptions> options, ILoggerFactory logger, UrlEncoder encoder) : base(options, logger, encoder)
        {
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            AuthenticateResult ret = AuthenticateResult.NoResult();

            if (this.Context.Request.Headers.FirstOrDefault(x => x.Key.ToLower() == "test").Value == "test")
            {
                ClaimsPrincipal claimsPrincipal = new ClaimsPrincipal();
                ClaimsIdentity identity = new ClaimsIdentity("CustomAuthentication");
                identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, "test"));

                claimsPrincipal.AddIdentity(identity);

                ret = AuthenticateResult.Success(new AuthenticationTicket(claimsPrincipal, Scheme.Name));
            }
            else
            {
                ret = AuthenticateResult.Fail("Not authenticated");
            }


            return ret;
        }
    }
}
