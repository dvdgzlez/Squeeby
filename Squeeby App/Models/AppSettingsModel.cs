using Microsoft.Extensions.Configuration;
using System;
using System.IO;

namespace Squeeby_App.Models
{
    public class AppSettingsModel
    {
        public GreCaptchaModel GreCaptcha { get; set; }

        public GCloudSettingsModel GCloudSettings { get; set; }
    }

    //Please dont use this static, instead use the IOptions<AppSettingsModel> appSettings injection
    //This is only for application start
    public static class AppSettingsStatic
    {
        public static string GetLocalUrl()
        {
            var localUrl = GetConfig().GetValue<string>("ApplicationSettings:LocalUrl");
            return string.IsNullOrEmpty(localUrl) ? "http://localhost:5000" : localUrl;
        }
        private static IConfigurationRoot GetConfig()
        {
            var file = "app-secrets/appsettings.json";
            if (!String.IsNullOrEmpty(Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")))
            {
                file = $"app-secrets/appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")}.json";
            }
            return new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile(file, optional: true)
                .Build();
        }
    }
}