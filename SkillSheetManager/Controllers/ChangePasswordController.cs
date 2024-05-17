using Microsoft.AspNetCore.Mvc;
using SkillSheetManager.Models;
using SkillSheetManager.Models.ChangePassword;

namespace SkillSheetManager.Controllers
{
    /// <summary>
    /// Api controller for Change Password
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class ChangePasswordController : ControllerBase
    {
        #region Private Variables
        private readonly ApplicationDbContext _context;
        #endregion

        #region constructors
        /// <summary>
        /// Parameterized Constructor for intializing DbContext
        /// </summary>
        /// <param name="context"> DbContext object </param>
        public ChangePasswordController(ApplicationDbContext context)
        {
            _context = context;
        }
        #endregion

        #region public methods
        /// <summary>
        /// Change Password
        /// </summary>
        /// <param name="model"> ChangePassword request object </param>
        /// <returns> Status code and message </returns>
        [HttpPost]
        public IActionResult ChangePassword([FromBody] ChangePasswordDTO model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var user = _context.LoginDetails.FirstOrDefault(u => u.UserName == model.Username);

                if (user == null)
                {
                    return Ok(new { ResultInfo = 2, ErrorCode = 404, ErrorMessage = "User not found" });
                }

                var decryptedPassword = EncryptDecryptPassword.Decrypt(user.Password);
                if (decryptedPassword != model.CurrentPassword)
                {
                    return Ok(new { ResultInfo = 2, ErrorCode = 401, ErrorMessage = "Current password is incorrect" });
                }

                var encryptedNewPassword = EncryptDecryptPassword.Encrypt(model.NewPassword);
                user.Password = encryptedNewPassword;

                _context.SaveChanges();

                return Ok(new { ResultInfo = 1, Message = "Password changed successfully" });
            }
            catch (Exception ex)
            {
                return Ok(new { ResultInfo = 2 , ErrorCode = 500, ErrorMessage = ex.Message });
            }
        }
        #endregion
    }
}