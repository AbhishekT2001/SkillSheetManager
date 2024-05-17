namespace SkillSheetManager.Models
{
    /// <summary>
    /// Login Request
    /// </summary>
    public class LoginRequest
    { 
        #region Public Properties
        public string UserName { get; set; }
        public string Password { get; set; }
        public bool RememberMe { get; internal set; }
        #endregion
    }
}
