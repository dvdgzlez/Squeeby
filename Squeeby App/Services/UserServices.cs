using Squeeby_App.Models;
using Squeeby_App.Repositories;
using Squeeby_App.Utils;
using System.Threading.Tasks;

namespace Squeeby_App.Services
{
    public class UserServices : IUserServices
    {
        private readonly IApplicationDbContext _context;

        public UserServices(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> RegisterUser(UserModel user)
        {
            user.Salt = MD5Hashing.CalculateMD5Hash(RandomStrings.Generate(15, true));
            user.Password = MD5Hashing.CalculateMD5Hash(user.Password + user.Salt);
            var userId = await _context.AddUser(user);
            return userId > 0;
        }

        public async Task<bool> Login(LoginModel userModel)
        {
            var user = await _context.GetUserByEmail(userModel.Email);
            if (user == null) return false;
            var password = MD5Hashing.CalculateMD5Hash(userModel.Password + user.Salt);
            if (!password.Equals(user.Password)) return false;
            return true;
        }

        public void Forgot(string email)
        {
            // TODO: send email
        }
    }
}