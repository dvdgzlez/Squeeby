using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Squeeby_App.Models;
using Squeeby_App.Services;
using System.Threading.Tasks;

namespace Squeeby_App.Controllers
{
    public class AccountController : SqueebyController
    {
        private readonly UserServices _userServices;
        private readonly GreCaptchaModel _greCaptcha;

        public AccountController(UserServices userServices, IOptions<AppSettingsModel> appSettings) : base (appSettings)
        {
            _userServices = userServices;
            _greCaptcha = appSettings.Value.GreCaptcha;
        }

        [HttpGet("signin")]
        public IActionResult Login()
        {
            ViewData["SiteKey"] = _greCaptcha.SiteKey;
            ViewData["SiteAction"] = "login";
            return View();
        }

        [HttpPost("signin")]
        public async Task<IActionResult> Login(LoginModel model)
        {
            await _userServices.Login(model);
            return Ok();
        }

        [HttpGet("register")]
        public IActionResult Register()
        {
            ViewData["SiteKey"] = _greCaptcha.SiteKey;
            ViewData["SiteAction"] = "login";
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Register(RegisterUserModel req)
        {
            if (!req.User.IsValid(req.ConfirmPassword)) return NotFound();
            if (!VerifyResponse(req.RecaptchaResponse)) return NotFound();
            if (!await _userServices.RegisterUser(req.User)) return NotFound();
            return Ok();
        }

        [HttpGet("forgot")]
        public IActionResult Forgot()
        {
            ViewData["SiteKey"] = _greCaptcha.SiteKey;
            ViewData["SiteAction"] = "login";
            return View();
        }

        [HttpPost("forgot")]
        public async Task<IActionResult> Forgot(string email)
        {
            await _userServices.Forgot(email);
            return Ok();
        }
    }
}
