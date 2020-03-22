using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Squeeby_App.Models;
using System.Net.Http;

namespace Squeeby_App.Controllers
{
    public class SqueebyController : Controller
    {
        private readonly AppSettingsModel _appSettings;

        public SqueebyController(IOptions<AppSettingsModel> appSettings)
        {
            _appSettings = appSettings.Value;
        }

        protected bool VerifyResponse(string response)
        {
            var client = new HttpClient();
            var reply = client.GetStringAsync($"https://www.google.com/recaptcha/api/siteverify?secret={_appSettings.GreCaptcha.ServerKey}&response={response}").Result;
            var model = JsonConvert.DeserializeObject<GoogleReCaptchaResponseModel>(reply);
            return model.Success && model.Score > 0.5;
        }

    }
}
