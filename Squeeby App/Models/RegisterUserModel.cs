namespace Squeeby_App.Models
{
    public class RegisterUserModel
    {
        public UserModel User { get; set; }
        public string ConfirmPassword { get; set; }
        public string RecaptchaResponse { get; set; }
    }
}
