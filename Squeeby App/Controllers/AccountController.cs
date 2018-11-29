using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Squeeby_App.Helpers;
using Squeeby_App.Models;

namespace Squeeby_App.Controllers
{
    public class AccountController : SqueebyController
    {
        public AccountController(IConfiguration config) : base(config)
        {
        }

        public IActionResult Login()
        {
            ViewData["SiteKey"] = GrecaptchaSiteKey;
            ViewData["SiteAction"] = "login";
            return View();
        }

        [HttpPost]
        public ActionResult Login(LoginModel model)
        {
            UserHelper.Login(model);
            return Ok();
        }

        [HttpGet]
        public IActionResult Register()
        {
            ViewData["SiteKey"] = GrecaptchaSiteKey;
            ViewData["SiteAction"] = "login";
            return View();
        }

        [HttpPost]
        public ActionResult<bool> Register(RegisterUserModel req)
        {
            if (!req.User.IsValid(req.ConfirmPassword)) return false;
            if (!VerifyResponse(req.RecaptchaResponse)) return false;
            if (!UserHelper.RegisterUser(req.User)) return false;
            return true;
        }

        [HttpGet]
        public IActionResult Forgot()
        {
            ViewData["SiteKey"] = GrecaptchaSiteKey;
            ViewData["SiteAction"] = "login";
            return View();
        }

        [HttpPost]
        public ActionResult<bool> Forgot(string email)
        {
            UserHelper.Forgot(email);
            return true;
        }
    }
}