using Squeeby_App.POCO;

namespace Squeeby_App.Models
{
    public class RegisterUserModel
    {
        public User User { get; set; }
        public string ConfirmPassword { get; set; }
        public string RecaptchaResponse { get; set; }
    }
}
