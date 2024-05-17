using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillSheetManager.Models;
using SkillSheetManager.Models.ManagerUser;
using System.Text;

namespace SkillSheetManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManageUserController : ControllerBase
    {
        private readonly ApplicationDbContext _context; // Your EF DbContext

        public ManageUserController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserInfoResponse>>> GetAllUsers()
        {
            try
            {
                var users = await _context.LoginDetails
                    .Join(
                        _context.Roles, 
                        ld => ld.RoleId, 
                        r => r.Id,   
                        (ld, r) => new UserInfoResponse
                        {
                            Id = ld.Id,
                            RoleName = r.Name, // Access the role name from the Roles table
                            UserName = ld.UserName,
                            Email = ld.Email
                        }
                    )
                    .ToListAsync();

                return Ok(users);
            }
            catch (Exception ex)
            {
                // Log the error
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        public async Task<ActionResult<AddUser>> AddUser(AddUser user)
        {
            try
            {
                // Perform any necessary validation here
                if (string.IsNullOrEmpty(user.UserName) || string.IsNullOrEmpty(user.Password) || string.IsNullOrEmpty(user.Email))
                {
                    return BadRequest("Username, password, and email are required fields.");
                }

                // Hash the password before storing it
                string hashedPassword = EncryptDecryptPassword.Encrypt(user.Password);
                byte[] hashedPasswordBytes = Encoding.UTF8.GetBytes(hashedPassword);

                // Map the selected role to roleId
                int roleId = user.Role.ToLower() == "admin" ? 1 : 2;

                // Create a new login details entry
                var loginDetail = new LoginDetails
                {
                    UserName = user.UserName,
                    Password = hashedPasswordBytes,
                    Email = user.Email,
                    RoleId = (byte)roleId,
                    DelFlg = 'Y', 
                    RegDate = DateTime.UtcNow, 
                    UpdDate = null 
                };

                _context.LoginDetails.Add(loginDetail);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(AddUser), null);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while adding the user: {ex.Message}");
            }
        }

        [HttpDelete("Delete")]
        public async Task<ActionResult> DeleteUsers([FromBody] List<int> ids)
        {
            try
            {
                // Check if the list of IDs is empty
                if (ids == null || ids.Count == 0)
                {
                    return BadRequest("No IDs provided for deletion.");
                }

                // Find and delete the users with the specified IDs
                var usersToDelete = await _context.LoginDetails.Where(ld => ids.Contains(ld.Id)).ToListAsync();
                _context.LoginDetails.RemoveRange(usersToDelete);
                await _context.SaveChangesAsync();

                return Ok("Selected rows deleted successfully.");
            }
            catch (Exception ex)
            {
                // Log the error
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }

    }
}