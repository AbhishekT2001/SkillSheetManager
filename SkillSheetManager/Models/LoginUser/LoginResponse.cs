namespace SkillSheetManager.Models.LoginUser
{
    /// <summary>
    /// Login Response
    /// </summary>
    public class LoginResponse
    {
        #region public properties
        public int ResultInfo { get; set; }
        public string UserName { get; set; }
        public int RoleId { get; set; }
        public string RoleName { get; set; }
        public int? ErrorCode { get; set; }
        public string ErrorMessage { get; set; }
        #endregion
    }
}