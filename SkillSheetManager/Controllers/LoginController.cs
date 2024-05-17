using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillSheetManager.Models;
using SkillSheetManager.Models.LoginUser;
using System.Security.Claims;

namespace SkillSheetManager
{
    /// <summary>
    /// Api controller for the User Login
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        #region private variable
        private readonly ApplicationDbContext _context;
        #endregion

        #region Constructor
        /// <summary>
        /// Parameterized Constructor for intializing DbContext
        /// </summary>
        /// <param name="context"> DbContext object </param>
        public LoginController(ApplicationDbContext context)
        {
            _context = context;
        }
        #endregion

        #region Public Methods
        /// <summary>
        /// Logging in the user
        /// </summary>
        /// <param name="request"> Login Request object </param>
        /// <returns> status code and error message or user details </returns>
        [HttpPost]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
        {
            var user = await _context.LoginDetails.FirstOrDefaultAsync(ld => ld.UserName == request.UserName);

            if (user == null)
            {
                return new LoginResponse
                {
                    ResultInfo = 2,
                    ErrorCode = 401,
                    ErrorMessage = "Invalid username or password."
                };
            }

            string decryptedPassword = EncryptDecryptPassword.Decrypt(user.Password);

            if (decryptedPassword == request.Password)
            {
                // Create claims for the user
                var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Role, await GetRoleNameByIdAsync(user.Role_Id))
        };
                
                var identity = new ClaimsIdentity(claims, "Login");
                var principal = new ClaimsPrincipal(identity);

                await HttpContext.SignInAsync("Cookies", principal, new AuthenticationProperties
                {
                    IsPersistent = request.RememberMe,
                    ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(30)
                });

                return new LoginResponse
                {
                    ResultInfo = 1,
                    UserName = user.UserName,
                    RoleId = user.Role_Id,
                    RoleName = await GetRoleNameByIdAsync(user.Role_Id)
                };
            }

            return new LoginResponse
            {
                ResultInfo = 2,
                ErrorCode = 401,
                ErrorMessage = "Invalid username or password."
            };
        }
        #endregion

        #region Private Methods
        /// <summary>
        /// Get Role Name by Id
        /// </summary>
        /// <param name="roleId"> Role Id </param>
        /// <returns> Role Name </returns>
        private async Task<string> GetRoleNameByIdAsync(int roleId)
        {
            var role = await _context.Roles.FindAsync(roleId);
            return role!.Name;
        }
        #endregion
    }
}