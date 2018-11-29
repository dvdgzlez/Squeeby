using System;
using System.Net.Mail;
using System.Text.RegularExpressions;

namespace Squeeby_App.POCO
{
    public class User
    {
        public string Name { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateTime Birthday { get; set; }

        public bool IsValid(string confirmPassword)
        {
            var mediumRegex = new Regex("^(?=.{6,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$");
            if (string.IsNullOrEmpty(Name) || string.IsNullOrEmpty(LastName) || string.IsNullOrEmpty(Email) || string.IsNullOrEmpty(Password)) return false;
            try
            {
                MailAddress m = new MailAddress(Email);
            }
            catch (FormatException)
            {
                return false;
            }
            if (!mediumRegex.IsMatch(Password) || !mediumRegex.IsMatch(confirmPassword)) return false;
            if (!Password.Equals(confirmPassword)) return false;
            return true;
        }
    }
}
