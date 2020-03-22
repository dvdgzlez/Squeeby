using Microsoft.EntityFrameworkCore;
using Squeeby_App.Models;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace Squeeby_App.Repositories
{
    public class ApplicationDbContext : DbContext, IApplicationDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
            Database?.EnsureCreated();
        }

        public virtual DbSet<UserModel> users { get; set; }

        public async Task<int> AddUser(UserModel user)
        {
            users.Add(user);
            await SaveChangesAsync();
            return user.Id;
        }

        public async Task<UserModel> GetUserByEmail(string email)
        {
            var user = await users.FirstOrDefaultAsync(u => u.Email == email);
            return user;
        }
    }
}