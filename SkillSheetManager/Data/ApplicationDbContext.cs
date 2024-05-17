using Microsoft.EntityFrameworkCore;
using SkillSheetManager.Models;

namespace SkillSheetManager
{
    /// <summary>
    /// ApplicationDbContext
    /// </summary>
    public class ApplicationDbContext : DbContext
    {
        #region Constructor
        /// <summary>
        /// Parameterized Constructor
        /// </summary>
        /// <param name="options"> passes the DbContextOptions configuration </param>
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
       : base(options)
        {
        }
        #endregion

        #region properties
        public DbSet<Role> Roles { get; set; }
        public DbSet<LoginDetails> LoginDetails { get; set; }
        public DbSet<PersonalDetails> PersonalDetails { get; set; }
        #endregion
    }
}
