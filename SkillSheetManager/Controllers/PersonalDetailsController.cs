using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillSheetManager.Models;
using SkillSheetManager.Models.UserDetails;

namespace SkillSheetManager.Controllers
{
    /// <summary>
    /// Enum for Gender
    /// </summary>
    public enum Gender 
    { 
        Male=1, 
        Female=2 
    }

    /// <summary>
    /// Api controller for PersonalDetails Page
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class PersonalDetailsController : ControllerBase
    {
        #region private variables
        private readonly ApplicationDbContext _context;
        #endregion

        #region constructor
        /// <summary>
        /// Parameterized Constructor for intializing DbContext
        /// </summary>
        /// <param name="context"></param>
        public PersonalDetailsController(ApplicationDbContext context)
        {
            _context = context;
        }
        #endregion

        #region public methods
        /// <summary>
        /// Adds a new personal details
        /// </summary>
        /// <param name="model"> PersonalDetails object </param>
        /// <returns> Status code </returns>
        [HttpPost]
        public async Task<IActionResult> PostPersonalDetails([FromBody] PersonalDetailsRequest model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                byte[] imageBytes = null;

                if (!string.IsNullOrEmpty(model.Photo))
                {
                    string base64String = model.Photo;
                    string base64ImageWithoutPrefix = base64String.Split(",")[1];

                    imageBytes = Convert.FromBase64String(base64ImageWithoutPrefix);
                }

                var loginDetailId = GetLoginDetailIdByName(model.UserName);
                Gender genderEnum = (Gender)Enum.Parse(typeof(Gender), model.Gender, true);

                var personalDetails = await _context.PersonalDetails
                    .FirstOrDefaultAsync(pd => pd.UserId == loginDetailId);

                if (personalDetails != null)
                {
                    personalDetails.Name = model.Name;
                    personalDetails.Gender = (byte)genderEnum;
                    personalDetails.JoiningDate = DateTime.Parse(model.DateOFJoining);
                    personalDetails.WorkedInJapan = model.WorkedInJapan;
                    personalDetails.Qualification = model.Qualification;
                    personalDetails.DateOfBirth = DateTime.Parse(model.DateOfBirth);
                    personalDetails.Languages = model.Languages;
                    personalDetails.Databases = model.Databases;

                    
                    if (imageBytes != null && !ArePhotosEqual(personalDetails.Photo, imageBytes))
                    {
                        personalDetails.Photo = imageBytes;
                    }

                    personalDetails.Upd_Date = DateTime.UtcNow;
                }
                else
                {
                    personalDetails = new PersonalDetails
                    {
                        UserId = loginDetailId,
                        Name = model.Name,
                        Gender = (byte)genderEnum,
                        JoiningDate = DateTime.Parse(model.DateOFJoining),
                        WorkedInJapan = model.WorkedInJapan,
                        Qualification = model.Qualification,
                        DateOfBirth = DateTime.Parse(model.DateOfBirth),
                        Languages = model.Languages,
                        Databases = model.Databases,
                        Photo = imageBytes,
                        Del_Flg = false,
                        Reg_Date = DateTime.UtcNow,
                        Upd_Date = null
                    };

                    _context.PersonalDetails.Add(personalDetails);
                }

                await _context.SaveChangesAsync();

                return Ok(new { ResultInfo = 1, Message = "Personal details saved successfully." });
            }
            catch (Exception ex)
            {
                return Ok(new { ResultInfo = 2, ErrorCode = 500, ErrorMessage = ex.Message });
            }
        }

        /// <summary>
        /// Gets personal details by username
        /// </summary>
        /// <param name="username"> Username of the user </param>
        /// <returns> PersonalDetails object </returns>
        [HttpGet("{username}")]
        public async Task<IActionResult> GetPersonalDetailsByUsername(string username)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(username))
                {
                    return BadRequest(new { ResultInfo = 2, ErrorCode = 400, ErrorMessage = "Username is required." });
                }

                var loginDetail = await _context.LoginDetails
                    .FirstOrDefaultAsync(ld => ld.UserName == username && !ld.Del_Flg);

                if (loginDetail == null)
                {
                    return NotFound(new { ResultInfo = 2, ErrorCode = 404, ErrorMessage = "User not found." });
                }

                var personalDetails = await _context.PersonalDetails
                    .FirstOrDefaultAsync(pd => pd.UserId == loginDetail.UserId && !pd.Del_Flg);

                if (personalDetails == null)
                {
                    return NotFound(new { ResultInfo = 2, ErrorCode = 404, ErrorMessage = "Personal details not found." });
                }

                var data = new
                {
                    personalDetails.Name,
                    DateOfBirth = personalDetails.DateOfBirth.ToString("yyyy-MM-dd"),
                    personalDetails.Gender,
                    JoiningDate = personalDetails.JoiningDate.ToString("yyyy-MM-dd"), 
                    personalDetails.WorkedInJapan,
                    personalDetails.Qualification,
                    personalDetails.Languages,
                    personalDetails.Databases,
                    Photo = personalDetails.Photo != null ? Convert.ToBase64String(personalDetails.Photo) : null
                };

                return Ok(new
                {
                    ResultInfo = 1,
                    Data = data
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving personal details: {ex.Message}");
                return StatusCode(500, new { ResultInfo = 2, ErrorCode = 500, ErrorMessage = "An error occurred while retrieving personal details." });
            }
        }
        #endregion

        #region private methods
        /// <summary>
        /// Get LoginDetail Id by Name
        /// </summary>
        /// <param name="name"> Name of the user </param>
        /// <returns> LoginDetail Id </returns>
        private int GetLoginDetailIdByName(string name)
        {
            var loginDetail = _context.LoginDetails.FirstOrDefault(ld => ld.UserName == name);
            return loginDetail != null ? loginDetail.UserId : -1;
        }

        /// <summary>
        /// Check if two byte arrays are equal
        /// </summary>
        /// <param name="existingPhoto"> Existing photo </param>
        /// <param name="newPhoto"> Newly added photo </param>
        /// <returns> True if equal, false otherwise </returns>
        private bool ArePhotosEqual(byte[] existingPhoto, byte[] newPhoto)
        {
            if (existingPhoto == null || newPhoto == null)
            {
                return existingPhoto == newPhoto;
            }

            if (existingPhoto.Length != newPhoto.Length)
            {
                return false;
            }

            for (int i = 0; i < existingPhoto.Length; i++)
            {
                if (existingPhoto[i] != newPhoto[i])
                {
                    return false;
                }
            }
            return true;
        }
        #endregion
    }
}