using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Net.Mail;
using System.Text.RegularExpressions;

namespace Squeeby_App.Models
{
    public class UserModel
    {
        [Key]
        public int Id { get; set; }
        [Column(TypeName = "varchar(255)")]
        public string Name { get; set; }
        [Column(TypeName = "varchar(255)")]
        public string LastName { get; set; }
        [Column(TypeName = "varchar(255)")]
        public string Email { get; set; }
        [Column(TypeName = "varchar(255)")]
        public string Password { get; set; }
        [Column(TypeName = "varchar(255)")]
        public string Salt { get; set; }
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
