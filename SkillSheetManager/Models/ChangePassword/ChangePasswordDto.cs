namespace SkillSheetManager.Models.ChangePassword
{  
    /// <summary>
    /// Data Object for Change Password
    /// </summary>
    public class ChangePasswordDTO
    {
        #region public properties
        public string Username { get; set; }
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
        #endregion
    }
}
