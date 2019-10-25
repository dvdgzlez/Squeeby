using Squeeby_App.Models;
using System.Threading.Tasks;

namespace Squeeby_App.Repositories
{
    public interface IApplicationDbContext
    {
        Task<int> AddUser(UserModel user);
        Task<UserModel> GetUserByEmail(string email);
    }
}