using System.Threading.Tasks;
using Squeeby_App.Models;

namespace Squeeby_App.Services
{
    public interface IUserServices
    {
        Task<bool> RegisterUser(UserModel user);
        Task<bool> Login(LoginModel user);
        void Forgot(string email);
    }
}