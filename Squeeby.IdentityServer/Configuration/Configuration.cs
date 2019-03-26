using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using IdentityModel;
using IdentityServer4;
using IdentityServer4.Models;
using IdentityServer4.Test;
using IdentityServer4.Validation;

namespace Squeeby.IdentityServer.Configuration
{
    public class Configuration
    {
        private const string SqueebyApiSecret = "3FB6A12DF39257BE7E7E74D67CF4AA4C5BE756F0811E2220A4F8424EBF441A59";
        private const string SqueebyWebAppSecret = "7E876928DA19DCE427DD5C0FB51C5417AFD0AFAE6FAB7CCFCC053102AFD3F5EA";
        private const string SqueebyWebAppClientId = "WFSNtjPZSCXXbZY6xbdYC7JeXOHwfY0G";




        public static IEnumerable<IdentityResource> GetIdentityResources()
        {
            return new List<IdentityResource>()
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Email(),
                new IdentityResources.Profile()
            };
        }


        public static IEnumerable<ApiResource> GetApiResources()
        {

            return new[]
            {
                new ApiResource
                {
                    Name = "SQUEEBY_API",
                    Description = "Squeeby Web API",
                    ApiSecrets = { new Secret(SqueebyApiSecret)},
                    Scopes = new List<Scope>{
                        new Scope
                        {
                            Name = "SQUEEBY_API",
                            Description = "Squeeby Web API",
                            Required = true
                        }
                    }
                }
            };
        }

        public static IEnumerable<Client> GetClients()
        {
#if DEBUG
            var userPortalBaseUrl = "http://localhost:63453/";
            var userPortalBaseUrl2 = "https://localhost:63453/";
#else
            var userPortalBaseUrl = "https://www.squeeby.app/";
            var userPortalBaseUrl2 = "https://squeeby.app/";
#endif
            return new List<Client>
            {
                new Client()
                {
                    ClientId = SqueebyWebAppClientId,
                    ClientName = "Squeeby Web App",
                    ClientSecrets = { new Secret(SqueebyWebAppSecret) },
                    AccessTokenLifetime = 31536000,
                    AllowedGrantTypes = GrantTypes.Hybrid,
                    Enabled = true,
                    RedirectUris =  { $"{userPortalBaseUrl}signin-oidc", $"{userPortalBaseUrl2}signin-oidc" },
                    PostLogoutRedirectUris = { $"{userPortalBaseUrl}signout-callback-oidc", $"{userPortalBaseUrl2}signout-callback-oidc" },
#if DEBUG
                    AllowedCorsOrigins = { "https://www.squeeby.app", "https://squeeby.app" },
#else
                    AllowedCorsOrigins = {"http://localhost:63453/"},
#endif
                    AllowedScopes =
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        "SQUEEBY_API"
                    },
                    RequireConsent = false,
                }
            };
        }

        public static List<TestUser> GetTestUsers()
        {
            return new List<TestUser>()
            {
                new TestUser()
                {
                    Username = "test",
                    Password = "1234",
                    IsActive = true,
                    SubjectId = "1",
                    Claims = new List<Claim>()
                    {
                        new Claim(JwtClaimTypes.Email, "jeanpaul.mir@gmail.com"),
                        new Claim(JwtClaimTypes.Name, "Test user"),
                        new Claim(JwtClaimTypes.Profile, "This is Profile Value")
                    }
                }
            };
        }
    }
}
