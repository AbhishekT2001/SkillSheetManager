using Microsoft.EntityFrameworkCore;
using SkillSheetManager.Models;

namespace SkillSheetManager
{
    public class ApplicationDbContext : DbContext
    {

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
       : base(options)
        {
        }

        public DbSet<Role> Roles { get; set; }
        public DbSet<LoginDetails> LoginDetails { get; set; }

    }
}
