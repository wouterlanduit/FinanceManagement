using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace FinanceManagementAPI.Constants
{
    public class Authentication
    {
        public const string CookieScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        public const string BearerScheme = JwtBearerDefaults.AuthenticationScheme;
        public const string DefaultScheme = CookieScheme;
        public static readonly string[] SupportedSchemes = [CookieScheme, BearerScheme];
    }
}
