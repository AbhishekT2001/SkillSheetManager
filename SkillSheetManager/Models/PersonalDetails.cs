using SkillSheetManager.Controllers;

namespace SkillSheetManager.Models
{
    /// <summary>
    /// Personal Details Model Class
    /// </summary>
    public class PersonalDetails
    {
        #region Personal Details
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; }
        public byte Gender { get; set; }
        public DateTime JoiningDate { get; set; }
        public bool WorkedInJapan { get; set; }
        public string? Qualification { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string? Languages { get; set; }
        public string? Databases { get; set; }
        public byte[]? Photo { get; set; }
        public bool Del_Flg { get; set; }
        public DateTime Reg_Date { get; set; }
        public DateTime? Upd_Date { get; set; }
        #endregion
    }
}
