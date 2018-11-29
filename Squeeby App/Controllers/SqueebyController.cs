using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Squeeby_App.Models;
using System.Net.Http;

namespace Squeeby_App.Controllers
{
    public class SqueebyController : Controller
    {
        private readonly IConfiguration Config;

        public SqueebyController(IConfiguration config)
        {
            Config = config;
        }

        protected string GrecaptchaSiteKey => Config["grecaptcha:site-key"];

        protected bool VerifyResponse(string response)
        {
            var client = new HttpClient();
            var reply = client.GetStringAsync($"https://www.google.com/recaptcha/api/siteverify?secret={Config["grecaptcha:server-key"]}&response={response}").Result;
            var model = JsonConvert.DeserializeObject<GoogleReCaptchaResponseModel>(reply);
            return model.Success && model.Score > 0.5;
        }

    }
}
