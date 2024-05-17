using SkillSheetManager.Controllers;

namespace SkillSheetManager.Models.UserDetails
{
    /// <summary>
    /// Personal Details Request
    /// </summary>
    public class PersonalDetailsRequest
    {
        #region public properties
        public string UserName { get; set; }
        public string Name { get; set; }
        public string Gender { get; set; }
        public string DateOFJoining { get; set; }
        public bool WorkedInJapan { get; set; }
        public string Qualification { get; set; }
        public string DateOfBirth { get; set; }
        public string Languages { get; set; }
        public string Databases { get; set; }
        public string Photo { get; set; }
        #endregion
    }
}