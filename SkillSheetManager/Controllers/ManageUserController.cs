using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillSheetManager.Models;
using SkillSheetManager.Models.ManagerUser;
using System.Text;
using CsvHelper;

namespace SkillSheetManager.Controllers
{
    /// <summary>
    /// Api controller for ManageUser Page
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class ManageUserController : ControllerBase
    {
        #region member variables
        private readonly ApplicationDbContext _context;
        #endregion

        #region Constructor
        /// <summary>
        /// Parameterized Constructor for intializing DbContext
        /// </summary>
        /// <param name="context"> DbContext object</param>
        public ManageUserController(ApplicationDbContext context)
        {
            _context = context;
        }
        #endregion

        #region Public Methods
        /// <summary>
        /// Adds a new user
        /// </summary>
        /// <param name="user"> Add User object </param>
        /// <returns> Status code </returns>
        [HttpPost]
        public async Task<ActionResult> AddUser(AddUser user)
        {
            try
            {
                if (string.IsNullOrEmpty(user.UserName) || string.IsNullOrEmpty(user.Password) || string.IsNullOrEmpty(user.Email))
                {
                    return BadRequest("Username, password, and email are required fields.");
                }

                // Check for existing usernames where Del_Flg is false (0)
                var existingUser = await _context.LoginDetails
                    .FirstOrDefaultAsync(u => u.UserName == user.UserName && u.Del_Flg == false);
                if (existingUser != null)
                {
                    return Ok(new { ResultInfo = 2, ErrorCode = 500, ErrorMessage = "User already exists." });
                }

                byte[] hashedPasswordBytes = EncryptDecryptPassword.Encrypt(user.Password);

                int roleId = user.Role.ToLower() == "admin" ? 1 : 2;

                var loginDetail = new LoginDetails
                {
                    UserName = user.UserName,
                    Password = hashedPasswordBytes,
                    Email = user.Email,
                    Role_Id = (byte)roleId,
                    Del_Flg = false,
                    Reg_Date = DateTime.UtcNow,
                    Upd_Date = null
                };

                _context.LoginDetails.Add(loginDetail);
                await _context.SaveChangesAsync();

                return Ok(new { ResultInfo = 1, Message = "User added successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    ResultInfo = 2,
                    ErrorMessage = ex.Message,
                    ErrorCode = 500
                });
            }
        }

        /// <summary>
        /// Deletes multiple users
        /// </summary>
        /// <param name="ids"> List of user IDs </param>
        /// <returns> Status code </returns>
        [HttpDelete]
        public async Task<ActionResult> DeleteUsers([FromBody] List<int> ids)
        {
            try
            {
                if (ids == null || ids.Count == 0)
                {
                    return Ok(new {ResultInfo = 2, errorMessage = "No IDs provided for deletion."});
                }

                ids.Remove(1);

                if (ids.Count == 0)
                {
                    return Ok(new { ResultInfo = 2, errorMessage = "No users to delete." });
                }
                var usersToDelete = await _context.LoginDetails
                    .Where(ld => ids.Contains(ld.UserId))
                    .ToListAsync();

                foreach (var user in usersToDelete)
                {
                    user.Del_Flg = true;
                }

                await _context.SaveChangesAsync();

                return Ok(new { ResultInfo = 1, Message = "Selected rows marked as deleted successfully." });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, new { ResultInfo = 2, ErrorCode = 500, ErrorMessage = ex.Message });
            }
        }

