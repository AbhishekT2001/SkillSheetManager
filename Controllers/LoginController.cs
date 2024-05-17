using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillSheetManager.Models;

namespace SkillSheetManager
{

    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LoginController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
        {
            var user = await _context.LoginDetails
                .FirstOrDefaultAsync(ld => ld.UserName == request.UserName);

            var decryptedPassword = EncryptDecryptPassword.Decrypt(user.Password);

            if (decryptedPassword == request.Password )
            {
                // Assuming you have a method to get the role name by RoleId
                var roleName = await GetRoleNameByIdAsync(user.RoleId);

                return new LoginResponse
                {
                    ResultInfo = 1,
                    UserName = user.UserName,
                    RoleId = user.RoleId,
                    RoleName = roleName
                };
            }

            return new LoginResponse
            {
                ResultInfo = 2,
                ErrorCode = 401,
                ErrorMessage = "Invalid username or password."
            };
        }

        private async Task<string> GetRoleNameByIdAsync(byte roleId)
        {
            var role = await _context.Roles.FindAsync(roleId);
            return role!.Name;
        }
    }
}