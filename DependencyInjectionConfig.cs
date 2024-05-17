using Microsoft.EntityFrameworkCore;

namespace SkillSheetManager
{
    public static class DependencyInjectionConfig
    {
        public static void ConfigureServices(IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
        }
    }
}