        /// <summary>
        /// Updates a user
        /// </summary>
        /// <param name="userId"> User ID </param>
        /// <param name="request"> Update User object </param>
        /// <returns> Status code </returns>
        [HttpPut("Update/{userId}")]
        public async Task<ActionResult> UpdateUser(int userId, [FromBody] UpdateUserRequest request)
        {
            try
            {

                var user = await _context.LoginDetails.FindAsync(userId);

                if (user.UserId == 1)
                {
                    return Ok(new { ResultInfo = 2, errorMessage = "User with ID 1 cannot be updated." });
                }
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                if (request.Role != null && !string.IsNullOrWhiteSpace(request.Role))
                {
                    user.Role_Id = (byte)(request.Role.ToLower() == "admin" ? 1 : 2);
                }
                if (request.UserName != null && !string.IsNullOrWhiteSpace(request.UserName))
                {
                    user.UserName = request.UserName;
                }
                if (request.Email != null && !string.IsNullOrWhiteSpace(request.Email))
                {
                    user.Email = request.Email;
                }
                if (request.Password != null && !string.IsNullOrWhiteSpace(request.Password))
                {
                    byte[] hashedPassword = EncryptDecryptPassword.Encrypt(request.Password);
                    user.Password = hashedPassword;
                }

                user.Upd_Date = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { ResultInfo = 1, Message = "User updated successfully." });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, new { ResultInfo = 2, ErrorCode = 500, ErrorMessage = ex.Message });
            }
        }

        /// <summary>
        /// Gets a user information by ID
        /// </summary>
        /// <param name="userId"> User ID </param>
        /// <returns> User object </returns>
        [HttpGet("GetUserById/{userId}")]
        public async Task<ActionResult> GetUserById(int userId)
        {
            try
            {
                var user = await _context.LoginDetails.FindAsync(userId);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                if (userId == 1)
                {
                    return Ok(new {ResultInfo = 2, errorMessage = "User with ID 1 cannot be deleted."});
                }

                var userData = new
                {
                    UserName = user.UserName,
                    Email = user.Email,
                    password = EncryptDecryptPassword.Decrypt(user.Password).ToString(),
                    user.Role_Id
                };

                return Ok(userData);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Gets data of the user in the form of a paged list
        /// </summary>
        /// <param name="pageNo"> Page number </param>
        /// <param name="pageSize"> Page size </param>
        /// <returns> User object </returns>
        [HttpGet]
        public IActionResult GetPageData(int pageNo, int pageSize)
        {
            try
            {
                if (pageNo <= 0 || pageSize <= 0)
                {
                    return BadRequest("Page number and page size must be positive integers.");
                }

                int skip = (pageNo - 1) * pageSize;

                var pageData = _context.LoginDetails
                    .Where(ld => ld.Del_Flg == false) 
                    .Join(
                        _context.Roles,
                        ld => ld.Role_Id,
                        r => r.Id,
                        (ld, r) => new
                        {
                            ld.UserId,
                            ld.UserName,
                            ld.Email,
                            RoleName = r.Name
                        }
                    )
                    .OrderBy(d => d.UserId)
                    .Skip(skip)
                    .Take(pageSize)
                    .ToList();

                int totalCount = _context.LoginDetails.Count(ld => ld.Del_Flg == false);

                return Ok(new { pageData = pageData, totalCount = totalCount });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        /// <summary>
        /// Exports data of the user in the form of a CSV file
        /// </summary>
        /// <returns> Status code </returns>
        [HttpGet("export")]
        public IActionResult ExportPersonalDetails()
        {
            try
            {
                var personalDetails = _context.LoginDetails
                    .Where(ld => !ld.Del_Flg)
                    .GroupJoin(_context.PersonalDetails.Where(pd => !pd.Del_Flg),
                        ld => ld.UserId,
                        pd => pd.UserId,
                        (ld, pdGroup) => new
                        {
                            ld.UserId,
                            ld.UserName,
                            ld.Email,
                            Role = ld.Role_Id == 1 ? "Admin" : "User",
                            PersonalDetails = pdGroup.FirstOrDefault()
                        })
                    .ToList();

                var csvContent = new StringBuilder();
                csvContent.AppendLine("Id,UserName,Email,Name,Gender,JoiningDate,WorkedInJapan,DateOfBirth,Qualification,Languages,Databases,Role");

                foreach (var detail in personalDetails)
                {
                    var name = detail.PersonalDetails?.Name ?? "";
                    var gender = detail.PersonalDetails != null
                        ? ((Gender)detail.PersonalDetails.Gender) == Gender.Male ? "Male" : ((Gender)detail.PersonalDetails.Gender) == Gender.Female ? "Female" : "Unknown"
                        : "";
                    var joiningDate = detail.PersonalDetails?.JoiningDate.ToString("yyyy-MM-dd") ?? "";
                    var workedInJapan = detail.PersonalDetails?.WorkedInJapan.ToString() ?? "";
                    var dateOfBirth = detail.PersonalDetails?.DateOfBirth.ToString("yyyy-MM-dd") ?? "";
                    var qualifications = detail.PersonalDetails != null ? string.Join("; ", detail.PersonalDetails.Qualification?.Split(',') ?? new string[0]) : "";
                    var languages = detail.PersonalDetails != null ? string.Join("; ", detail.PersonalDetails.Languages?.Split(',') ?? new string[0]) : "";
                    var databases = detail.PersonalDetails != null ? string.Join("; ", detail.PersonalDetails.Databases?.Split(',') ?? new string[0]) : "";
                    var role = detail.Role;

                    csvContent.AppendLine($"{detail.UserId},{detail.UserName},{detail.Email},{name},{gender},{joiningDate},{workedInJapan},{dateOfBirth},{qualifications},{languages},{databases},{role}");
                }

                var csvBytes = Encoding.UTF8.GetBytes(csvContent.ToString());

                Response.Headers.Append("Content-Disposition", "attachment; filename=PersonalDetails.csv");
                Response.ContentType = "text/csv";

                return File(csvBytes, "text/csv");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An error occurred while exporting personal details.", message = ex.Message });
            }
        }

        /// <summary>
        /// Imports data of the user in the form of a CSV file
        /// </summary>
        /// <returns></returns>
        [HttpPost("ImportUser")]
        public async Task<IActionResult> ImportData()
        {
            try
            {
                if (!Request.Form.Files.Any())
                {
                    return BadRequest("No file uploaded.");
                }

                var file = Request.Form.Files[0];

                if (file.Length == 0)
                {
                    return BadRequest("Empty file uploaded.");
                }

                List<string> problematicUsers = new List<string>(); 

                using (var reader = new StreamReader(file.OpenReadStream()))
                using (var csv = new CsvReader(reader, System.Globalization.CultureInfo.InvariantCulture))
                {
                    var records = csv.GetRecords<ImportUserModel>().ToList();

                    foreach (var record in records)
                    {
                        try
                        {
                            
                            var existingUser = await _context.LoginDetails.FirstOrDefaultAsync(ld => ld.UserName == record.UserName);
                            if (existingUser != null)
                            {
                                problematicUsers.Add(record.UserName);
                                continue;
                            }

                            var newUser = new LoginDetails
                            {
                                UserName = record.UserName,
                                Password = EncryptDecryptPassword.Encrypt("User@1234"),
                                Email = record.Email,
                                Role_Id = (byte)(record.Role.ToLower() == "admin" ? 1 : 2),
                                Del_Flg = false,
                                Reg_Date = DateTime.UtcNow,
                                Upd_Date = null
                            };

                            _context.LoginDetails.Add(newUser);
                        }
                        catch (Exception)
                        {
                            problematicUsers.Add(record.UserName);
                        }
                    }

                    await _context.SaveChangesAsync();
                }

                if (problematicUsers.Count > 0)
                {
                    return Ok(new
                    {
                        ResultInfo = 2,
                        ErrorMessage = $"Import completed with errors for users: {string.Join(", ", problematicUsers)}"
                    });
                }
                else
                {
                    return Ok(new
                    {
                        ResultInfo = 1,
                        Message = "Data imported successfully."
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
        #endregion
    }
}